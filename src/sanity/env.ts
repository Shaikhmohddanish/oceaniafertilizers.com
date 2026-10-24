/**
 * Public Sanity configuration. Safe in the browser: project id and dataset
 * are not secrets. Tokens live in server-only environment variables.
 */
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '';
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2026-10-01';

/** True once a Sanity project is connected; until then the site uses its bundled content. */
export const isSanityConfigured = /^[a-z0-9-]+$/.test(projectId);

export const studioBasePath = '/studio';
