import { defineCliConfig } from 'sanity/cli';

/** Used by the Sanity CLI, for example `npx sanity dataset import`. */
export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  },
});
