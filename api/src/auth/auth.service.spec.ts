import { ConfigService } from '@nestjs/config';
import { type JwtService } from '@nestjs/jwt';
import { describe, expect, it, vi } from 'vitest';

import { ENV_KEYS } from '../envKeys.constants.js';
import type { AdfsService } from './adfs.service.js';
import { AuthService } from './auth.service.js';
import type { SessionsRepository } from './sessions.repository.js';
import type { UsersRepository } from './users.repository.js';

function fixture() {
  const sessions = {
    consume: vi.fn().mockResolvedValue(true),
    create: vi.fn().mockResolvedValue(undefined),
    deleteByTokenHash: vi.fn().mockResolvedValue(undefined),
  };
  const users = {
    byId: vi.fn().mockResolvedValue({ id: 'user-id' }),
    byUsername: vi.fn(),
    create: vi.fn(),
  };
  const jwt = {
    verifyAsync: vi.fn().mockResolvedValue({
      sub: 'user-id',
      sid: 'session-id',
      kind: 'refresh',
    }),
    signAsync: vi.fn().mockResolvedValue('new-token'),
  };
  const adfs = {
    getUser: vi.fn().mockResolvedValue({ username: 'mock.adfs' }),
  };
  const service = new AuthService(
    users as unknown as UsersRepository,
    sessions as unknown as SessionsRepository,
    jwt as unknown as JwtService,
    new ConfigService({
      [ENV_KEYS.JWT_ACCESS_SECRET]: 'a'.repeat(32),
      [ENV_KEYS.JWT_REFRESH_SECRET]: 'b'.repeat(32),
    }),
    adfs as unknown as AdfsService,
  );
  return { service, sessions, users, jwt, adfs };
}

describe('refresh rotation', () => {
  it('consumes the session and stores only a hash of the replacement', async () => {
    const { service, sessions } = fixture();
    expect(await service.refresh('old-token')).toEqual({
      accessToken: 'new-token',
      refreshToken: 'new-token',
    });
    expect(sessions.consume).toHaveBeenCalledWith(
      'session-id',
      expect.stringMatching(/^[a-f0-9]{64}$/),
    );
    expect(sessions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user-id',
        tokenHash: expect.stringMatching(/^[a-f0-9]{64}$/),
      }),
    );
  });
  it('rejects a consumed or expired session', async () => {
    const { service, sessions } = fixture();
    sessions.consume.mockResolvedValue(false);
    await expect(service.refresh('old-token')).rejects.toThrow();
    expect(sessions.create).not.toHaveBeenCalled();
  });
  it('rejects invalid signatures and access tokens', async () => {
    const { service, jwt, sessions } = fixture();
    jwt.verifyAsync.mockRejectedValueOnce(new Error('invalid'));
    await expect(service.refresh('invalid')).rejects.toThrow();
    jwt.verifyAsync.mockResolvedValueOnce({
      sub: 'user-id',
      sid: 'session-id',
      kind: 'access',
    });
    await expect(service.refresh('access-token')).rejects.toThrow();
    expect(sessions.consume).not.toHaveBeenCalled();
  });
  it('rejects deleted users', async () => {
    const { service, users, sessions } = fixture();
    users.byId.mockResolvedValue(undefined);
    await expect(service.refresh('token')).rejects.toThrow();
    expect(sessions.consume).not.toHaveBeenCalled();
  });
});

describe('mock ADFS login', () => {
  const user = {
    id: 'mock-id',
    username: 'mock.adfs',
  };

  it('creates a mock account and returns its public profile with session tokens', async () => {
    const { service, users, sessions, adfs } = fixture();
    users.create.mockResolvedValue(user);
    expect(await service.login('opaque-adfs-token')).toEqual({
      accessToken: 'new-token',
      refreshToken: 'new-token',
      user: { id: user.id, username: user.username },
    });
    expect(adfs.getUser).toHaveBeenCalledWith('opaque-adfs-token');
    expect(users.create).toHaveBeenCalledWith(user.username);
    expect(sessions.create).toHaveBeenCalledWith(
      expect.objectContaining({ userId: user.id }),
    );
  });

  it('reuses the mock account for subsequent tokens', async () => {
    const { service, users } = fixture();
    users.byUsername.mockResolvedValue(user);
    await service.login('another-token');
    expect(users.create).not.toHaveBeenCalled();
  });

  it('uses the username returned by ADFS to resolve the local user', async () => {
    const { service, users, adfs } = fixture();
    adfs.getUser.mockResolvedValue({ username: 'another.user' });
    users.byUsername.mockResolvedValue({
      id: 'another-id',
      username: 'another.user',
    });
    const result = await service.login('another-token');
    expect(users.byUsername).toHaveBeenCalledWith('another.user');
    expect(result.user).toEqual({ id: 'another-id', username: 'another.user' });
    expect(users.create).not.toHaveBeenCalled();
  });

  it('does not create a session when the ADFS lookup fails', async () => {
    const { service, users, sessions, adfs } = fixture();
    adfs.getUser.mockRejectedValue(new Error('ADFS lookup failed'));
    await expect(service.login('token')).rejects.toThrow('ADFS lookup failed');
    expect(users.byUsername).not.toHaveBeenCalled();
    expect(sessions.create).not.toHaveBeenCalled();
  });

  it('rejects an ADFS user without a username', async () => {
    const { service, users, sessions, adfs } = fixture();
    adfs.getUser.mockResolvedValue({ username: '   ' });
    await expect(service.login('token')).rejects.toThrow(
      'ADFS user must have a unique username',
    );
    expect(users.create).not.toHaveBeenCalled();
    expect(sessions.create).not.toHaveBeenCalled();
  });

  it('reuses the account if concurrent creation wins the username constraint', async () => {
    const { service, users } = fixture();
    users.byUsername
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce(user);
    users.create.mockResolvedValue(undefined);
    expect((await service.login('token')).user).toEqual(user);
    expect(users.create).toHaveBeenCalledWith(user.username);
  });

  it('rejects blank tokens without creating a session', async () => {
    const { service, sessions, users } = fixture();
    await expect(service.login('   ')).rejects.toThrow(
      'ADFS token is required',
    );
    expect(users.byUsername).not.toHaveBeenCalled();
    expect(sessions.create).not.toHaveBeenCalled();
  });
});
