import type { LeadForm } from '../db/schema';

/*
 * Builds the notification sent to the Oceania team for a new lead.
 * Plain functions, no network access, so the wording can be tested.
 */

export const formLabels: Record<LeadForm, string> = {
  contact: 'General enquiry',
  farm_callback: 'Farm callback request',
  product_enquiry: 'Product enquiry',
  partner_application: 'Partner application',
  farmer_registration: 'Farmer registration',
};

const detailLabels: Record<string, string> = {
  role: 'I am',
  topic: 'About',
  product: 'Product',
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
  experience: 'Experience with agricultural inputs',
  experienceSummary: 'About their business',
};

export type LeadEmailInput = {
  id: string;
  reference: string;
  form: LeadForm;
  fullName: string;
  phone?: string;
  email?: string;
  state?: string;
  district?: string;
  details: Record<string, unknown>;
  consents: { contact: boolean; whatsapp: boolean };
  sourcePath?: string;
  adminUrl: string;
};

/** Machine keys that have a readable counterpart in the details. */
const HIDDEN_DETAILS = new Set(['product', 'partnershipType']);

function displayValue(value: unknown): string {
  if (Array.isArray(value)) return value.join(', ');
  if (value === true) return 'Yes';
  if (value === false) return 'No';
  return String(value);
}

function rows(input: LeadEmailInput): [string, string][] {
  const base: [string, string | undefined][] = [
    ['Reference', input.reference],
    ['Name', input.fullName],
    ['Mobile', input.phone],
    ['Email', input.email],
    ['District or city', input.district],
    ['State', input.state],
  ];
  const details = Object.entries(input.details)
    .filter(([key, value]) => !HIDDEN_DETAILS.has(key) && value !== undefined && value !== '' && !(Array.isArray(value) && value.length === 0))
    .map(([key, value]): [string, string] => [detailLabels[key] ?? key, displayValue(value)]);
  const tail: [string, string | undefined][] = [
    ['May contact them', input.consents.contact ? 'Yes' : 'Not asked'],
    ['WhatsApp updates', input.form === 'farmer_registration' ? (input.consents.whatsapp ? 'Yes' : 'No') : undefined],
    ['Submitted from', input.sourcePath],
  ];
  return [...base, ...details, ...tail].filter((row): row is [string, string] => Boolean(row[1]));
}

export function leadEmailSubject(input: LeadEmailInput): string {
  const place = [input.district, input.state].filter(Boolean).join(', ');
  const extra =
    input.form === 'partner_application'
      ? ` (${displayValue(input.details.partnershipTitle ?? input.details.partnershipType)})`
      : input.form === 'product_enquiry' && input.details.productName
        ? ` (${displayValue(input.details.productName)})`
        : '';
  return `[${formLabels[input.form]}] ${input.fullName}${place ? `, ${place}` : ''}${extra}`;
}

export function leadEmailText(input: LeadEmailInput): string {
  const width = Math.max(...rows(input).map(([label]) => label.length));
  const lines = rows(input).map(([label, value]) => `${label.padEnd(width)}  ${value}`);
  return [
    `New ${formLabels[input.form].toLowerCase()} from the website.`,
    '',
    ...lines,
    '',
    `Open in the leads admin: ${input.adminUrl}`,
  ].join('\n');
}

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function leadEmailHtml(input: LeadEmailInput): string {
  const tableRows = rows(input)
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 16px 6px 0;color:#5c6257;vertical-align:top;white-space:nowrap">${escapeHtml(label)}</td><td style="padding:6px 0;color:#1a1d18;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`,
    )
    .join('');
  return `<!doctype html><html><body style="margin:0;padding:24px;background:#f7f3ea;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5">
<p style="margin:0 0 16px;color:#1e3a2b;font-size:18px">New ${escapeHtml(formLabels[input.form].toLowerCase())} from the website</p>
<table style="border-collapse:collapse">${tableRows}</table>
<p style="margin:24px 0 0"><a href="${escapeHtml(input.adminUrl)}" style="color:#1e3a2b">Open in the leads admin</a></p>
</body></html>`;
}
