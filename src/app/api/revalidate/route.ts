import { revalidateTag } from 'next/cache';
import { parseBody } from 'next-sanity/webhook';
import { NextResponse, type NextRequest } from 'next/server';

import { serverEnv } from '@/lib/env';
import { SANITY_TAG } from '@/sanity/fetch';

/**
 * Sanity webhook: called when content is published, changed or deleted.
 * The signature is checked against SANITY_REVALIDATE_SECRET, then every page
 * that reads Sanity content is refreshed on its next visit.
 */
export async function POST(request: NextRequest) {
  const secret = serverEnv().SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json({ revalidated: false, message: 'Revalidation is not configured.' }, { status: 501 });
  }

  try {
    const { isValidSignature, body } = await parseBody<{ _type?: string }>(request, secret, true);
    if (!isValidSignature) {
      return NextResponse.json({ revalidated: false, message: 'Invalid signature.' }, { status: 401 });
    }
    // Editors expect to see a change straight after publishing, so expire immediately.
    revalidateTag(SANITY_TAG, { expire: 0 });
    return NextResponse.json({ revalidated: true, type: body?._type ?? null, now: Date.now() });
  } catch (error) {
    console.error(JSON.stringify({ level: 'error', event: 'revalidate_failed', error: String(error) }));
    return NextResponse.json({ revalidated: false, message: 'Could not process the webhook.' }, { status: 400 });
  }
}
