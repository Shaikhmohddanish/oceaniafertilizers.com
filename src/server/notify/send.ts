import 'server-only';

import { Resend } from 'resend';

import { notifyRecipients, serverEnv } from '@/lib/env';

import type { NotificationStatus } from '../db/schema';

import { leadEmailHtml, leadEmailSubject, leadEmailText, type LeadEmailInput } from './lead-email';

export type SendResult = { status: Extract<NotificationStatus, 'sent' | 'failed' | 'not_configured'>; error?: string };

/** Emails the business team about a new lead through Resend, when configured. */
export async function sendLeadNotification(input: LeadEmailInput): Promise<SendResult> {
  const { RESEND_API_KEY, LEADS_NOTIFY_FROM } = serverEnv();
  const to = notifyRecipients();
  if (!RESEND_API_KEY || !LEADS_NOTIFY_FROM || to.length === 0) return { status: 'not_configured' };

  try {
    const resend = new Resend(RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: LEADS_NOTIFY_FROM,
      to,
      replyTo: input.email,
      subject: leadEmailSubject(input),
      text: leadEmailText(input),
      html: leadEmailHtml(input),
    });
    if (error) return { status: 'failed', error: `${error.name}: ${error.message}`.slice(0, 500) };
    return { status: 'sent' };
  } catch (error) {
    return { status: 'failed', error: String(error).slice(0, 500) };
  }
}
