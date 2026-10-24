import type { Metadata } from 'next';

import { languageAlternates } from '@/lib/i18n';
import { isIndexable, siteName } from '@/lib/site-config';

type PageMetadataInput = {
  title: string;
  description: string;
  /** Path relative to the site root, used as the canonical URL. */
  path: string;
  /** Use the title as-is, without the " | Oceania Fertilizers" template. */
  absoluteTitle?: boolean;
  noindex?: boolean;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
};

/** Consistent metadata for every page: unique title and description, self canonical, social tags. */
export function pageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
  noindex = false,
  type = 'website',
  publishedTime,
  modifiedTime,
}: PageMetadataInput): Metadata {
  const shareTitle = absoluteTitle ? title : `${title} | ${siteName}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path, languages: languageAlternates(path) },
    openGraph: {
      type,
      url: path,
      title: shareTitle,
      description,
      siteName,
      locale: 'en_IN',
      ...(type === 'article' ? { publishedTime, modifiedTime } : {}),
    },
    twitter: { card: 'summary_large_image', title: shareTitle, description },
    ...(noindex || !isIndexable ? { robots: { index: false, follow: !noindex } } : {}),
  };
}
