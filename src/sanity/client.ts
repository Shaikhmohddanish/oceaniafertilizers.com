import { createImageUrlBuilder } from '@sanity/image-url';
import { createClient } from 'next-sanity';

import { apiVersion, dataset, isSanityConfigured, projectId, studioBasePath } from './env';

/**
 * Read client for published content. Uses the CDN; drafts are only fetched in
 * Draft Mode, with a server-side token (see fetch.ts).
 */
export const client = createClient({
  projectId: isSanityConfigured ? projectId : 'not-configured',
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
  stega: { studioUrl: studioBasePath },
});

export const imageBuilder = createImageUrlBuilder({
  projectId: isSanityConfigured ? projectId : 'not-configured',
  dataset,
});
