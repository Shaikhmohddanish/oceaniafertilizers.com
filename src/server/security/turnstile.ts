import 'server-only';

import { serverEnv } from '@/lib/env';

export type TurnstileResult = 'passed' | 'failed' | 'not_configured';

/**
 * Verifies a Cloudflare Turnstile token. Without a secret key configured the
 * check is skipped (local development); the honeypot, timing check and rate
 * limit still apply.
 */
export async function verifyTurnstile(token: FormDataEntryValue | null, ip: string | null): Promise<TurnstileResult> {
  const secret = serverEnv().TURNSTILE_SECRET_KEY;
  if (!secret) return 'not_configured';
  if (typeof token !== 'string' || token.length === 0) return 'failed';

  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set('remoteip', ip);

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body,
      signal: AbortSignal.timeout(6000),
    });
    const result = (await response.json()) as { success?: boolean };
    return result.success ? 'passed' : 'failed';
  } catch {
    return 'failed';
  }
}
