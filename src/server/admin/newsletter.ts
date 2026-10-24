import { count, desc, eq } from 'drizzle-orm';

import { newsletterSubscribers, type NewsletterSubscriber } from '../db/schema';
import type { AppDatabase } from '../db/types';

import { csvCell } from './leads';

/* Newsletter subscribers for the admin area. Plain functions that take the database, so they can be tested. */

export const SUBSCRIBERS_PAGE_SIZE = 100;

export async function listSubscribers(
  db: AppDatabase,
  page = 1,
): Promise<{ rows: NewsletterSubscriber[]; subscribed: number; unsubscribed: number }> {
  const [rows, totals] = await Promise.all([
    db
      .select()
      .from(newsletterSubscribers)
      .orderBy(desc(newsletterSubscribers.createdAt))
      .limit(SUBSCRIBERS_PAGE_SIZE)
      .offset((Math.max(1, page) - 1) * SUBSCRIBERS_PAGE_SIZE),
    db
      .select({ status: newsletterSubscribers.status, value: count() })
      .from(newsletterSubscribers)
      .groupBy(newsletterSubscribers.status),
  ]);
  const counted = Object.fromEntries(totals.map((row) => [row.status, row.value]));
  return { rows, subscribed: counted.subscribed ?? 0, unsubscribed: counted.unsubscribed ?? 0 };
}

/** For people who ask by phone or email to stop receiving the newsletter. */
export async function markUnsubscribed(db: AppDatabase, id: string) {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return;
  await db
    .update(newsletterSubscribers)
    .set({ status: 'unsubscribed', updatedAt: new Date() })
    .where(eq(newsletterSubscribers.id, id));
}

/** Everyone currently subscribed, newest first. */
export async function exportSubscribed(db: AppDatabase): Promise<NewsletterSubscriber[]> {
  return db
    .select()
    .from(newsletterSubscribers)
    .where(eq(newsletterSubscribers.status, 'subscribed'))
    .orderBy(desc(newsletterSubscribers.createdAt))
    .limit(20000);
}

/** CSV for the mailing tool, with each person's own unsubscribe link to include in every email. */
export function subscribersToCsv(rows: NewsletterSubscriber[], unsubscribeUrl: (token: string) => string): string {
  const ist = new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Kolkata' });
  const header = ['Email', 'Subscribed (IST)', 'Signed up on page', 'Unsubscribe link'];
  const lines = rows.map((row) =>
    [row.email, ist.format(row.createdAt), row.sourcePath, unsubscribeUrl(row.unsubscribeToken)].map(csvCell).join(','),
  );
  return [header.map(csvCell).join(','), ...lines].join('\r\n');
}
