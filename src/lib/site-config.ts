/**
 * Public, build-time site configuration. Safe to import anywhere.
 */

export type SiteEnv = 'development' | 'preview' | 'production';

function resolveSiteEnv(): SiteEnv {
  const explicit = process.env.NEXT_PUBLIC_SITE_ENV ?? process.env.NEXT_PUBLIC_VERCEL_ENV;
  if (explicit === 'production' || explicit === 'preview' || explicit === 'development') return explicit;
  // Unconfigured builds behave like a preview: pending content is marked, nothing is indexable.
  return process.env.NODE_ENV === 'development' ? 'development' : 'preview';
}

export const siteEnv: SiteEnv = resolveSiteEnv();

/** Only the production deployment may be indexed by search engines. */
export const isIndexable = siteEnv === 'production';

/** Pending (unapproved) content is visible, with markers, everywhere except production. */
export const showPendingContent = siteEnv !== 'production';

// Production must set NEXT_PUBLIC_SITE_URL. Vercel previews fall back to their own deployment address.
const vercelUrl = process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : undefined;
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || vercelUrl || 'http://localhost:3000').replace(/\/+$/, '');

export const siteName = 'Oceania Fertilizers';

export function absoluteUrl(path = '/'): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`;
}
