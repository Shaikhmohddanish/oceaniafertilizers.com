import type { Page } from '@playwright/test';

/** Every public route, as published in production (plus the fixture farmer video). */
export const ROUTES = [
  '/',
  '/learn',
  '/learn/videos/test-fixture-video',
  '/advice',
  '/products',
  '/products/halad-special',
  '/products/waves-mycorrhizal-biofertilizer',
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
];

/** Collects console errors and uncaught exceptions for the life of the page. */
export function trackErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(String(error)));
  return errors;
}

/** Forms ignore submissions faster than a person could type; wait past that window. */
export async function waitForFillTime(page: Page) {
  await page.waitForTimeout(2200);
}

/** A mobile number unique to this test run, so repeated runs never collide as duplicates. */
export function uniqueMobile(seed: number): string {
  const digits = String(Date.now() + seed).slice(-9);
  return `9${digits}`;
}
