// Visual QA: full-page screenshots of routes at phone and desktop widths,
// also cut into readable slices. Uses installed Chrome when available.
//
// Usage: node scripts/screenshots.mjs [/route ...]
//   BASE_URL=http://localhost:3000 (default)   VIEWPORTS=mobile,desktop (default)
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

import { chromium } from '@playwright/test';
import sharp from 'sharp';

const base = process.env.BASE_URL ?? 'http://localhost:3000';
const routes = process.argv.slice(2).length > 0 ? process.argv.slice(2) : ['/'];
const outDir = process.env.OUT_DIR ?? 'reports/screenshots';
const sliceHeight = Number(process.env.SLICE_HEIGHT ?? 1600);

const allViewports = {
  mobile: { width: 390, height: 844, isMobile: true, hasTouch: true },
  small: { width: 320, height: 640, isMobile: true, hasTouch: true },
  tablet: { width: 834, height: 1112, isMobile: true, hasTouch: true },
  desktop: { width: 1440, height: 900, isMobile: false, hasTouch: false },
  wide: { width: 1920, height: 1080, isMobile: false, hasTouch: false },
};
const wanted = (process.env.VIEWPORTS ?? 'mobile,desktop').split(',');

mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ channel: 'chrome' }).catch(() => chromium.launch());

for (const name of wanted) {
  const viewport = allViewports[name];
  if (!viewport) continue;
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: 1,
    isMobile: viewport.isMobile,
    hasTouch: viewport.hasTouch,
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  const consoleErrors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('pageerror', (error) => consoleErrors.push(String(error)));

  for (const route of routes) {
    const slug = route === '/' ? 'home' : route.replace(/^\//, '').replace(/[/?=&]+/g, '_');
    await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });
    // Deferred sections only render near the viewport; a full-page capture needs them all.
    await page.addStyleTag({ content: '.render-later { content-visibility: visible !important; }' });
    // Let lazy images load by scrolling through the page once.
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.8;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((resolve) => setTimeout(resolve, 120));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForLoadState('networkidle');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    const file = join(outDir, `${slug}-${name}.png`);
    await page.screenshot({ path: file, fullPage: true });

    const meta = await sharp(file).metadata();
    const slices = Math.ceil((meta.height ?? 0) / sliceHeight);
    for (let index = 0; index < slices; index += 1) {
      const top = index * sliceHeight;
      const height = Math.min(sliceHeight, (meta.height ?? 0) - top);
      await sharp(file)
        .extract({ left: 0, top, width: meta.width ?? viewport.width, height })
        .jpeg({ quality: 82 })
        .toFile(join(outDir, `${slug}-${name}-${String(index + 1).padStart(2, '0')}.jpg`));
    }
    console.log(
      `${route} [${name}] ${meta.width}x${meta.height}, ${slices} slice(s), horizontal overflow: ${overflow}px${
        consoleErrors.length ? `, console errors: ${consoleErrors.length}` : ''
      }`,
    );
    for (const error of consoleErrors.splice(0)) console.log(`   console: ${error.slice(0, 300)}`);
  }
  await context.close();
}

await browser.close();
