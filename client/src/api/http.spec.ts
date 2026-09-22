import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  request: vi.fn(),
  responseError: undefined as undefined | ((error: unknown) => never),
}));
vi.mock('axios', () => ({
  default: {
    create: () => ({
      request: mocks.request,
      interceptors: {
        request: { use: vi.fn() },
        response: {
          use: (_pass: unknown, onError: (error: unknown) => never) => {
            mocks.responseError = onError;
          },
        },
      },
    }),
    isAxiosError: (error: { isAxiosError?: boolean }) =>
      error.isAxiosError === true,
  },
  HttpStatusCode: { Unauthorized: 401 },
}));
import { useSession } from '../lib/store';
import { logout, request } from './http';

describe('API transport', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useSession.getState().setToken(null);
  });
  it('clears the token and propagates unauthorized responses without retrying', () => {
    useSession.getState().setToken('expired');
    const error = { isAxiosError: true, response: { status: 401 } };
    expect(() => mocks.responseError!(error)).toThrow();
    expect(useSession.getState().accessToken).toBeNull();
    expect(mocks.request).not.toHaveBeenCalled();
  });
  it('preserves the token on server errors', () => {
    useSession.getState().setToken('valid');
    const error = { isAxiosError: true, response: { status: 500 } };
    expect(() => mocks.responseError!(error)).toThrow();
    expect(useSession.getState().accessToken).toBe('valid');
  });
  it('signs out locally without a network request', async () => {
    useSession.getState().setToken('valid');
    await logout();
    expect(useSession.getState().accessToken).toBeNull();
    expect(mocks.request).not.toHaveBeenCalled();
  });
  it('preserves cancellation and removes the OpenAPI prefix', async () => {
    mocks.request.mockResolvedValue({ data: { status: 'ok' } });
    const controller = new AbortController();
    await request({ url: '/api/auth/me', signal: controller.signal });
    expect(mocks.request).toHaveBeenCalledWith(
      expect.objectContaining({ url: '/auth/me', signal: controller.signal }),
    );
  });
});
