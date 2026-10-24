import 'server-only';

import { cache } from 'react';

import { showPendingContent } from '@/lib/site-config';
import { isSanityConfigured } from '@/sanity/env';
import { sanitySource } from '@/sanity/source';

import { localSource } from './local';
import type { ContentSource } from './source';
import type {
  Article,
  DemoPlot,
  Faq,
  GalleryItem,
  LegalPage,
  PageIntroKey,
  Product,
  PublicationStatus,
  Testimonial,
} from './types';

/*
 * The only module pages read content through. It picks the source and applies
 * the publication rule: pending items are dropped in production.
 */

/** Sanity once a project is connected; until then, the content bundled with the code. */
const source: ContentSource = isSanityConfigured ? sanitySource : localSource;

function visible<T extends { status: PublicationStatus }>(items: T[]): T[] {
  return showPendingContent ? items : items.filter((item) => item.status === 'published');
}

const byOrder = <T extends { order: number }>(a: T, b: T) => a.order - b.order;

export const getSiteSettings = cache(() => source.getSiteSettings());
export const getHomePage = cache(() => source.getHomePage());
export const getAboutPage = cache(() => source.getAboutPage());
export const getPartnerProgramme = cache(() => source.getPartnerProgramme());

export const getProducts = cache(async (): Promise<Product[]> => {
  const products = await source.getProducts();
  return visible(products).sort((a, b) => {
    if (a.status !== b.status) return a.status === 'published' ? -1 : 1;
    return byOrder(a, b);
  });
});

export const getProduct = cache(async (slug: string): Promise<Product | null> => {
  const products = await getProducts();
  return products.find((product) => product.slug === slug) ?? null;
});

export async function getFeaturedProducts(slugs: string[] = [], limit = 4): Promise<Product[]> {
  const products = await getProducts();
  const chosen = slugs
    .map((slug) => products.find((product) => product.slug === slug))
    .filter((product): product is Product => Boolean(product));
  const extra = products.filter((product) => product.featured && !chosen.includes(product));
  return [...chosen, ...extra].filter((product) => product.status === 'published').slice(0, limit);
}

export async function getRelatedProducts(product: Product, limit = 3): Promise<Product[]> {
  const products = (await getProducts()).filter((item) => item.slug !== product.slug);
  const manual = product.relatedProductSlugs
    .map((slug) => products.find((item) => item.slug === slug))
    .filter((item): item is Product => Boolean(item));
  const sameCategory = products.filter(
    (item) => item.category.slug === product.category.slug && !manual.includes(item),
  );
  return [...manual, ...sameCategory].slice(0, limit);
}

/** Categories that have at least one visible product, in catalogue order. */
export async function getActiveProductCategories() {
  const [categories, products] = await Promise.all([source.getProductCategories(), getProducts()]);
  return categories.filter((category) => products.some((product) => product.category.slug === category.slug));
}

export const getCrops = cache(() => source.getCrops());

export const getTestimonials = cache(async (): Promise<Testimonial[]> =>
  visible(await source.getTestimonials()).sort(byOrder),
);

export async function getTestimonialsForProduct(slug: string): Promise<Testimonial[]> {
  return (await getTestimonials()).filter((item) => item.products.some((product) => product.slug === slug));
}

export const getDemoPlots = cache(async (): Promise<DemoPlot[]> =>
  visible(await source.getDemoPlots()).sort(byOrder),
);

export async function getDemoPlotsForProduct(slug: string): Promise<DemoPlot[]> {
  return (await getDemoPlots()).filter((plot) => plot.products.some((product) => product.slug === slug));
}

export const getGalleryItems = cache(async (): Promise<GalleryItem[]> =>
  visible(await source.getGalleryItems()).sort(byOrder),
);

export async function getActiveGalleryCategories() {
  const [categories, items] = await Promise.all([source.getGalleryCategories(), getGalleryItems()]);
  return categories.filter((category) => items.some((item) => item.category.slug === category.slug));
}

export const getArticles = cache(async (): Promise<Article[]> => {
  const articles = visible(await source.getArticles());
  return articles.sort((a, b) => (b.publishedAt ?? b.updatedAt).localeCompare(a.publishedAt ?? a.updatedAt));
});

export const getArticle = cache(async (slug: string): Promise<Article | null> => {
  const articles = await getArticles();
  return articles.find((article) => article.slug === slug) ?? null;
});

export async function getActiveArticleCategories() {
  const [categories, articles] = await Promise.all([source.getArticleCategories(), getArticles()]);
  return categories.filter((category) =>
    articles.some((article) => article.categories.some((item) => item.slug === category.slug)),
  );
}

export const getLegalPage = cache((slug: LegalPage['slug']) => source.getLegalPage(slug));

export const getPageIntro = cache((key: PageIntroKey) => source.getPageIntro(key));

export async function getFaqs(topic?: Faq['topic']): Promise<Faq[]> {
  const faqs = await source.getFaqs();
  return faqs.filter((faq) => !topic || faq.topic === topic).sort(byOrder);
}
