import { expect, test } from '@playwright/test';

import { ROUTES } from './helpers';

const WIDTHS = [320, 360, 390, 768, 1024, 1280, 1440, 1920];

test('no page scrolls sideways at any common screen width', async ({ page }) => {
  test.setTimeout(300_000);
  const problems: string[] = [];
  for (const width of WIDTHS) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ROUTES) {
      await page.goto(route);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      if (overflow > 0) problems.push(`${route} at ${width}px overflows by ${overflow}px`);
    }
  }
  expect(problems).toEqual([]);
});

test('touch targets in the header and forms are at least 24px', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of ['/', '/contact', '/become-a-partner']) {
    await page.goto(route);
    const small = await page.$$eval('header button, header a, form button, form input:not([type="hidden"]), form select', (elements) =>
      elements
        .filter((element) => {
          const style = getComputedStyle(element);
          if (style.position === 'absolute' && element.closest('[aria-hidden="true"]')) return false;
          const rect = element.getBoundingClientRect();
          return rect.width > 0 && (rect.width < 24 || rect.height < 24);
        })
        .map((element) => element.outerHTML.slice(0, 80)),
    );
    expect(small, route).toEqual([]);
  }
});
