import 'dotenv/config';

import { defineConfig } from 'drizzle-kit';

import { ENV_KEYS } from './src/envKeys.constants.js';

export default defineConfig({
  schema: './src/database/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: { url: process.env[ENV_KEYS.DATABASE_URL] ?? '' },
  strict: true,
});
