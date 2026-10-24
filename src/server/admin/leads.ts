import { and, count, desc, eq, gte, ilike, lt, or, type SQL } from 'drizzle-orm';

import { leadForms, leads, leadStatuses, type Lead, type LeadForm, type LeadStatus } from '../db/schema';
import type { AppDatabase } from '../db/types';

/* Lead queries for the admin area. Plain functions that take the database, so they can be tested. */

export type LeadFilters = {
  form?: LeadForm;
  status?: LeadStatus;
  search?: string;
  from?: string;
  to?: string;
};

export function parseFilters(params: Record<string, string | string[] | undefined>): LeadFilters {
  const value = (key: string) => (typeof params[key] === 'string' ? (params[key] as string).trim() : undefined);
  const form = value('form');
  const status = value('status');
  const date = (input?: string) => (input && /^\d{4}-\d{2}-\d{2}$/.test(input) ? input : undefined);
  return {
    form: leadForms.includes(form as LeadForm) ? (form as LeadForm) : undefined,
    status: leadStatuses.includes(status as LeadStatus) ? (status as LeadStatus) : undefined,
    search: value('q')?.slice(0, 80) || undefined,
    from: date(value('from')),
    to: date(value('to')),
  };
}

function where(filters: LeadFilters): SQL | undefined {
  const conditions: SQL[] = [];
  if (filters.form) conditions.push(eq(leads.form, filters.form));
  if (filters.status) conditions.push(eq(leads.status, filters.status));
  if (filters.from) conditions.push(gte(leads.createdAt, new Date(`${filters.from}T00:00:00+05:30`)));
  if (filters.to) {
    const end = new Date(`${filters.to}T00:00:00+05:30`);
    end.setDate(end.getDate() + 1);
    conditions.push(lt(leads.createdAt, end));
  }
  if (filters.search) {
    const pattern = `%${filters.search.replace(/[%_\\]/g, (char) => `\\${char}`)}%`;
    const search = or(ilike(leads.fullName, pattern), ilike(leads.phone, pattern), ilike(leads.reference, pattern), ilike(leads.email, pattern));
    if (search) conditions.push(search);
  }
  return conditions.length > 0 ? and(...conditions) : undefined;
}

export const PAGE_SIZE = 50;

export async function listLeads(db: AppDatabase, filters: LeadFilters, page = 1): Promise<{ rows: Lead[]; total: number }> {
  const condition = where(filters);
  const [rows, totals] = await Promise.all([
    db
      .select()
      .from(leads)
      .where(condition)
      .orderBy(desc(leads.createdAt))
      .limit(PAGE_SIZE)
      .offset((Math.max(1, page) - 1) * PAGE_SIZE),
    db.select({ value: count() }).from(leads).where(condition),
  ]);
  return { rows, total: totals[0]?.value ?? 0 };
}

export async function getLead(db: AppDatabase, id: string): Promise<Lead | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const [row] = await db.select().from(leads).where(eq(leads.id, id)).limit(1);
  return row ?? null;
}

export async function updateLead(db: AppDatabase, id: string, changes: { status: LeadStatus; internalNotes: string }) {
  await db
    .update(leads)
    .set({ status: changes.status, internalNotes: changes.internalNotes.slice(0, 4000) || null, updatedAt: new Date() })
    .where(eq(leads.id, id));
}

/** Permanently removes a lead, for erasure requests and records no longer needed. */
export async function deleteLead(db: AppDatabase, id: string): Promise<boolean> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return false;
  const rows = await db.delete(leads).where(eq(leads.id, id)).returning({ id: leads.id });
  return rows.length > 0;
}

export async function exportLeads(db: AppDatabase, filters: LeadFilters): Promise<Lead[]> {
  return db.select().from(leads).where(where(filters)).orderBy(desc(leads.createdAt)).limit(10000);
}

/** CSV cell, quoted, with formula injection neutralised for spreadsheet apps. */
export function csvCell(value: unknown): string {
  let text = value === null || value === undefined ? '' : typeof value === 'object' ? JSON.stringify(value) : String(value);
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

export function leadsToCsv(rows: Lead[]): string {
  const header = ['Reference', 'Received (IST)', 'Form', 'Status', 'Name', 'Mobile', 'Email', 'District', 'State', 'Details', 'May contact', 'WhatsApp updates', 'Source page', 'Notification', 'Notes'];
  const ist = new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Kolkata' });
  const lines = rows.map((row) =>
    [
      row.reference,
      ist.format(row.createdAt),
      row.form,
      row.status,
      row.fullName,
      row.phone,
      row.email,
      row.district,
      row.state,
      row.details,
      row.consents.contact ? 'Yes' : 'No',
      row.consents.whatsapp ? 'Yes' : 'No',
      row.sourcePath,
      row.notificationStatus,
      row.internalNotes,
    ]
      .map(csvCell)
      .join(','),
  );
  return [header.map(csvCell).join(','), ...lines].join('\r\n');
}
