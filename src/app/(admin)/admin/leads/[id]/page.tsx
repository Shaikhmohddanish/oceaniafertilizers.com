import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

import { removeLead, saveLead } from '@/server/admin/actions';
import { getLead } from '@/server/admin/leads';
import { hasSession } from '@/server/admin/session';
import { getDb } from '@/server/db/client';
import { leadStatuses } from '@/server/db/schema';
import { formLabels } from '@/server/notify/lead-email';

import { AdminHeader } from '../../AdminHeader';

export const dynamic = 'force-dynamic';

const ist = new Intl.DateTimeFormat('en-IN', { dateStyle: 'long', timeStyle: 'short', timeZone: 'Asia/Kolkata' });
const statusLabel: Record<string, string> = { new: 'New', contacted: 'Contacted', qualified: 'Qualified', closed: 'Closed', spam: 'Spam' };

const detailLabels: Record<string, string> = {
  role: 'I am',
  topic: 'About',
  productName: 'Product',
  message: 'Message',
  location: 'Village or town',
  crop: 'Main crop',
  area: 'Area (acres)',
  farmSize: 'Farm size (acres)',
  interests: 'Interested in',
  businessName: 'Business or organisation',
  partnershipTitle: 'Partnership interest',
  pinCode: 'PIN code',
  gstin: 'GSTIN',
  experience: 'Experience',
  experienceSummary: 'About their business',
};

type Props = { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string | undefined>> };

function Row({ label, value }: { label: string; value?: React.ReactNode }) {
  if (value === undefined || value === null || value === '') return null;
  return (
    <div className="grid gap-1 border-b border-[color:var(--line)] py-3 sm:grid-cols-[12rem_1fr] sm:gap-6">
      <dt className="text-ink-500">{label}</dt>
      <dd className="whitespace-pre-wrap text-ink-900">{value}</dd>
    </div>
  );
}

export default async function LeadPage({ params, searchParams }: Props) {
  if (!(await hasSession())) redirect('/admin');
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const db = await getDb();
  const lead = await getLead(db, id);
  if (!lead) notFound();

  const details = Object.entries(lead.details).filter(([key, value]) => detailLabels[key] && value !== undefined && value !== '');

  return (
    <>
      <AdminHeader />
      <main className="mx-auto max-w-4xl px-6 py-10">
        <Link href="/admin/leads" className="type-small font-medium text-forest-800 underline">
          All leads
        </Link>
        <div className="mt-6 flex flex-wrap items-baseline justify-between gap-4">
          <h1 className="type-h2 text-forest-900">{lead.fullName}</h1>
          <p className="type-numeral text-ink-700">{lead.reference}</p>
        </div>
        <p className="mt-2 text-ink-700">
          {formLabels[lead.form]}, received {ist.format(lead.createdAt)}
        </p>
        {query.saved ? (
          <p role="status" className="type-small mt-4 border-l-2 border-forest-700 bg-ivory-100 px-4 py-2">
            Saved.
          </p>
        ) : null}

        <dl className="type-small mt-8 border-t border-[color:var(--line-strong)]">
          <Row label="Mobile" value={lead.phone ? <a href={`tel:${lead.phone}`} className="underline">{lead.phone}</a> : undefined} />
          <Row label="Email" value={lead.email ? <a href={`mailto:${lead.email}`} className="underline">{lead.email}</a> : undefined} />
          <Row label="District or city" value={lead.district ?? undefined} />
          <Row label="State" value={lead.state ?? undefined} />
          {details.map(([key, value]) => (
            <Row key={key} label={detailLabels[key] ?? key} value={Array.isArray(value) ? value.join(', ') : String(value)} />
          ))}
          <Row label="May contact them" value={lead.consents.contact ? 'Yes' : 'No'} />
          {lead.form === 'farmer_registration' ? <Row label="WhatsApp updates" value={lead.consents.whatsapp ? 'Yes' : 'No'} /> : null}
          <Row label="Consent wording version" value={lead.consents.version} />
          <Row label="Submitted from" value={lead.sourcePath ?? undefined} />
          <Row label="Campaign" value={lead.utm ? Object.entries(lead.utm).map(([key, value]) => `${key}: ${value}`).join(', ') : undefined} />
          <Row
            label="Team email"
            value={
              lead.notificationStatus === 'sent'
                ? 'Sent'
                : lead.notificationStatus === 'failed'
                  ? `Failed${lead.notificationError ? `: ${lead.notificationError}` : ''}`
                  : lead.notificationStatus === 'not_configured'
                    ? 'Email notifications are not configured'
                    : 'Pending'
            }
          />
        </dl>

        <form action={saveLead} className="mt-10 space-y-5 border-t border-[color:var(--line-strong)] pt-8">
          <input type="hidden" name="id" value={lead.id} />
          <div>
            <label htmlFor="lead-status" className="type-small block font-medium">
              Status
            </label>
            <select
              id="lead-status"
              name="status"
              defaultValue={lead.status}
              className="mt-2 h-11 w-60 rounded-[2px] border border-[color:var(--line-control)] bg-white px-3"
            >
              {leadStatuses.map((status) => (
                <option key={status} value={status}>
                  {statusLabel[status]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="lead-notes" className="type-small block font-medium">
              Internal notes
            </label>
            <textarea
              id="lead-notes"
              name="internalNotes"
              defaultValue={lead.internalNotes ?? ''}
              rows={5}
              maxLength={4000}
              className="mt-2 block w-full rounded-[2px] border border-[color:var(--line-control)] bg-white px-4 py-3"
            />
            <p className="type-caption mt-1 text-ink-500">Only visible to the team.</p>
          </div>
          <button type="submit" className="inline-flex min-h-11 items-center rounded-[2px] bg-forest-800 px-5 font-medium text-ivory-50 hover:bg-forest-900">
            Save
          </button>
        </form>

        <form action={removeLead} className="mt-14 border-t border-[color:var(--line-strong)] pt-8">
          <input type="hidden" name="id" value={lead.id} />
          <h2 className="type-h4 text-ink-900">Delete this lead</h2>
          <p className="type-small mt-2 max-w-[60ch] text-ink-700">
            Use this when someone asks for their details to be erased, or when the record is no longer needed. The record is
            removed from the database straight away and cannot be recovered. Copies already sent by email or downloaded as CSV are
            not affected.
          </p>
          {query.confirm ? (
            <p role="alert" className="type-small mt-4 border-l-2 border-error-700 bg-error-100 px-4 py-2 text-ink-900">
              Tick the box to confirm, then delete.
            </p>
          ) : null}
          <label className="type-small mt-4 flex items-start gap-3">
            <input type="checkbox" name="confirm" value="yes" className="mt-0.5 h-6 w-6 shrink-0 accent-error-700" />
            <span>I understand that this permanently deletes the record of {lead.fullName}.</span>
          </label>
          <button
            type="submit"
            className="mt-5 inline-flex min-h-11 items-center rounded-[2px] border border-error-700 px-5 font-medium text-error-700 hover:bg-error-700 hover:text-ivory-50"
          >
            Delete permanently
          </button>
        </form>
      </main>
    </>
  );
}
