import { defineConfig } from 'drizzle-kit';

/*
 * `npm run db:generate` writes SQL migrations to ./drizzle (commit them).
 * `npm run db:migrate` applies them to DATABASE_URL (production, preview).
 * Local development without DATABASE_URL uses PGlite, migrated automatically.
 */
export default defineConfig({
  dialect: 'postgresql',
  schema: './src/server/db/schema.ts',
  out: './drizzle',
  strict: true,
  verbose: true,
  ...(process.env.DATABASE_URL ? { dbCredentials: { url: process.env.DATABASE_URL } } : {}),
});
