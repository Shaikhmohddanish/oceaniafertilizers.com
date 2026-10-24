import Link from 'next/link';
import { redirect } from 'next/navigation';

import { stopNewsletter } from '@/server/admin/actions';
import { listSubscribers, SUBSCRIBERS_PAGE_SIZE } from '@/server/admin/newsletter';
import { hasSession } from '@/server/admin/session';
import { getDb } from '@/server/db/client';

import { AdminHeader } from '../AdminHeader';

export const dynamic = 'force-dynamic';

const ist = new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Kolkata' });

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function NewsletterPage({ searchParams }: Props) {
  if (!(await hasSession())) redirect('/admin');
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const db = await getDb();
  const { rows, subscribed, unsubscribed } = await listSubscribers(db, page);
  const pages = Math.max(1, Math.ceil((subscribed + unsubscribed) / SUBSCRIBERS_PAGE_SIZE));

  return (
    <>
      <AdminHeader current="Newsletter" />
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h1 className="type-h2 text-forest-900">Newsletter</h1>
            <p className="mt-2 text-ink-700">
              {subscribed} subscribed, {unsubscribed} unsubscribed.
            </p>
            {params.updated ? (
              <p role="status" className="type-small mt-4 border-l-2 border-forest-700 bg-ivory-100 px-4 py-2">
                Unsubscribed. They will not be included in the next download.
              </p>
            ) : null}
          </div>
          <a
            href="/admin/newsletter/export"
            className="inline-flex min-h-10 items-center rounded-[2px] border border-forest-800 px-4 font-medium text-forest-800 hover:bg-forest-800 hover:text-ivory-50"
          >
            Download subscribers (CSV)
          </a>
        </div>
        <p className="type-small mt-6 max-w-[72ch] text-ink-700">
          The download lists everyone currently subscribed, with a personal unsubscribe link for each person. Put that link in every
          newsletter you send. If someone asks you directly to stop, use Unsubscribe below.
        </p>

        {rows.length === 0 ? (
          <p className="mt-10 text-ink-700">No sign-ups yet.</p>
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="type-small w-full min-w-[44rem] border-collapse text-left">
              <thead>
                <tr className="border-b border-[color:var(--line-strong)] text-ink-500">
                  <th scope="col" className="py-3 pr-4 font-medium">Signed up</th>
                  <th scope="col" className="py-3 pr-4 font-medium">Email</th>
                  <th scope="col" className="py-3 pr-4 font-medium">Page</th>
                  <th scope="col" className="py-3 pr-4 font-medium">Status</th>
                  <th scope="col" className="py-3 font-medium">
                    <span className="sr-only">Action</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((subscriber) => (
                  <tr key={subscriber.id} className="border-b border-[color:var(--line)] align-top">
                    <td className="py-3 pr-4 whitespace-nowrap">{ist.format(subscriber.createdAt)}</td>
                    <td className="py-3 pr-4">{subscriber.email}</td>
                    <td className="py-3 pr-4">{subscriber.sourcePath ?? '-'}</td>
                    <td className="py-3 pr-4">{subscriber.status === 'subscribed' ? 'Subscribed' : 'Unsubscribed'}</td>
                    <td className="py-3">
                      {subscriber.status === 'subscribed' ? (
                        <form action={stopNewsletter}>
                          <input type="hidden" name="id" value={subscriber.id} />
                          <button type="submit" className="font-medium text-forest-800 underline underline-offset-4">
                            Unsubscribe<span className="sr-only"> {subscriber.email}</span>
                          </button>
                        </form>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pages > 1 ? (
          <nav aria-label="Pages" className="mt-8 flex items-center gap-4">
            {page > 1 ? (
              <Link href={`/admin/newsletter?page=${page - 1}`} className="font-medium text-forest-800 underline">
                Previous
              </Link>
            ) : null}
            <span className="type-small text-ink-500">
              Page {page} of {pages}
            </span>
            {page < pages ? (
              <Link href={`/admin/newsletter?page=${page + 1}`} className="font-medium text-forest-800 underline">
                Next
              </Link>
            ) : null}
          </nav>
        ) : null}
      </main>
    </>
  );
}
