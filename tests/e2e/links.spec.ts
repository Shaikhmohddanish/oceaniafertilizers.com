import { expect, test } from '@playwright/test';

import { ROUTES } from './helpers';

test('every internal link on every page resolves', async ({ page, request }) => {
  test.setTimeout(180_000);
  const links = new Set<string>();
  for (const route of ROUTES) {
    await page.goto(route);
    const hrefs = await page.$$eval('a[href^="/"]', (anchors) => anchors.map((anchor) => anchor.getAttribute('href') ?? ''));
    for (const href of hrefs) {
      const path = href.split('#')[0] ?? '';
      if (path && !path.startsWith('/admin') && !path.startsWith('/studio') && !path.startsWith('/api')) links.add(path);
    }
  }

  const broken: string[] = [];
  for (const link of links) {
    const response = await request.get(link);
    if (response.status() >= 400) broken.push(`${link} -> ${response.status()}`);
  }
  expect(links.size).toBeGreaterThan(12);
  expect(broken).toEqual([]);
});
