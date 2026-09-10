import { defineConfig } from 'vitest/config';

import { ENV_KEYS } from './src/envKeys.constants.js';

if (!process.env[ENV_KEYS.TEST_DATABASE_URL]) {
  throw new Error('Set TEST_DATABASE_URL to a disposable PostgreSQL database');
}

export default defineConfig({
  test: {
    include: ['test/**/*.integration-spec.ts'],
    testTimeout: 15000,
    hookTimeout: 15000,
  },
});
