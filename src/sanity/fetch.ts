import 'server-only';

import type { QueryParams } from 'next-sanity';
import { draftMode } from 'next/headers';

import { serverEnv } from '@/lib/env';

import { client } from './client';

/** Every Sanity fetch carries this tag; the webhook revalidates it on publish. */
export const SANITY_TAG = 'sanity';

/**
 * Published content is cached and revalidated by the Sanity webhook (with an
 * hourly fallback). In Draft Mode, drafts are fetched fresh with a server-side
 * token that never reaches the browser.
 */
export async function sanityFetch<T>(query: string, params: QueryParams = {}): Promise<T> {
  let isDraftMode = false;
  try {
    isDraftMode = (await draftMode()).isEnabled;
  } catch {
    // Outside a request (for example generateStaticParams): published content.
  }

  if (isDraftMode) {
    const token = serverEnv().SANITY_API_READ_TOKEN;
    if (!token) throw new Error('SANITY_API_READ_TOKEN is required for draft previews.');
    return client
      .withConfig({ token, perspective: 'drafts', useCdn: false, stega: true })
      .fetch<T>(query, params, { cache: 'no-store' });
  }

  return client.fetch<T>(query, params, { next: { revalidate: 3600, tags: [SANITY_TAG] } });
}
