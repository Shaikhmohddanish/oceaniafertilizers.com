import path from 'node:path';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
      // Server-only guards are for the Next.js bundler; tests run on the server anyway.
      'server-only': path.resolve(import.meta.dirname, 'tests/unit/stubs/server-only.ts'),
    },
  },
  test: {
    include: ['tests/unit/**/*.test.ts'],
    environment: 'node',
    testTimeout: 30000,
  },
});
