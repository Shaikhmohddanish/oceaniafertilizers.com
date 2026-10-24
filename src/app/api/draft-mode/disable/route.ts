import { draftMode } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';

/** Leaves preview mode and returns to the page, or the homepage. */
export async function GET(request: NextRequest) {
  (await draftMode()).disable();
  const target = request.nextUrl.searchParams.get('redirect');
  const path = target && target.startsWith('/') && !target.startsWith('//') ? target : '/';
  return NextResponse.redirect(new URL(path, request.url));
}
