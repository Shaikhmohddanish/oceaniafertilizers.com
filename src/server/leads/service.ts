import { createHash, randomBytes, randomInt } from 'node:crypto';

import { and, eq, gte, lt } from 'drizzle-orm';

import { formAttempts, leads, newsletterSubscribers, type LeadConsents, type LeadForm, type NotificationStatus } from '../db/schema';
import type { AppDatabase } from '../db/types';

/*
 * Lead persistence. Plain functions that take the database, so they can be
 * tested against an in-memory PGlite. No 'server-only' import for that reason.
 */

const REFERENCE_ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // no 0, O, 1 or I

/** A short reference people can read out over the phone, for example OF-7K2Q9C. */
export function createReference(): string {
  let code = '';
  for (let index = 0; index < 6; index += 1) code += REFERENCE_ALPHABET[randomInt(REFERENCE_ALPHABET.length)];
  return `OF-${code}`;
}

/** Calendar date in India (YYYY-MM-DD), used to group repeat submissions by day. */
export function istDate(date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
}

export function dedupeKey(form: string, parts: (string | undefined)[], date = new Date()): string {
  const normalised = parts.map((part) => (part ?? '').trim().toLowerCase());
  return createHash('sha256').update([form, ...normalised, istDate(date)].join('|')).digest('hex');
}

export type LeadInput = {
  form: LeadForm;
  fullName: string;
  phone?: string;
  email?: string;
  state?: string;
  district?: string;
  details: Record<string, unknown>;
  consents: LeadConsents;
  sourcePath?: string;
  utm?: Record<string, string>;
  ipHash?: string;
  userAgent?: string;
  /** Values that identify a repeat submission, for example the phone number and product. */
  dedupeParts: (string | undefined)[];
};

export type InsertLeadResult = { status: 'created'; id: string; reference: string } | { status: 'duplicate' };

function uniqueViolation(error: unknown, constraint: string): boolean {
  const candidates = [error, (error as { cause?: unknown })?.cause];
  return candidates.some((candidate) => {
    const value = candidate as { code?: string; constraint?: string; message?: string } | undefined;
    return value?.code === '23505' && (value.constraint === constraint || Boolean(value.message?.includes(constraint)));
  });
}

/** Inserts a lead. A repeat of the same submission on the same day is reported, not stored twice. */
export async function insertLead(db: AppDatabase, input: LeadInput, now = new Date()): Promise<InsertLeadResult> {
  const key = dedupeKey(input.form, input.dedupeParts, now);
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const reference = createReference();
    try {
      const rows = await db
        .insert(leads)
        .values({
          reference,
          form: input.form,
          fullName: input.fullName,
          phone: input.phone,
          email: input.email,
          state: input.state,
          district: input.district,
          details: input.details,
          consents: input.consents,
          sourcePath: input.sourcePath,
          utm: input.utm,
          ipHash: input.ipHash,
          userAgent: input.userAgent,
          dedupeKey: key,
          createdAt: now,
          updatedAt: now,
        })
        .onConflictDoNothing({ target: leads.dedupeKey })
        .returning({ id: leads.id, reference: leads.reference });
      const row = rows[0];
      return row ? { status: 'created', id: row.id, reference: row.reference } : { status: 'duplicate' };
    } catch (error) {
      // An identical reference is astronomically unlikely; try a new one.
      if (attempt < 2 && uniqueViolation(error, 'leads_reference_unique')) continue;
      throw error;
    }
  }
  throw new Error('Could not allocate a lead reference.');
}

export async function setNotificationStatus(
  db: AppDatabase,
  id: string,
  status: NotificationStatus,
  error?: string,
): Promise<void> {
  await db
    .update(leads)
    .set({ notificationStatus: status, notificationError: error ?? null, updatedAt: new Date() })
    .where(eq(leads.id, id));
}

/* Newsletter */

export type SubscribeResult = 'created' | 'duplicate';

export async function subscribeToNewsletter(
  db: AppDatabase,
  input: { email: string; consentText: string; sourcePath?: string },
): Promise<SubscribeResult> {
  const [existing] = await db
    .select({ id: newsletterSubscribers.id, status: newsletterSubscribers.status })
    .from(newsletterSubscribers)
    .where(eq(newsletterSubscribers.email, input.email))
    .limit(1);

  if (existing?.status === 'subscribed') return 'duplicate';

  if (existing) {
    await db
      .update(newsletterSubscribers)
      .set({ status: 'subscribed', consentText: input.consentText, sourcePath: input.sourcePath, updatedAt: new Date() })
      .where(eq(newsletterSubscribers.id, existing.id));
    return 'created';
  }

  const rows = await db
    .insert(newsletterSubscribers)
    .values({
      email: input.email,
      consentText: input.consentText,
      sourcePath: input.sourcePath,
      unsubscribeToken: randomBytes(24).toString('base64url'),
    })
    .onConflictDoNothing({ target: newsletterSubscribers.email })
    .returning({ id: newsletterSubscribers.id });
  return rows.length > 0 ? 'created' : 'duplicate';
}

// Unsubscribe tokens are 24 random bytes in base64url (32 characters).
const TOKEN_PATTERN = /^[A-Za-z0-9_-]{20,64}$/;

/** The subscriber behind an unsubscribe link, or null when the token is unknown. */
export async function findSubscriberByToken(
  db: AppDatabase,
  token: string,
): Promise<{ email: string; status: 'subscribed' | 'unsubscribed' } | null> {
  if (!TOKEN_PATTERN.test(token)) return null;
  const [row] = await db
    .select({ email: newsletterSubscribers.email, status: newsletterSubscribers.status })
    .from(newsletterSubscribers)
    .where(eq(newsletterSubscribers.unsubscribeToken, token))
    .limit(1);
  return row ?? null;
}

/** Stops the newsletter for the subscriber behind a link. False when the token is unknown. */
export async function unsubscribeByToken(db: AppDatabase, token: string): Promise<boolean> {
  if (!TOKEN_PATTERN.test(token)) return false;
  const rows = await db
    .update(newsletterSubscribers)
    .set({ status: 'unsubscribed', updatedAt: new Date() })
    .where(eq(newsletterSubscribers.unsubscribeToken, token))
    .returning({ id: newsletterSubscribers.id });
  return rows.length > 0;
}

/* Rate limiting */

export type RateLimitRule = { windowSeconds: number; max: number };

/** Generous for people correcting a form, tight enough to stop floods. */
export const DEFAULT_RATE_LIMITS: RateLimitRule[] = [
  { windowSeconds: 10 * 60, max: 8 },
  { windowSeconds: 24 * 60 * 60, max: 30 },
];

export async function isRateLimited(
  db: AppDatabase,
  form: string,
  ipHash: string,
  rules: RateLimitRule[] = DEFAULT_RATE_LIMITS,
  now = new Date(),
): Promise<boolean> {
  const longest = Math.max(...rules.map((rule) => rule.windowSeconds));
  const rows = await db
    .select({ createdAt: formAttempts.createdAt })
    .from(formAttempts)
    .where(
      and(
        eq(formAttempts.form, form),
        eq(formAttempts.ipHash, ipHash),
        gte(formAttempts.createdAt, new Date(now.getTime() - longest * 1000)),
      ),
    );
  return rules.some(
    (rule) => rows.filter((row) => row.createdAt.getTime() >= now.getTime() - rule.windowSeconds * 1000).length >= rule.max,
  );
}

export async function recordAttempt(db: AppDatabase, form: string, ipHash: string, outcome: string, now = new Date()) {
  await db.insert(formAttempts).values({ form, ipHash, outcome, createdAt: now });
  if (Math.random() < 0.02) await pruneAttempts(db, now);
}

export async function pruneAttempts(db: AppDatabase, now = new Date()) {
  await db.delete(formAttempts).where(lt(formAttempts.createdAt, new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)));
}
