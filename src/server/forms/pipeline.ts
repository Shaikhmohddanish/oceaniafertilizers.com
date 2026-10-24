import 'server-only';

import { headers } from 'next/headers';
import { after } from 'next/server';
import type { z } from 'zod';

import { serverEnv } from '@/lib/env';
import {
  HONEYPOT_FIELD,
  SOURCE_FIELD,
  STARTED_AT_FIELD,
  TURNSTILE_FIELD,
  UTM_FIELD,
  type FormState,
} from '@/lib/forms/state';
import { absoluteUrl } from '@/lib/site-config';
import { fieldErrors, formDataToObject } from '@/lib/validation/forms';

import { getDb } from '../db/client';
import type { LeadForm } from '../db/schema';
import { insertLead, isRateLimited, recordAttempt, setNotificationStatus, subscribeToNewsletter, type LeadInput } from '../leads/service';
import { sendLeadNotification } from '../notify/send';
import { hashIp } from '../security/hash';
import { verifyTurnstile } from '../security/turnstile';

export const MESSAGES = {
  invalid: 'Some details need another look. Check the highlighted fields and try again.',
  duplicate: 'We already have this from you today, so there is no need to send it again. Our team will be in touch.',
  rateLimited:
    'We have received several submissions from your connection in a short time. Please wait a few minutes and try again.',
  unavailable: 'Sorry, we could not save your details just now, so nothing was sent. Please try again in a few minutes.',
  securityCheck: 'We could not complete the security check. Please try again.',
  tooFast: 'Please take a moment to check your details, then send the form again.',
  rejected: 'Sorry, we could not accept this submission. Please check your details and try again.',
} as const;

const MIN_FILL_MS = 2000;
const INTERNAL_FIELDS = new Set([HONEYPOT_FIELD, STARTED_AT_FIELD, SOURCE_FIELD, UTM_FIELD, TURNSTILE_FIELD]);

type RequestInfo = { ip: string | null; userAgent?: string };

async function requestInfo(): Promise<RequestInfo> {
  const list = await headers();
  const forwarded = list.get('x-forwarded-for')?.split(',')[0]?.trim();
  return {
    ip: forwarded || list.get('x-real-ip') || null,
    userAgent: list.get('user-agent')?.slice(0, 200) ?? undefined,
  };
}

function echo(raw: Record<string, string | string[]>): Record<string, string | string[]> {
  return Object.fromEntries(Object.entries(raw).filter(([key]) => !INTERNAL_FIELDS.has(key) && !key.startsWith('$ACTION')));
}

function sourcePath(raw: Record<string, string | string[]>): string | undefined {
  const value = raw[SOURCE_FIELD];
  return typeof value === 'string' && value.startsWith('/') && value.length <= 200 ? value : undefined;
}

function utm(raw: Record<string, string | string[]>): Record<string, string> | undefined {
  const value = raw[UTM_FIELD];
  if (typeof value !== 'string' || value === '') return undefined;
  try {
    const parsed = JSON.parse(value) as Record<string, unknown>;
    const allowed = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
    const clean = Object.fromEntries(
      Object.entries(parsed)
        .filter(([key, entry]) => allowed.includes(key) && typeof entry === 'string' && entry.length <= 100)
        .map(([key, entry]) => [key, String(entry)]),
    );
    return Object.keys(clean).length > 0 ? clean : undefined;
  } catch {
    return undefined;
  }
}

/** Honeypot filled, or the form submitted faster than a person could fill it. */
function spamSignal(raw: Record<string, string | string[]>): keyof typeof MESSAGES | null {
  const honeypot = raw[HONEYPOT_FIELD];
  if (typeof honeypot === 'string' && honeypot.trim() !== '') return 'rejected';
  const started = Number(raw[STARTED_AT_FIELD]);
  if (Number.isFinite(started) && started > 0 && Date.now() - started < MIN_FILL_MS) return 'tooFast';
  return null;
}

function logError(event: string, form: string, error: unknown) {
  // No form values here: logs must not contain personal data.
  console.error(JSON.stringify({ level: 'error', event, form, error: error instanceof Error ? error.message : String(error) }));
}

/** Common checks shared by every form, before anything is stored. */
type Prechecked<T> =
  | { ok: false; state: FormState }
  | {
      ok: true;
      data: T;
      raw: Record<string, string | string[]>;
      values: Record<string, string | string[]>;
      info: RequestInfo;
      respondedAt: number;
    };

async function precheck<T>(schema: z.ZodType<T>, formData: FormData): Promise<Prechecked<T>> {
  const raw = formDataToObject(formData);
  const values = echo(raw);
  const respondedAt = Date.now();

  const spam = spamSignal(raw);
  if (spam) return { ok: false, state: { status: 'error', message: MESSAGES[spam], values, respondedAt } };

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      state: { status: 'invalid', message: MESSAGES.invalid, fieldErrors: fieldErrors(parsed.error), values, respondedAt },
    };
  }

  const info = await requestInfo();
  const turnstile = await verifyTurnstile(formData.get(TURNSTILE_FIELD), info.ip);
  if (turnstile === 'failed') {
    return { ok: false, state: { status: 'error', message: MESSAGES.securityCheck, values, respondedAt } };
  }

  return { ok: true, data: parsed.data, raw, values, info, respondedAt };
}

export type LeadDefinition<T> = {
  form: LeadForm;
  schema: z.ZodType<T>;
  build: (data: T) => Omit<LeadInput, 'form' | 'sourcePath' | 'utm' | 'ipHash' | 'userAgent'>;
  successMessage: string;
};

/**
 * Validates, rate-limits, stores and then notifies. Success is only returned
 * after the lead has been stored; the email goes out after the response.
 */
export async function handleLeadSubmission<T>(definition: LeadDefinition<T>, formData: FormData): Promise<FormState> {
  const checked = await precheck(definition.schema, formData);
  if (!checked.ok) return checked.state;
  const { data, raw, values, info, respondedAt } = checked;

  let db;
  try {
    db = await getDb();
  } catch (error) {
    logError('database_unavailable', definition.form, error);
    return { status: 'error', message: MESSAGES.unavailable, values, respondedAt };
  }

  const ipHash = hashIp(info.ip, serverEnv().IP_HASH_SALT);
  try {
    if (await isRateLimited(db, definition.form, ipHash)) {
      await recordAttempt(db, definition.form, ipHash, 'rate_limited');
      return { status: 'rate_limited', message: MESSAGES.rateLimited, values, respondedAt };
    }

    const lead = definition.build(data);
    const result = await insertLead(db, {
      ...lead,
      form: definition.form,
      sourcePath: sourcePath(raw),
      utm: utm(raw),
      ipHash,
      userAgent: info.userAgent,
    });
    await recordAttempt(db, definition.form, ipHash, result.status);

    if (result.status === 'duplicate') return { status: 'duplicate', message: MESSAGES.duplicate, respondedAt };

    const database = db;
    after(async () => {
      const sent = await sendLeadNotification({
        id: result.id,
        reference: result.reference,
        form: definition.form,
        fullName: lead.fullName,
        phone: lead.phone,
        email: lead.email,
        state: lead.state,
        district: lead.district,
        details: lead.details,
        consents: lead.consents,
        sourcePath: sourcePath(raw),
        adminUrl: absoluteUrl(`/admin/leads/${result.id}`),
      });
      if (sent.status === 'failed') logError('notification_failed', definition.form, sent.error);
      try {
        await setNotificationStatus(database, result.id, sent.status, sent.error);
      } catch (error) {
        logError('notification_status_update_failed', definition.form, error);
      }
    });

    return { status: 'success', message: definition.successMessage, reference: result.reference, respondedAt };
  } catch (error) {
    logError('lead_insert_failed', definition.form, error);
    return { status: 'error', message: MESSAGES.unavailable, values, respondedAt };
  }
}

/** Newsletter sign-up: same protections, stored in its own table. */
export async function handleNewsletterSubmission<T extends { email: string }>(
  schema: z.ZodType<T>,
  consentText: string,
  formData: FormData,
): Promise<FormState> {
  const checked = await precheck(schema, formData);
  if (!checked.ok) return checked.state;
  const { data, raw, values, info, respondedAt } = checked;

  try {
    const db = await getDb();
    const ipHash = hashIp(info.ip, serverEnv().IP_HASH_SALT);
    if (await isRateLimited(db, 'newsletter', ipHash)) {
      await recordAttempt(db, 'newsletter', ipHash, 'rate_limited');
      return { status: 'rate_limited', message: MESSAGES.rateLimited, values, respondedAt };
    }
    const result = await subscribeToNewsletter(db, { email: data.email, consentText, sourcePath: sourcePath(raw) });
    await recordAttempt(db, 'newsletter', ipHash, result);
    return result === 'duplicate'
      ? { status: 'duplicate', message: 'This email address is already subscribed. Thank you.', respondedAt }
      : { status: 'success', message: 'Thank you. You are subscribed to the Oceania newsletter.', respondedAt };
  } catch (error) {
    logError('newsletter_failed', 'newsletter', error);
    return { status: 'error', message: MESSAGES.unavailable, values, respondedAt };
  }
}
