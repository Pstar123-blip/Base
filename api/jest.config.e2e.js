import config from './jest.config.js';

export default {
  ...config,
  testMatch: ['<rootDir>/test/**/*.e2e-spec.ts'],
};
