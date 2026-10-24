import { NextResponse, type NextRequest } from 'next/server';

import { exportLeads, leadsToCsv, parseFilters } from '@/server/admin/leads';
import { hasSession } from '@/server/admin/session';
import { getDb } from '@/server/db/client';
import { istDate } from '@/server/leads/service';

export const dynamic = 'force-dynamic';

const BYTE_ORDER_MARK = String.fromCharCode(0xfeff);

/** CSV of the leads matching the current filters. Signed-in staff only. */
export async function GET(request: NextRequest) {
  if (!(await hasSession())) return new NextResponse('Not found', { status: 404 });
  const filters = parseFilters(Object.fromEntries(request.nextUrl.searchParams));
  const db = await getDb();
  const rows = await exportLeads(db, filters);
  // A byte-order mark so spreadsheet apps read the file as UTF-8.
  return new NextResponse(`${BYTE_ORDER_MARK}${leadsToCsv(rows)}`, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="oceania-leads-${istDate()}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}
