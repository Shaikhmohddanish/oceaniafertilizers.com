import 'server-only';

import path from 'node:path';

import { serverEnv } from '@/lib/env';

import type { AppDatabase } from './types';
import * as schema from './schema';

export class DatabaseUnavailableError extends Error {
  constructor(message = 'The database is not configured.') {
    super(message);
    this.name = 'DatabaseUnavailableError';
  }
}

const globalForDb = globalThis as unknown as { __oceaniaDb?: Promise<AppDatabase> };

/**
 * Neon over HTTP when DATABASE_URL is set. Without it, a local PGlite database
 * in .data/pglite (development and tests only). On Vercel a missing
 * DATABASE_URL is an error, so a production form can never pretend to save.
 */
export function getDb(): Promise<AppDatabase> {
  globalForDb.__oceaniaDb ??= connect().catch((error: unknown) => {
    globalForDb.__oceaniaDb = undefined;
    throw error;
  });
  return globalForDb.__oceaniaDb;
}

async function connect(): Promise<AppDatabase> {
  const { DATABASE_URL, PGLITE_DATA_DIR, VERCEL } = serverEnv();

  if (DATABASE_URL) {
    const [{ neon }, { drizzle }] = await Promise.all([
      import('@neondatabase/serverless'),
      import('drizzle-orm/neon-http'),
    ]);
    return drizzle(neon(DATABASE_URL), { schema }) as unknown as AppDatabase;
  }

  if (VERCEL) throw new DatabaseUnavailableError('DATABASE_URL is not set for this deployment.');

  const { createPgliteDatabase } = await import('./pglite');
  const dataDir = PGLITE_DATA_DIR === 'memory' ? undefined : (PGLITE_DATA_DIR ?? path.join(process.cwd(), '.data', 'pglite'));
  return createPgliteDatabase(dataDir);
}
