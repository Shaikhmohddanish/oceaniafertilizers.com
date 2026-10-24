import { eq } from 'drizzle-orm';
import { beforeAll, describe, expect, it } from 'vitest';

import { deleteLead, getLead, listLeads, parseFilters } from '@/server/admin/leads';
import { exportSubscribed, listSubscribers, markUnsubscribed, subscribersToCsv } from '@/server/admin/newsletter';
import { createPgliteDatabase } from '@/server/db/pglite';
import { leads, newsletterSubscribers } from '@/server/db/schema';
import type { AppDatabase } from '@/server/db/types';
import {
  createReference,
  dedupeKey,
  findSubscriberByToken,
  insertLead,
  isRateLimited,
  istDate,
  pruneAttempts,
  recordAttempt,
  setNotificationStatus,
  subscribeToNewsletter,
  unsubscribeByToken,
  type LeadInput,
} from '@/server/leads/service';

let db: AppDatabase;

beforeAll(async () => {
  db = await createPgliteDatabase();
});

const lead = (overrides: Partial<LeadInput> = {}): LeadInput => ({
  form: 'farm_callback',
  fullName: 'Test Farmer',
  phone: '+919876543210',
  state: 'Karnataka',
  district: 'Raichur',
  details: { crop: 'Cotton' },
  consents: { privacy: true, contact: true, whatsapp: false, version: 'test' },
  dedupeParts: ['+919876543210', 'Cotton'],
  ...overrides,
});

describe('references and keys', () => {
  it('creates readable references without ambiguous characters', () => {
    for (let index = 0; index < 50; index += 1) expect(createReference()).toMatch(/^OF-[2-9A-HJ-NP-Z]{6}$/);
  });

  it('groups by calendar day in India', () => {
    // 19:00 UTC is already the next day in India (UTC+5:30).
    expect(istDate(new Date('2026-10-24T19:00:00Z'))).toBe('2026-10-25');
    expect(dedupeKey('contact', ['A'], new Date('2026-10-24T10:00:00Z'))).toBe(dedupeKey('contact', ['a '], new Date('2026-10-24T12:00:00Z')));
  });
});

describe('insertLead', () => {
  it('stores a lead and reports a same-day repeat as a duplicate', async () => {
    const now = new Date('2026-10-24T06:00:00Z');
    const first = await insertLead(db, lead(), now);
    expect(first.status).toBe('created');
    const repeat = await insertLead(db, lead(), new Date('2026-10-24T09:00:00Z'));
    expect(repeat.status).toBe('duplicate');
    const nextDay = await insertLead(db, lead(), new Date('2026-10-25T06:00:00Z'));
    expect(nextDay.status).toBe('created');

    const stored = await db.select().from(leads);
    expect(stored).toHaveLength(2);
    expect(stored[0]?.notificationStatus).toBe('pending');
  });

  it('records the notification outcome', async () => {
    const created = await insertLead(db, lead({ dedupeParts: ['+919000000001'] }));
    if (created.status !== 'created') throw new Error('expected a new lead');
    await setNotificationStatus(db, created.id, 'failed', 'Resend: invalid recipient');
    const { rows } = await listLeads(db, parseFilters({ q: created.reference }));
    expect(rows[0]?.notificationStatus).toBe('failed');
    expect(rows[0]?.notificationError).toContain('invalid recipient');
  });
});

describe('admin filters', () => {
  it('filters by form and searches names safely', async () => {
    await insertLead(db, lead({ form: 'partner_application', fullName: 'Rao 100%_Agri', dedupeParts: ['partner'] }));
    const partners = await listLeads(db, parseFilters({ form: 'partner_application' }));
    expect(partners.rows.every((row) => row.form === 'partner_application')).toBe(true);
    const search = await listLeads(db, parseFilters({ q: '100%_' }));
    expect(search.rows.map((row) => row.fullName)).toEqual(['Rao 100%_Agri']);
    expect(parseFilters({ form: 'not-a-form', status: 'x' })).toEqual({ form: undefined, status: undefined, search: undefined, from: undefined, to: undefined });
  });
});

describe('rate limiting', () => {
  it('blocks after the limit within the window and recovers afterwards', async () => {
    const start = new Date('2026-10-24T10:00:00Z');
    const rules = [{ windowSeconds: 600, max: 3 }];
    for (let index = 0; index < 3; index += 1) await recordAttempt(db, 'contact', 'hash-a', 'created', start);
    expect(await isRateLimited(db, 'contact', 'hash-a', rules, start)).toBe(true);
    expect(await isRateLimited(db, 'contact', 'hash-b', rules, start)).toBe(false);
    expect(await isRateLimited(db, 'newsletter', 'hash-a', rules, start)).toBe(false);
    expect(await isRateLimited(db, 'contact', 'hash-a', rules, new Date(start.getTime() + 11 * 60 * 1000))).toBe(false);
  });

  it('prunes attempts older than two days', async () => {
    await recordAttempt(db, 'contact', 'old', 'created', new Date('2026-01-01T00:00:00Z'));
    await pruneAttempts(db, new Date('2026-10-24T00:00:00Z'));
    expect(await isRateLimited(db, 'contact', 'old', [{ windowSeconds: 10 ** 9, max: 1 }], new Date('2026-10-24T00:00:00Z'))).toBe(false);
  });
});

describe('newsletter', () => {
  it('subscribes once and reports repeats', async () => {
    expect(await subscribeToNewsletter(db, { email: 'grower@example.in', consentText: 'Yes' })).toBe('created');
    expect(await subscribeToNewsletter(db, { email: 'grower@example.in', consentText: 'Yes' })).toBe('duplicate');
  });

  it('unsubscribes through the personal link, and allows signing up again', async () => {
    await subscribeToNewsletter(db, { email: 'leaving@example.in', consentText: 'Yes' });
    const [row] = await db.select().from(newsletterSubscribers).where(eq(newsletterSubscribers.email, 'leaving@example.in'));
    if (!row) throw new Error('subscriber missing');
    expect(await findSubscriberByToken(db, row.unsubscribeToken)).toEqual({ email: 'leaving@example.in', status: 'subscribed' });

    expect(await unsubscribeByToken(db, row.unsubscribeToken)).toBe(true);
    expect(await findSubscriberByToken(db, row.unsubscribeToken)).toEqual({ email: 'leaving@example.in', status: 'unsubscribed' });
    expect((await exportSubscribed(db)).map((subscriber) => subscriber.email)).not.toContain('leaving@example.in');

    expect(await subscribeToNewsletter(db, { email: 'leaving@example.in', consentText: 'Yes' })).toBe('created');
    expect(await findSubscriberByToken(db, row.unsubscribeToken)).toEqual({ email: 'leaving@example.in', status: 'subscribed' });
  });

  it('ignores unknown and malformed links', async () => {
    expect(await findSubscriberByToken(db, 'a'.repeat(32))).toBeNull();
    expect(await unsubscribeByToken(db, 'a'.repeat(32))).toBe(false);
    expect(await unsubscribeByToken(db, "' or 1=1 --")).toBe(false);
  });

  it('lets staff stop the newsletter and export only current subscribers with their links', async () => {
    await subscribeToNewsletter(db, { email: 'asked-by-phone@example.in', consentText: 'Yes', sourcePath: '/insights' });
    const before = await listSubscribers(db);
    const person = before.rows.find((subscriber) => subscriber.email === 'asked-by-phone@example.in');
    if (!person) throw new Error('subscriber missing');
    await markUnsubscribed(db, person.id);
    const after = await listSubscribers(db);
    expect(after.unsubscribed).toBe(before.unsubscribed + 1);

    const csv = subscribersToCsv(await exportSubscribed(db), (token) => `https://example.test/u?token=${token}`);
    expect(csv.split('\r\n')[0]).toBe('"Email","Subscribed (IST)","Signed up on page","Unsubscribe link"');
    expect(csv).toContain('grower@example.in');
    expect(csv).not.toContain('asked-by-phone@example.in');
    expect(csv).toMatch(/https:\/\/example\.test\/u\?token=[A-Za-z0-9_-]{32}/);
  });
});

describe('lead deletion', () => {
  it('removes a lead permanently and only by a valid id', async () => {
    const created = await insertLead(db, lead({ phone: '+919812345678', dedupeParts: ['+919812345678', 'erase'] }));
    if (created.status !== 'created') throw new Error('lead not created');
    expect(await deleteLead(db, 'not-a-real-id')).toBe(false);
    expect(await deleteLead(db, created.id)).toBe(true);
    expect(await getLead(db, created.id)).toBeNull();
    expect(await deleteLead(db, created.id)).toBe(false);
  });
});
