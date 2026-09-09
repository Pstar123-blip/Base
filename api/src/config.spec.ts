import { describe, expect, it } from 'vitest';

import { validateEnv } from './config.js';
describe('environment', () => {
  it('rejects missing configuration', () =>
    expect(() => validateEnv({})).toThrow());
  it('rejects identical secrets', () =>
    expect(() =>
      validateEnv({
        DATABASE_URL: 'postgres://localhost/db',
        CLIENT_ORIGIN: 'http://localhost',
        JWT_ACCESS_SECRET: 'x'.repeat(32),
        JWT_REFRESH_SECRET: 'x'.repeat(32),
      }),
    ).toThrow('differ'));
});
