'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { serverEnv } from '@/lib/env';

import { getDb } from '../db/client';
import { leadStatuses, type LeadStatus } from '../db/schema';
import { isRateLimited, recordAttempt } from '../leads/service';
import { hashIp } from '../security/hash';

import { deleteLead, updateLead } from './leads';
import { markUnsubscribed } from './newsletter';
import { adminEnabled, endSession, hasSession, passwordMatches, startSession } from './session';

export type LoginState = { error?: string };

const LOGIN_LIMITS = [{ windowSeconds: 15 * 60, max: 10 }];

export async function login(_previous: LoginState, formData: FormData): Promise<LoginState> {
  if (!adminEnabled()) return { error: 'The admin area is not configured.' };

  const list = await headers();
  const ip = list.get('x-forwarded-for')?.split(',')[0]?.trim() || list.get('x-real-ip') || null;
  const ipHash = hashIp(ip, serverEnv().IP_HASH_SALT);
  const db = await getDb();

  if (await isRateLimited(db, 'admin_login', ipHash, LOGIN_LIMITS)) {
    return { error: 'Too many attempts. Wait 15 minutes and try again.' };
  }

  const password = formData.get('password');
  if (typeof password !== 'string' || !passwordMatches(password)) {
    await recordAttempt(db, 'admin_login', ipHash, 'failed');
    return { error: 'That password is not right.' };
  }

  await recordAttempt(db, 'admin_login', ipHash, 'success');
  await startSession();
  redirect('/admin/leads');
}

export async function logout() {
  await endSession();
  redirect('/admin');
}

export async function saveLead(formData: FormData) {
  if (!(await hasSession())) redirect('/admin');
  const id = String(formData.get('id') ?? '');
  const status = String(formData.get('status') ?? '');
  const notes = String(formData.get('internalNotes') ?? '');
  if (!leadStatuses.includes(status as LeadStatus)) return;
  const db = await getDb();
  await updateLead(db, id, { status: status as LeadStatus, internalNotes: notes });
  redirect(`/admin/leads/${id}?saved=1`);
}

/** Permanent deletion, only after the confirmation box has been ticked. */
export async function removeLead(formData: FormData) {
  if (!(await hasSession())) redirect('/admin');
  const id = String(formData.get('id') ?? '');
  if (formData.get('confirm') !== 'yes') redirect(`/admin/leads/${id}?confirm=1`);
  const db = await getDb();
  await deleteLead(db, id);
  redirect('/admin/leads?deleted=1');
}

export async function stopNewsletter(formData: FormData) {
  if (!(await hasSession())) redirect('/admin');
  const db = await getDb();
  await markUnsubscribed(db, String(formData.get('id') ?? ''));
  redirect('/admin/newsletter?updated=1');
}
