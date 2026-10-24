import 'server-only';

import { z } from 'zod';

/**
 * Server-only environment. Never import this from a client component.
 * Every value is optional so the site builds without services configured;
 * features that need a value check for it and fail safely.
 */
const optionalString = z
  .string()
  .trim()
  .transform((value) => (value === '' ? undefined : value))
  .optional();

const schema = z.object({
  DATABASE_URL: optionalString,
  PGLITE_DATA_DIR: optionalString,
  IP_HASH_SALT: optionalString,
  RESEND_API_KEY: optionalString,
  LEADS_NOTIFY_FROM: optionalString,
  LEADS_NOTIFY_TO: optionalString,
  TURNSTILE_SECRET_KEY: optionalString,
  ADMIN_PASSWORD: optionalString,
  ADMIN_SESSION_SECRET: optionalString,
  SANITY_API_READ_TOKEN: optionalString,
  SANITY_REVALIDATE_SECRET: optionalString,
  E2E_FIXTURES: optionalString,
  VERCEL: optionalString,
});

export type ServerEnv = z.infer<typeof schema>;

let cached: ServerEnv | undefined;

export function serverEnv(): ServerEnv {
  cached ??= schema.parse(process.env);
  return cached;
}

/** Recipients for lead notifications, from a comma-separated list. */
export function notifyRecipients(): string[] {
  return (serverEnv().LEADS_NOTIFY_TO ?? '')
    .split(',')
    .map((address) => address.trim())
    .filter(Boolean);
}

/** Test fixtures load only in automated test runs, never on Vercel. */
export function testFixturesEnabled(): boolean {
  const env = serverEnv();
  return env.E2E_FIXTURES === '1' && !env.VERCEL;
}
