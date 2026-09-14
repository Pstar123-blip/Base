import type { ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Reflector } from '@nestjs/core';
import type { JwtService } from '@nestjs/jwt';
import { describe, expect, it, vi } from 'vitest';

import { ENV_KEYS } from '../envKeys.constants.js';
import { AuthGuard } from './auth.guard.js';
import type { UsersRepository } from './users.repository.js';

function fixture(isPublic = false) {
  const request: { headers: { authorization: string }; user?: unknown } = {
    headers: { authorization: 'Bearer valid-token' },
  };
  const reflector = {
    getAllAndOverride: vi.fn(() => isPublic),
  };
  const jwt = {
    verifyAsync: vi.fn().mockResolvedValue({ sub: 'user-id', kind: 'access' }),
  };
  const users = {
    byId: vi.fn().mockResolvedValue({
      id: 'user-id',
      username: 'user',
      createdAt: new Date(),
    }),
  };
  const context = {
    getHandler: () => () => {},
    getClass: () => class {},
    switchToHttp: () => ({ getRequest: () => request }),
  } as unknown as ExecutionContext;
  const guard = new AuthGuard(
    reflector as unknown as Reflector,
    jwt as unknown as JwtService,
    new ConfigService({ [ENV_KEYS.JWT_ACCESS_SECRET]: 'a'.repeat(32) }),
    users as unknown as UsersRepository,
  );
  return { guard, context, request, jwt, users };
}

describe('authorization', () => {
  it('allows public endpoints without parsing credentials', async () => {
    const { guard, context, jwt } = fixture(true);
    expect(await guard.canActivate(context)).toBe(true);
    expect(jwt.verifyAsync).not.toHaveBeenCalled();
  });
  it('returns a safe user DTO for an authenticated user', async () => {
    const { guard, context, request } = fixture();
    expect(await guard.canActivate(context)).toBe(true);
    expect(request.user).toEqual({
      id: 'user-id',
      username: 'user',
    });
  });
  it('rejects refresh tokens used as access credentials', async () => {
    const { guard, context, jwt } = fixture();
    jwt.verifyAsync.mockResolvedValue({ sub: 'user-id', kind: 'refresh' });
    await expect(guard.canActivate(context)).rejects.toThrow('Unauthorized');
  });
});
