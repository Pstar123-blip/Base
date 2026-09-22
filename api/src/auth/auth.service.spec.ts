import { describe, expect, it, jest } from '@jest/globals';
import { ConfigService } from '@nestjs/config';
import { type JwtService } from '@nestjs/jwt';

import { ENV_KEYS } from '../envKeys.constants.js';
import type { AdfsService } from './adfs.service.js';
import { AuthService } from './auth.service.js';
import type { UsersRepository } from './users.repository.js';

const fixture = () => {
  const users = {
    byId: jest
      .fn<(...args: unknown[]) => Promise<unknown>>()
      .mockResolvedValue({ id: 'user-id' }),
    byUsername: jest.fn<(...args: unknown[]) => Promise<unknown>>(),
    create: jest.fn<(...args: unknown[]) => Promise<unknown>>(),
  };
  const jwt = {
    signAsync: jest
      .fn<(...args: unknown[]) => Promise<unknown>>()
      .mockResolvedValue('new-token'),
  };
  const adfs = {
    getUser: jest
      .fn<(...args: unknown[]) => Promise<unknown>>()
      .mockResolvedValue({ username: 'mock.adfs' }),
  };
  const service = new AuthService(
    users as unknown as UsersRepository,
    jwt as unknown as JwtService,
    new ConfigService({
      [ENV_KEYS.JWT_ACCESS_SECRET]: 'a'.repeat(32),
    }),
    adfs as unknown as AdfsService,
  );
  return { service, users, jwt, adfs };
};

describe('mock ADFS login', () => {
  const user = {
    id: 'mock-id',
    username: 'mock.adfs',
  };

  it('creates a mock account and returns its public profile with an access token', async () => {
    const { service, users, jwt, adfs } = fixture();
    users.create.mockResolvedValue(user);
    expect(await service.login('opaque-adfs-token')).toEqual({
      accessToken: 'new-token',
      user: { id: user.id, username: user.username },
    });
    expect(adfs.getUser).toHaveBeenCalledWith('opaque-adfs-token');
    expect(users.create).toHaveBeenCalledWith(user.username);
    expect(jwt.signAsync).toHaveBeenCalledTimes(1);
    expect(jwt.signAsync).toHaveBeenCalledWith(
      { sub: user.id, kind: 'access' },
      {
        secret: 'a'.repeat(32),
        expiresIn: 900,
        issuer: 'api',
        audience: 'client',
      },
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

  it('does not issue a token when the ADFS lookup fails', async () => {
    const { service, users, jwt, adfs } = fixture();
    adfs.getUser.mockRejectedValue(new Error('ADFS lookup failed'));
    await expect(service.login('token')).rejects.toThrow('ADFS lookup failed');
    expect(users.byUsername).not.toHaveBeenCalled();
    expect(jwt.signAsync).not.toHaveBeenCalled();
  });

  it('rejects an ADFS user without a username', async () => {
    const { service, users, jwt, adfs } = fixture();
    adfs.getUser.mockResolvedValue({ username: '   ' });
    await expect(service.login('token')).rejects.toThrow(
      'ADFS user must have a unique username',
    );
    expect(users.create).not.toHaveBeenCalled();
    expect(jwt.signAsync).not.toHaveBeenCalled();
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

  it('rejects blank tokens without issuing a token', async () => {
    const { service, users, jwt } = fixture();
    await expect(service.login('   ')).rejects.toThrow(
      'ADFS token is required',
    );
    expect(users.byUsername).not.toHaveBeenCalled();
    expect(jwt.signAsync).not.toHaveBeenCalled();
  });
});
