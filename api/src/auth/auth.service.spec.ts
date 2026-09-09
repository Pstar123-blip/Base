import { ConfigService } from '@nestjs/config';
import { type JwtService } from '@nestjs/jwt';
import { describe, expect, it, vi } from 'vitest';

import type { Database } from '../database/database.module.js';
import { AuthService } from './auth.service.js';
import type { UsersRepository } from './users.repository.js';

function fixture() {
  const returning = vi.fn().mockResolvedValue([{ id: 'session-id' }]);
  const values = vi.fn().mockResolvedValue(undefined);
  const database = {
    db: {
      delete: vi.fn(() => ({ where: vi.fn(() => ({ returning })) })),
      insert: vi.fn(() => ({ values })),
    },
  };
  const users = { byId: vi.fn().mockResolvedValue({ id: 'user-id' }) };
  const jwt = {
    verifyAsync: vi.fn().mockResolvedValue({
      sub: 'user-id',
      sid: 'session-id',
      kind: 'refresh',
    }),
    signAsync: vi.fn().mockResolvedValue('new-token'),
  };
  const service = new AuthService(
    users as unknown as UsersRepository,
    database as unknown as Database,
    jwt as unknown as JwtService,
    new ConfigService({
      JWT_ACCESS_SECRET: 'a'.repeat(32),
      JWT_REFRESH_SECRET: 'b'.repeat(32),
    }),
  );
  return { service, returning, values, users, jwt };
}
describe('refresh rotation', () => {
  it('consumes the session and stores only a hash of the replacement', async () => {
    const { service, returning, values } = fixture();
    expect(await service.refresh('old-token')).toEqual({
      accessToken: 'new-token',
      refreshToken: 'new-token',
    });
    expect(returning).toHaveBeenCalledOnce();
    expect(values).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user-id',
        tokenHash: expect.stringMatching(/^[a-f0-9]{64}$/),
      }),
    );
  });
  it('rejects a consumed or expired session', async () => {
    const { service, returning, values } = fixture();
    returning.mockResolvedValue([]);
    await expect(service.refresh('old-token')).rejects.toThrow();
    expect(values).not.toHaveBeenCalled();
  });
  it('rejects invalid signatures and access tokens', async () => {
    const { service, jwt, returning } = fixture();
    jwt.verifyAsync.mockRejectedValueOnce(new Error('invalid'));
    await expect(service.refresh('invalid')).rejects.toThrow();
    jwt.verifyAsync.mockResolvedValueOnce({
      sub: 'user-id',
      sid: 'session-id',
      kind: 'access',
    });
    await expect(service.refresh('access-token')).rejects.toThrow();
    expect(returning).not.toHaveBeenCalled();
  });
  it('rejects deleted users', async () => {
    const { service, users, returning } = fixture();
    users.byId.mockResolvedValue(undefined);
    await expect(service.refresh('token')).rejects.toThrow();
    expect(returning).not.toHaveBeenCalled();
  });
});
