import { afterEach, describe, expect, it, vi } from 'vitest';

/*
 * The publication rule: content marked "pending" (not yet approved by Oceania)
 * must never appear in a production build, and must be visible, with markers,
 * everywhere else.
 */

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

async function loadRepository(siteEnv: string) {
  vi.stubEnv('NEXT_PUBLIC_SITE_ENV', siteEnv);
  vi.stubEnv('NEXT_PUBLIC_SANITY_PROJECT_ID', '');
  return import('@/content/repository');
}

describe('pending content', () => {
  it('is hidden in production', async () => {
    const repository = await loadRepository('production');
    const products = await repository.getProducts();
    expect(products.map((product) => product.slug)).toEqual(['halad-special', 'waves-mycorrhizal-biofertilizer']);
    expect(products.every((product) => product.status === 'published')).toBe(true);
    expect(await repository.getArticles()).toEqual([]);
    expect(await repository.getProduct('bingorhiza')).toBeNull();
  });

  it('is shown in previews, after the published items', async () => {
    const repository = await loadRepository('preview');
    const products = await repository.getProducts();
    expect(products).toHaveLength(8);
    expect(products.slice(0, 2).every((product) => product.status === 'published')).toBe(true);
    expect(products.slice(2).every((product) => product.status === 'pending')).toBe(true);
    expect((await repository.getArticles()).length).toBe(3);
  });

  it('never features pending products on the homepage', async () => {
    const repository = await loadRepository('preview');
    const featured = await repository.getFeaturedProducts(['bingorhiza', 'halad-special']);
    expect(featured.map((product) => product.slug)).toEqual(['halad-special', 'waves-mycorrhizal-biofertilizer']);
  });
});

describe('published farmer content', () => {
  it('contains no testimonials, demo plots or gallery items until real ones are added', async () => {
    vi.stubEnv('E2E_FIXTURES', '');
    const repository = await loadRepository('production');
    expect(await repository.getTestimonials()).toEqual([]);
    expect(await repository.getDemoPlots()).toEqual([]);
    expect(await repository.getGalleryItems()).toEqual([]);
  });
});
