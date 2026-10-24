import { defineEnableDraftMode } from 'next-sanity/draft-mode';

import { client } from '@/sanity/client';
import { isSanityConfigured } from '@/sanity/env';

/*
 * Opened by the Studio's Preview tool. next-sanity checks a short-lived secret
 * that the Studio creates for each session, so no static secret is exposed.
 */
const token = process.env.SANITY_API_READ_TOKEN;

const handler =
  isSanityConfigured && token
    ? defineEnableDraftMode({ client: client.withConfig({ token }) })
    : { GET: async () => new Response('Draft preview is not configured.', { status: 404 }) };

export const { GET } = handler;
