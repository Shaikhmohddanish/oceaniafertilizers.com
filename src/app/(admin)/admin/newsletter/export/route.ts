import { NextResponse } from 'next/server';

import { absoluteUrl } from '@/lib/site-config';
import { exportSubscribed, subscribersToCsv } from '@/server/admin/newsletter';
import { hasSession } from '@/server/admin/session';
import { getDb } from '@/server/db/client';
import { istDate } from '@/server/leads/service';

export const dynamic = 'force-dynamic';

const BYTE_ORDER_MARK = String.fromCharCode(0xfeff);

/** CSV of current newsletter subscribers with their unsubscribe links. Signed-in staff only. */
export async function GET() {
  if (!(await hasSession())) return new NextResponse('Not found', { status: 404 });
  const db = await getDb();
  const rows = await exportSubscribed(db);
  const csv = subscribersToCsv(rows, (token) => absoluteUrl(`/newsletter/unsubscribe?token=${encodeURIComponent(token)}`));
  // A byte-order mark so spreadsheet apps read the file as UTF-8.
  return new NextResponse(`${BYTE_ORDER_MARK}${csv}`, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="oceania-newsletter-${istDate()}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}
