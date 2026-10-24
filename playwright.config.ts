import { defineConfig, devices } from '@playwright/test';

/*
 * End-to-end tests run against a real production build (next build + next
 * start) in production mode, with a fresh local database and the labelled
 * test fixtures switched on so the video, slider and gallery can be tested.
 */
const PORT = 3100;
export const E2E_ADMIN_PASSWORD = 'e2e-admin-password-0123';

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  workers: 3,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
    reducedMotion: 'reduce',
  },
  projects: [
    {
      name: 'chrome',
      use: { ...devices['Desktop Chrome'], channel: process.env.PLAYWRIGHT_CHANNEL ?? 'chrome' },
    },
  ],
  webServer: {
    command: `node -e "require('fs').rmSync('.data/e2e',{recursive:true,force:true})" && npm run build && npx next start --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: Boolean(process.env.E2E_REUSE_SERVER),
    timeout: 600_000,
    stdout: 'ignore',
    stderr: 'pipe',
    env: {
      NEXT_DIST_DIR: '.next-e2e',
      NEXT_PUBLIC_SITE_ENV: 'production',
      NEXT_PUBLIC_SITE_URL: `http://localhost:${PORT}`,
      NEXT_PUBLIC_SANITY_PROJECT_ID: '',
      NEXT_PUBLIC_TURNSTILE_SITE_KEY: '',
      TURNSTILE_SECRET_KEY: '',
      RESEND_API_KEY: '',
      DATABASE_URL: '',
      E2E_FIXTURES: '1',
      PGLITE_DATA_DIR: '.data/e2e',
      ADMIN_PASSWORD: E2E_ADMIN_PASSWORD,
      ADMIN_SESSION_SECRET: 'e2e-session-secret-0123456789abcdef0123456789',
      IP_HASH_SALT: 'e2e-salt-value',
    },
  },
});
