import type { MetadataRoute } from 'next';

import { getArticles, getProducts } from '@/content/repository';
import { absoluteUrl } from '@/lib/site-config';

/** Only published content is listed; drafts never appear, whatever the environment. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, articles] = await Promise.all([getProducts(), getArticles()]);

  const pages = [
    '/',
    '/products',
    '/demo-plots',
    '/farmer-stories',
    '/insights',
    '/about',
    '/gallery',
    '/become-a-partner',
    '/join-oceania',
    '/contact',
    '/privacy-policy',
    '/terms',
    '/image-credits',
  ].map((path) => ({ url: absoluteUrl(path) }));

  const productEntries = products
    .filter((product) => product.status === 'published')
    .map((product) => ({ url: absoluteUrl(`/products/${product.slug}`), lastModified: product.updatedAt }));

  const articleEntries = articles
    .filter((article) => article.status === 'published')
    .map((article) => ({ url: absoluteUrl(`/insights/${article.slug}`), lastModified: article.updatedAt }));

  return [...pages, ...productEntries, ...articleEntries];
}
