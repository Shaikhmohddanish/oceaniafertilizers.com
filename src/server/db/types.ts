import type { PgDatabase, PgQueryResultHKT } from 'drizzle-orm/pg-core';

import type * as schema from './schema';

/** Common type for the Neon (production) and PGlite (local) databases. */
export type AppDatabase = PgDatabase<PgQueryResultHKT, typeof schema>;
