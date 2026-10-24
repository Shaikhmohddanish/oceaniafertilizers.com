import { expect, test } from '@playwright/test';

import { ROUTES, trackErrors } from './helpers';

test.describe('public routes', () => {
  for (const route of ROUTES) {
    test(`${route} renders with one h1, metadata and no console errors`, async ({ page }) => {
      const errors = trackErrors(page);
      const response = await page.goto(route, { waitUntil: 'networkidle' });
      expect(response?.status()).toBe(200);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page).toHaveTitle(/Oceania Fertilizers/);

      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
      expect(canonical).toBe(`http://localhost:3100${route === '/' ? '' : route}`);
      expect(await page.locator('meta[name="description"]').getAttribute('content')).toBeTruthy();
      expect(await page.locator('meta[property="og:image"]').count()).toBeGreaterThan(0);
      expect(await page.locator('html').getAttribute('lang')).toBe('en-IN');

      expect(errors).toEqual([]);
    });
  }
});

test('unknown and unpublished pages return a proper 404', async ({ page }) => {
  for (const path of ['/does-not-exist', '/products/bingorhiza', '/insights/how-to-read-your-soil-health-card']) {
    const response = await page.goto(path);
    expect(response?.status(), path).toBe(404);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('We could not find that page.');
  }
});

test('production shows no pending content and no preview notice', async ({ page }) => {
  for (const route of ['/', '/products', '/insights']) {
    await page.goto(route);
    await expect(page.getByText('Pending approval')).toHaveCount(0);
    await expect(page.getByText('Preview build')).toHaveCount(0);
  }
  await page.goto('/products');
  await expect(page.locator('#product-list > li')).toHaveCount(2);
});

test('robots and sitemap describe only published pages', async ({ request }) => {
  const robots = await (await request.get('/robots.txt')).text();
  expect(robots).toContain('Allow: /');
  expect(robots).toContain('Disallow: /admin');
  expect(robots).toContain('Sitemap: http://localhost:3100/sitemap.xml');

  const sitemap = await (await request.get('/sitemap.xml')).text();
  expect(sitemap).toContain('/products/halad-special');
  expect(sitemap).toContain('/products/waves-mycorrhizal-biofertilizer');
  expect(sitemap).not.toContain('bingorhiza');
  expect(sitemap).not.toContain('/insights/how-to-read');
});

test('structured data is present and honest', async ({ page }) => {
  await page.goto('/products/halad-special');
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  const data = blocks.flatMap((block) => {
    const parsed = JSON.parse(block);
    return Array.isArray(parsed) ? parsed : [parsed];
  });
  const types = data.map((item) => item['@type']);
  expect(types).toEqual(expect.arrayContaining(['Organization', 'WebSite', 'BreadcrumbList', 'Product']));
  const product = data.find((item) => item['@type'] === 'Product');
  expect(product.name).toBe('Halad Special');
  expect(product).not.toHaveProperty('offers');
  expect(product).not.toHaveProperty('aggregateRating');
});

test('security headers are sent', async ({ request }) => {
  const response = await request.get('/');
  const headers = response.headers();
  expect(headers['content-security-policy']).toContain("frame-ancestors 'self'");
  expect(headers['x-content-type-options']).toBe('nosniff');
  expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
  expect(headers['strict-transport-security']).toContain('max-age=');
  expect(headers['permissions-policy']).toContain('camera=()');
  expect(headers['x-frame-options']).toBe('SAMEORIGIN');
  expect(headers['x-powered-by']).toBeUndefined();

  // The Studio loads Sanity's own scripts, so it is left out of the site policy, but it is never indexed.
  const studio = await request.get('/studio');
  expect(studio.headers()['x-robots-tag']).toContain('noindex');
  expect(studio.headers()['x-frame-options']).toBe('SAMEORIGIN');
});

test('private areas are not discoverable', async ({ request }) => {
  expect((await request.get('/admin/leads/export')).status()).toBe(404);
  const admin = await request.get('/admin');
  expect(admin.headers()['x-robots-tag']).toContain('noindex');
});
