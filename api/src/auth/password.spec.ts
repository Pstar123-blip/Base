import { describe, expect, it } from 'vitest';

import { hashPassword, verifyPassword } from './password.js';
describe('password storage', () => {
  it('salts hashes and rejects incorrect passwords', async () => {
    const first = await hashPassword('a long password');
    const second = await hashPassword('a long password');
    expect(first).not.toBe(second);
    expect(await verifyPassword('a long password', first)).toBe(true);
    expect(await verifyPassword('wrong', first)).toBe(false);
    expect(await verifyPassword('wrong', 'invalid')).toBe(false);
  });
});
