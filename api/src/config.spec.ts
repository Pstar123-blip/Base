import { describe, expect, it } from '@jest/globals';

import { validateEnv } from './config.js';
import { ENV_KEYS } from './envKeys.constants.js';

describe('environment', () => {
  it('rejects missing configuration', () =>
    expect(() => validateEnv({})).toThrow());
  it('rejects short access secrets', () =>
    expect(() =>
      validateEnv({
        [ENV_KEYS.DATABASE_URL]: 'postgres://localhost/db',
        [ENV_KEYS.CLIENT_ORIGIN]: 'http://localhost',
        [ENV_KEYS.JWT_ACCESS_SECRET]: 'short',
      }),
    ).toThrow('at least 32'));
});
