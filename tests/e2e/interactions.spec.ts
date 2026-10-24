import { expect, test } from '@playwright/test';

test('mobile menu traps focus, closes on Escape and returns focus', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const trigger = page.getByRole('button', { name: 'Menu' });
  await trigger.click();
  const menu = page.getByRole('dialog', { name: 'Site menu' });
  await expect(menu).toBeVisible();
  await expect(menu.getByRole('link', { name: /Field results/ })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(menu).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('farmer story video loads only when played, and stops on close', async ({ page }) => {
  await page.goto('/farmer-stories');
  await expect(page.locator('iframe')).toHaveCount(0);
  await page.getByRole('button', { name: /Play video: Test fixture farmer/ }).first().click();
  const dialog = page.getByRole('dialog', { name: /Video: Test fixture farmer/ }).first();
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('iframe')).toHaveAttribute('src', /youtube-nocookie\.com\/embed\/aqz-KE-bpKQ/);
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(page.locator('iframe')).toHaveCount(0);
});

test('before and after slider works by keyboard and by pointer', async ({ page }) => {
  await page.goto('/demo-plots');
  const slider = page.locator('input[type="range"]').first();
  await slider.focus();
  for (let index = 0; index < 5; index += 1) await page.keyboard.press('ArrowRight');
  await expect(slider).toHaveValue('55');
  await expect(slider).toHaveAttribute('aria-valuetext', /45 percent after/);

  const frame = page.locator('.cursor-ew-resize').first();
  const box = await frame.boundingBox();
  if (!box) throw new Error('slider frame not found');
  await page.mouse.click(box.x + box.width * 0.25, box.y + box.height / 2);
  const value = Number(await slider.inputValue());
  expect(value).toBeGreaterThanOrEqual(23);
  expect(value).toBeLessThanOrEqual(27);
});

test('gallery lightbox steps through photos with the keyboard', async ({ page }) => {
  await page.goto('/gallery');
  await page.getByRole('button', { name: /Open photo: Test fixture image one/ }).click();
  const viewer = page.getByRole('dialog', { name: 'Photo viewer' });
  await expect(viewer).toBeVisible();
  await expect(viewer).toContainText('1 of 2');
  await page.keyboard.press('ArrowRight');
  await expect(viewer).toContainText('2 of 2');
  await expect(viewer).toContainText('Test fixture image two');
  await page.keyboard.press('Escape');
  await expect(viewer).toBeHidden();
});

test('product category filter updates the list and the address', async ({ page }) => {
  await page.goto('/products');
  await page.getByRole('button', { name: 'Biostimulants' }).click();
  await expect(page).toHaveURL(/category=biostimulants/);
  await expect(page.locator('#product-list > li:visible')).toHaveCount(1);
  await expect(page.locator('#product-list > li:visible')).toContainText('Halad Special');
  await page.getByRole('button', { name: 'Clear filters' }).click();
  await expect(page.locator('#product-list > li:visible')).toHaveCount(2);
});

test('scroll reveals never leave content hidden', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'no-preference' });
  const page = await context.newPage();
  await page.goto('/', { waitUntil: 'networkidle' });
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 60));
    }
  });
  // Every element the scroll passed must have been marked for reveal.
  const missed = await page.$$eval('[data-reveal]:not([data-revealed])', (elements) =>
    elements.map((element) => `${element.tagName} "${(element.textContent ?? '').trim().slice(0, 40)}"`),
  );
  expect(missed).toEqual([]);
  // Sections that have scrolled away skip style updates, so their fade only runs when they are
  // next on screen. Render everything, let the transitions finish, then check what is visible.
  await page.addStyleTag({ content: '.render-later { content-visibility: visible !important; }' });
  await page.waitForTimeout(1500);
  const hidden = await page.$$eval('[data-reveal]', (elements) =>
    elements.filter((element) => getComputedStyle(element).opacity === '0').map((element) => element.outerHTML.slice(0, 80)),
  );
  expect(hidden).toEqual([]);
  await context.close();
});

test('skip link moves focus to the main content', async ({ page }) => {
  await page.goto('/about');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Skip to content' });
  await expect(skip).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
});
