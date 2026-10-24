import 'server-only';

import { cookies } from 'next/headers';

import { serverEnv } from '@/lib/env';

import { hmac, safeEqual } from '../security/hash';

const COOKIE = 'oc_admin';
const SESSION_HOURS = 8;

/** The admin area exists only when both a password and a session secret are configured. */
export function adminEnabled(): boolean {
  const { ADMIN_PASSWORD, ADMIN_SESSION_SECRET } = serverEnv();
  return Boolean(ADMIN_PASSWORD && ADMIN_PASSWORD.length >= 12 && ADMIN_SESSION_SECRET && ADMIN_SESSION_SECRET.length >= 32);
}

export function passwordMatches(candidate: string): boolean {
  const { ADMIN_PASSWORD } = serverEnv();
  return Boolean(ADMIN_PASSWORD) && safeEqual(candidate, ADMIN_PASSWORD as string);
}

function sign(expires: number): string {
  return `${expires}.${hmac(String(expires), serverEnv().ADMIN_SESSION_SECRET as string)}`;
}

export async function startSession() {
  const expires = Date.now() + SESSION_HOURS * 60 * 60 * 1000;
  (await cookies()).set(COOKIE, sign(expires), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: SESSION_HOURS * 60 * 60,
  });
}

export async function endSession() {
  (await cookies()).delete(COOKIE);
}

/** True only for a correctly signed, unexpired session cookie. */
export async function hasSession(): Promise<boolean> {
  if (!adminEnabled()) return false;
  const value = (await cookies()).get(COOKIE)?.value;
  if (!value) return false;
  const [expiresText] = value.split('.');
  const expires = Number(expiresText);
  if (!Number.isFinite(expires) || expires < Date.now()) return false;
  return safeEqual(value, sign(expires));
}
