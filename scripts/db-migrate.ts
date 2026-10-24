/*
 * Applies the SQL migrations in ./drizzle to the Postgres database at DATABASE_URL
 * (Neon in production and preview).
 *
 *   DATABASE_URL=postgres://... npm run db:migrate
 *
 * Without DATABASE_URL in the environment it reads .env.local. Local development
 * does not need this script: the PGlite database migrates itself on first use.
 *
 * Neon's WebSocket driver is used here (not the HTTP one the site uses) so that
 * all pending migrations run inside a single transaction: either every
 * statement applies or none does. Node 22+ provides the WebSocket it needs.
 */
import path from 'node:path';

import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { migrate } from 'drizzle-orm/neon-serverless/migrator';

function databaseUrl() {
  if (!process.env.DATABASE_URL) {
    try {
      process.loadEnvFile('.env.local');
    } catch {
      // No .env.local; the check below explains what to do.
    }
  }
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error('DATABASE_URL is not set. Run: DATABASE_URL=postgres://... npm run db:migrate');
    process.exit(1);
  }
  return url;
}

async function main() {
  const url = databaseUrl();
  const pool = new Pool({ connectionString: url });
  try {
    await migrate(drizzle(pool), { migrationsFolder: path.join(process.cwd(), 'drizzle') });
    // Print the host only, never the credentials in the URL.
    console.log(`Migrations are up to date on ${new URL(url).host}.`);
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error('Migration failed. Pending migrations run in one transaction, so none of them were applied.');
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
