import type { MetadataRoute } from 'next';

import { absoluteUrl, isIndexable, siteUrl } from '@/lib/site-config';

/** Production allows crawling except private areas; every other environment blocks it. */
export default function robots(): MetadataRoute.Robots {
  if (!isIndexable) {
    return { rules: [{ userAgent: '*', disallow: '/' }] };
  }
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/studio', '/admin', '/api/'] }],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: siteUrl,
  };
}
