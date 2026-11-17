import process from 'node:process';

import config from './jest.config.js';

if (!process.env.TEST_DATABASE_URL) {
  throw new Error('Set TEST_DATABASE_URL to a disposable PostgreSQL database');
}

export default {
  ...config,
  testMatch: ['<rootDir>/test/**/*.integration-spec.ts'],
  testTimeout: 15000,
};
