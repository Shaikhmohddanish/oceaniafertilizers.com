import { mkdirSync } from 'node:fs';
import path from 'node:path';

import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';
import { migrate } from 'drizzle-orm/pglite/migrator';

import type { AppDatabase } from './types';
import * as schema from './schema';

/**
 * Embedded Postgres for local development and tests. Pass a directory to
 * persist data, or nothing for an in-memory database.
 */
export async function createPgliteDatabase(dataDir?: string): Promise<AppDatabase> {
  if (dataDir) mkdirSync(dataDir, { recursive: true });
  const client = dataDir ? new PGlite(dataDir) : new PGlite();
  const db = drizzle(client, { schema });
  await migrate(db, { migrationsFolder: path.join(process.cwd(), 'drizzle') });
  return db as unknown as AppDatabase;
}
