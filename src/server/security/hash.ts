import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

const DEVELOPMENT_SALT = 'oceania-local-development-salt';

/** Salted one-way hash of an IP address. The address itself is never stored. */
export function hashIp(ip: string | null | undefined, salt: string | undefined): string {
  return createHash('sha256')
    .update(`${salt ?? DEVELOPMENT_SALT}:${ip ?? 'unknown'}`)
    .digest('hex')
    .slice(0, 32);
}

export function hmac(value: string, secret: string): string {
  return createHmac('sha256', secret).update(value).digest('base64url');
}

/** Constant-time comparison for secrets of any length. */
export function safeEqual(a: string, b: string): boolean {
  const left = createHash('sha256').update(a).digest();
  const right = createHash('sha256').update(b).digest();
  return timingSafeEqual(left, right);
}
