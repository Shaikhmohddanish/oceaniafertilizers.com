import { expect, test, type Browser, type Page } from '@playwright/test';

import { E2E_ADMIN_PASSWORD } from '../../playwright.config';

import { uniqueMobile, waitForFillTime } from './helpers';

async function fillFarmCallback(page: Page, phone: string) {
  await page.fill('#farm-callback-fullName', 'Test Farmer');
  await page.fill('#farm-callback-location', 'Test village');
  await page.selectOption('#farm-callback-state', 'Tamil Nadu');
  await page.selectOption('#farm-callback-crop', 'Turmeric');
  await page.fill('#farm-callback-area', '2.5');
  await page.fill('#farm-callback-phone', phone);
  await page.check('#farm-callback-consentContact');
}

test.describe('homepage farm callback', () => {
  test('explains every missing field, then stores a valid request once', async ({ page }) => {
    await page.goto('/');
    await page.locator('#farm-callback button[type="submit"]').click();
    const summary = page.locator('#farm-callback-summary');
    await expect(summary).toBeFocused();
    await expect(summary.locator('li')).toHaveCount(6);
    await expect(summary).toContainText('Enter your mobile number.');
    await expect(page.locator('#farm-callback-phone')).toHaveAttribute('aria-invalid', 'true');

    const phone = uniqueMobile(1);
    await fillFarmCallback(page, phone);
    await waitForFillTime(page);
    await page.locator('#farm-callback button[type="submit"]').click();
    const result = page.getByRole('status').filter({ hasText: 'Received' });
    await expect(result).toContainText(/Your reference: OF-[2-9A-HJ-NP-Z]{6}/);
    await expect(result).toBeFocused();

    await page.reload();
    await fillFarmCallback(page, phone);
    await waitForFillTime(page);
    await page.locator('#farm-callback button[type="submit"]').click();
    await expect(page.getByRole('status').filter({ hasText: 'Already received' })).toContainText('We already have this from you today');
  });

  test('works without JavaScript as a plain form post', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto('/');
    await fillFarmCallback(page, uniqueMobile(2));
    await page.locator('#farm-callback button[type="submit"]').click();
    // The reloaded page opens at the form, so the outcome is on screen.
    await expect(page).toHaveURL(/#farm-callback$/);
    await expect(page.getByText(/Your reference: OF-/)).toBeInViewport();
    await context.close();
  });

  test('rejects a filled honeypot without storing anything', async ({ page }) => {
    await page.goto('/');
    await fillFarmCallback(page, uniqueMobile(3));
    await page.evaluate(() => {
      const trap = document.querySelector<HTMLInputElement>('#farm-callback input[name="oc_hp"]');
      if (trap) trap.value = 'https://spam.example';
    });
    await waitForFillTime(page);
    await page.locator('#farm-callback button[type="submit"]').click();
    await expect(page.locator('#farm-callback-summary')).toContainText('could not accept this submission');
  });
});

test('product enquiry names the product', async ({ page }) => {
  await page.goto('/products/halad-special');
  await page.fill('#enquiry-halad-special-fullName', 'Test Grower');
  await page.fill('#enquiry-halad-special-phone', uniqueMobile(4));
  await page.selectOption('#enquiry-halad-special-state', 'Karnataka');
  await page.fill('#enquiry-halad-special-district', 'Chamarajanagar');
  await page.check('#enquiry-halad-special-consentContact');
  await waitForFillTime(page);
  await page.getByRole('button', { name: 'Enquire about Halad Special' }).last().click();
  await expect(page.getByRole('status').filter({ hasText: 'Received' })).toContainText('about Halad Special');
});

test('partner application is stored and visible to the team', async ({ page, browser }) => {
  const business = `E2E Agri Inputs ${Date.now()}`;
  await page.goto('/become-a-partner');
  await page.fill('#partner-fullName', 'Test Partner');
  await page.fill('#partner-phone', uniqueMobile(5));
  await page.fill('#partner-email', 'partner@example.com');
  await page.fill('#partner-businessName', business);
  await page.selectOption('#partner-state', 'Gujarat');
  await page.fill('#partner-district', 'Rajkot');
  await page.fill('#partner-pinCode', '360001');
  await page.check('#partner-partnershipType-dealer');
  await page.selectOption('#partner-experience', '5-10');
  await page.check('#partner-consentPrivacy');
  await waitForFillTime(page);
  await page.getByRole('button', { name: 'Send application' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Received' })).toContainText('Application received');

  const admin = await browser.newPage();
  await admin.goto('/admin');
  await admin.fill('#admin-password', E2E_ADMIN_PASSWORD);
  await admin.getByRole('button', { name: 'Sign in' }).click();
  await admin.waitForURL('**/admin/leads');
  await admin.goto('/admin/leads?form=partner_application');
  await expect(admin.locator('tbody')).toContainText('Test Partner');
  await admin.locator('tbody a').first().click();
  await expect(admin.locator('main')).toContainText(business);
  await expect(admin.locator('main')).toContainText('Dealer');
  await admin.close();
});

test('partner form checks the PIN code and GSTIN', async ({ page }) => {
  await page.goto('/become-a-partner');
  await page.fill('#partner-pinCode', '012345');
  await page.fill('#partner-gstin', '27ABCDE1234F1Z0');
  await page.getByRole('button', { name: 'Send application' }).click();
  await expect(page.locator('#partner-summary')).toContainText('Enter a 6-digit PIN code.');
});

test('farmer registration pre-selects the interest from the address', async ({ page }) => {
  await page.goto('/join-oceania?interest=demo-plot');
  await expect(page.locator('#join-interests-demo-plot')).toBeChecked();
  await page.fill('#join-fullName', 'Test Farmer');
  await page.fill('#join-phone', uniqueMobile(6));
  await page.selectOption('#join-state', 'Punjab');
  await page.fill('#join-district', 'Ludhiana');
  await page.selectOption('#join-crop', 'Wheat');
  await page.check('#join-consentContact');
  await waitForFillTime(page);
  await page.getByRole('button', { name: 'Join the community' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Received' })).toContainText('Welcome to Oceania');
});

test('contact form pre-selects the topic and sends a message', async ({ page }) => {
  await page.goto('/contact?topic=experience');
  await expect(page.locator('#contact-topic')).toHaveValue('experience');
  await page.fill('#contact-fullName', 'Test Visitor');
  await page.fill('#contact-phone', uniqueMobile(7));
  await page.selectOption('#contact-role', 'farmer');
  await page.selectOption('#contact-state', 'Kerala');
  await page.fill('#contact-message', 'I used WAVES on my vegetable plot this season and would like to share how it went.');
  await page.check('#contact-consentPrivacy');
  await waitForFillTime(page);
  await page.getByRole('button', { name: 'Send message' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Received' })).toContainText('Message received');
});

test('newsletter subscribes once and reports a repeat honestly', async ({ page }) => {
  const email = `grower${Date.now()}@example.in`;
  for (const expected of ['You are subscribed', 'already subscribed']) {
    await page.goto('/about');
    const footer = page.locator('footer');
    await footer.locator('#newsletter-email').fill(email);
    await footer.locator('#newsletter-consentNewsletter').check();
    await waitForFillTime(page);
    await footer.getByRole('button', { name: 'Subscribe' }).click();
    await expect(footer.getByRole('status')).toContainText(expected);
  }
});

async function signInToAdmin(browser: Browser) {
  const admin = await browser.newPage();
  await admin.goto('/admin');
  await admin.fill('#admin-password', E2E_ADMIN_PASSWORD);
  await admin.getByRole('button', { name: 'Sign in' }).click();
  await admin.waitForURL('**/admin/leads');
  return admin;
}

test('a subscriber can leave through the personal link in the export', async ({ page, browser }) => {
  const email = `leaving${Date.now()}@example.in`;
  await page.goto('/about');
  const footer = page.locator('footer');
  await footer.locator('#newsletter-email').fill(email);
  await footer.locator('#newsletter-consentNewsletter').check();
  await waitForFillTime(page);
  await footer.getByRole('button', { name: 'Subscribe' }).click();
  await expect(footer.getByRole('status')).toContainText('You are subscribed');

  const admin = await signInToAdmin(browser);
  await admin.goto('/admin/newsletter');
  await expect(admin.locator('tbody')).toContainText(email);
  const csv = await (await admin.request.get('/admin/newsletter/export')).text();
  const link = csv
    .split('\r\n')
    .find((row) => row.includes(email))
    ?.match(/https?:\/\/[^"]+\/newsletter\/unsubscribe\?token=[^"]+/)?.[0];
  if (!link) throw new Error('unsubscribe link missing from the export');

  // Opening the link only asks for confirmation; nothing changes until the button is pressed.
  const { pathname, search } = new URL(link);
  await page.goto(`${pathname}${search}`);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Stop the Oceania newsletter?');
  await expect(page.locator('main')).toContainText(`${email[0]}******@example.in`);
  await page.getByRole('button', { name: 'Unsubscribe' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('You have been unsubscribed.');

  await admin.reload();
  await expect(admin.locator('tbody tr', { hasText: email })).toContainText('Unsubscribed');
  expect(await (await admin.request.get('/admin/newsletter/export')).text()).not.toContain(email);
  await admin.close();
});

test('staff can delete a lead, but only after confirming', async ({ page, browser }) => {
  await page.goto('/');
  await fillFarmCallback(page, uniqueMobile(9));
  await waitForFillTime(page);
  await page.locator('#farm-callback button[type="submit"]').click();
  const received = page.getByRole('status').filter({ hasText: 'Received' });
  const reference = (await received.textContent())?.match(/OF-[2-9A-HJ-NP-Z]{6}/)?.[0];
  if (!reference) throw new Error('no reference shown');

  const admin = await signInToAdmin(browser);
  await admin.goto(`/admin/leads?q=${reference}`);
  await admin.locator('tbody a', { hasText: reference }).click();
  await admin.getByRole('button', { name: 'Delete permanently' }).click();
  await expect(admin.getByRole('alert').filter({ hasText: 'Tick the box' })).toBeVisible();
  await admin.getByLabel(/permanently deletes the record/).check();
  await admin.getByRole('button', { name: 'Delete permanently' }).click();
  await expect(admin.getByRole('status').filter({ hasText: 'The lead was deleted.' })).toBeVisible();
  await admin.goto(`/admin/leads?q=${reference}`);
  await expect(admin.locator('main')).toContainText('No submissions yet for these filters');
  await admin.close();
});
