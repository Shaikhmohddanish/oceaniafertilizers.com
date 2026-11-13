import type { MetadataRoute } from 'next';

import { getArticles, getFarmingVideos, getProducts } from '@/content/repository';
import { absoluteUrl } from '@/lib/site-config';

/** Only published content is listed; drafts never appear, whatever the environment. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, articles, videos] = await Promise.all([getProducts(), getArticles(), getFarmingVideos()]);

  const pages = [
    '/',
    '/learn',
    '/advice',
    '/products',
    '/field-visits',
    '/farmer-stories',
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
    .map((article) => ({ url: absoluteUrl(`/learn/${article.slug}`), lastModified: article.updatedAt }));

  const videoEntries = videos
    .filter((video) => video.status === 'published')
    .map((video) => ({ url: absoluteUrl(`/learn/videos/${video.slug}`), lastModified: video.publishedAt }));

  return [...pages, ...productEntries, ...articleEntries, ...videoEntries];
}
