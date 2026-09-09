import { defineConfig } from 'vitest/config';
if (!process.env.TEST_DATABASE_URL)
  throw new Error('Set TEST_DATABASE_URL to a disposable PostgreSQL database');
export default defineConfig({
  test: {
    include: ['test/**/*.integration-spec.ts'],
    testTimeout: 15000,
    hookTimeout: 15000,
  },
});
