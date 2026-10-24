'use client';

/**
 * Sanity Studio, embedded at /studio. Editors sign in with their Sanity
 * account; content is published to the dataset the website reads from.
 */
import { defineConfig } from 'sanity';
import { presentationTool } from 'sanity/presentation';
import { structureTool } from 'sanity/structure';

import { apiVersion, dataset, isSanityConfigured, projectId, studioBasePath } from './src/sanity/env';
import { SINGLETON_TYPES, schemaTypes } from './src/sanity/schemaTypes';
import { structure } from './src/sanity/structure';

// Page openings and legal pages are opened from fixed menu entries, not created freely.
const FIXED_ID_TYPES = new Set([...SINGLETON_TYPES, 'pageIntro', 'legalPage']);

export default defineConfig({
  name: 'oceania',
  title: 'Oceania website',
  basePath: studioBasePath,
  projectId: isSanityConfigured ? projectId : 'not-configured',
  dataset,
  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter((template) => !FIXED_ID_TYPES.has(template.schemaType)),
  },
  document: {
    // Singletons can be edited and published, but not duplicated or deleted.
    actions: (actions, context) =>
      FIXED_ID_TYPES.has(context.schemaType)
        ? actions.filter(({ action }) => action === 'publish' || action === 'discardChanges' || action === 'restore')
        : actions,
    newDocumentOptions: (options) => options.filter((option) => !FIXED_ID_TYPES.has(option.templateId)),
  },
  plugins: [
    structureTool({ structure }),
    presentationTool({
      title: 'Preview',
      previewUrl: { previewMode: { enable: '/api/draft-mode/enable' } },
    }),
  ],
  apiVersion,
});
