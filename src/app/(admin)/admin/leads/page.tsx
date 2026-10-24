import Link from 'next/link';
import { redirect } from 'next/navigation';

import { getDb } from '@/server/db/client';
import { leadForms, leadStatuses } from '@/server/db/schema';
import { listLeads, PAGE_SIZE, parseFilters } from '@/server/admin/leads';
import { hasSession } from '@/server/admin/session';
import { formLabels } from '@/server/notify/lead-email';

import { AdminHeader } from '../AdminHeader';

export const dynamic = 'force-dynamic';

const ist = new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Kolkata' });

const statusLabel: Record<string, string> = { new: 'New', contacted: 'Contacted', qualified: 'Qualified', closed: 'Closed', spam: 'Spam' };

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function LeadsPage({ searchParams }: Props) {
  if (!(await hasSession())) redirect('/admin');
  const params = await searchParams;
  const filters = parseFilters(params);
  const page = Math.max(1, Number(params.page) || 1);
  const db = await getDb();
  const { rows, total } = await listLeads(db, filters, page);
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const query = new URLSearchParams(
    Object.entries({ form: filters.form, status: filters.status, q: filters.search, from: filters.from, to: filters.to }).filter(
      (entry): entry is [string, string] => Boolean(entry[1]),
    ),
  );

  const control = 'h-10 rounded-[2px] border border-[color:var(--line-control)] bg-white px-3 text-[0.9375rem]';

  return (
    <>
      <AdminHeader />
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h1 className="type-h2 text-forest-900">Leads</h1>
            <p className="mt-2 text-ink-700">
              {total} {total === 1 ? 'submission' : 'submissions'}
              {query.size > 0 ? ' matching these filters' : ''}.
            </p>
            {params.deleted ? (
              <p role="status" className="type-small mt-4 border-l-2 border-forest-700 bg-ivory-100 px-4 py-2">
                The lead was deleted.
              </p>
            ) : null}
          </div>
          <a
            href={`/admin/leads/export${query.size > 0 ? `?${query}` : ''}`}
            className="inline-flex min-h-10 items-center rounded-[2px] border border-forest-800 px-4 font-medium text-forest-800 hover:bg-forest-800 hover:text-ivory-50"
          >
            Download CSV
          </a>
        </div>

        <form className="mt-8 flex flex-wrap items-end gap-4 border-y border-[color:var(--line)] py-5" method="get">
          <label className="type-small grid gap-1">
            <span className="text-ink-500">Search</span>
            <input name="q" defaultValue={filters.search} placeholder="Name, mobile, email or reference" className={`${control} w-64`} />
          </label>
          <label className="type-small grid gap-1">
            <span className="text-ink-500">Form</span>
            <select name="form" defaultValue={filters.form ?? ''} className={control}>
              <option value="">All forms</option>
              {leadForms.map((form) => (
                <option key={form} value={form}>
                  {formLabels[form]}
                </option>
              ))}
            </select>
          </label>
          <label className="type-small grid gap-1">
            <span className="text-ink-500">Status</span>
            <select name="status" defaultValue={filters.status ?? ''} className={control}>
              <option value="">Any status</option>
              {leadStatuses.map((status) => (
                <option key={status} value={status}>
                  {statusLabel[status]}
                </option>
              ))}
            </select>
          </label>
          <label className="type-small grid gap-1">
            <span className="text-ink-500">From</span>
            <input type="date" name="from" defaultValue={filters.from} className={control} />
          </label>
          <label className="type-small grid gap-1">
            <span className="text-ink-500">To</span>
            <input type="date" name="to" defaultValue={filters.to} className={control} />
          </label>
          <button type="submit" className="h-10 rounded-[2px] bg-forest-800 px-4 font-medium text-ivory-50">
            Apply
          </button>
          {query.size > 0 ? (
            <Link href="/admin/leads" className="type-small font-medium text-forest-800 underline">
              Clear
            </Link>
          ) : null}
        </form>

        {rows.length === 0 ? (
          <p className="mt-10 text-ink-700">No submissions yet{query.size > 0 ? ' for these filters' : ''}.</p>
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="type-small w-full min-w-[56rem] border-collapse text-left">
              <thead>
                <tr className="border-b border-[color:var(--line-strong)] text-ink-500">
                  <th scope="col" className="py-3 pr-4 font-medium">Received</th>
                  <th scope="col" className="py-3 pr-4 font-medium">Reference</th>
                  <th scope="col" className="py-3 pr-4 font-medium">Form</th>
                  <th scope="col" className="py-3 pr-4 font-medium">Name</th>
                  <th scope="col" className="py-3 pr-4 font-medium">Mobile</th>
                  <th scope="col" className="py-3 pr-4 font-medium">Place</th>
                  <th scope="col" className="py-3 pr-4 font-medium">Status</th>
                  <th scope="col" className="py-3 font-medium">Email sent</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((lead) => (
                  <tr key={lead.id} className="border-b border-[color:var(--line)] align-top hover:bg-ivory-50">
                    <td className="py-3 pr-4 whitespace-nowrap">{ist.format(lead.createdAt)}</td>
                    <td className="py-3 pr-4">
                      <Link href={`/admin/leads/${lead.id}`} className="type-numeral font-semibold text-forest-800 underline">
                        {lead.reference}
                      </Link>
                    </td>
                    <td className="py-3 pr-4">{formLabels[lead.form]}</td>
                    <td className="py-3 pr-4">{lead.fullName}</td>
                    <td className="py-3 pr-4 whitespace-nowrap">{lead.phone ?? '-'}</td>
                    <td className="py-3 pr-4">{[lead.district, lead.state].filter(Boolean).join(', ') || '-'}</td>
                    <td className="py-3 pr-4">{statusLabel[lead.status]}</td>
                    <td className="py-3">{lead.notificationStatus === 'sent' ? 'Yes' : lead.notificationStatus === 'failed' ? 'Failed' : lead.notificationStatus === 'not_configured' ? 'Email off' : 'Pending'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pages > 1 ? (
          <nav aria-label="Pages" className="mt-8 flex items-center gap-4">
            {page > 1 ? (
              <Link href={`/admin/leads?${new URLSearchParams([...query, ['page', String(page - 1)]])}`} className="font-medium text-forest-800 underline">
                Previous
              </Link>
            ) : null}
            <span className="type-small text-ink-500">
              Page {page} of {pages}
            </span>
            {page < pages ? (
              <Link href={`/admin/leads?${new URLSearchParams([...query, ['page', String(page + 1)]])}`} className="font-medium text-forest-800 underline">
                Next
              </Link>
            ) : null}
          </nav>
        ) : null}
      </main>
    </>
  );
}
