import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  post: vi.fn(),
  request: vi.fn(),
  requestInterceptor: vi.fn(),
  responseInterceptor: vi.fn(),
}));
vi.mock('axios', () => ({
  default: {
    create: () => ({
      post: mocks.post,
      request: mocks.request,
      interceptors: {
        request: { use: mocks.requestInterceptor },
        response: { use: mocks.responseInterceptor },
      },
    }),
    isAxiosError: () => false,
  },
}));
import { useSession } from '../lib/store';
import { refreshSession, request } from './http';

describe('API transport', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useSession.getState().setToken(null);
  });
  it('shares a refresh request across concurrent callers', async () => {
    mocks.post.mockResolvedValue({ data: { accessToken: 'fresh' } });
    const [first, second] = await Promise.all([
      refreshSession(),
      refreshSession(),
    ]);
    expect(first).toBe('fresh');
    expect(second).toBe('fresh');
    expect(mocks.post).toHaveBeenCalledTimes(1);
    expect(useSession.getState().accessToken).toBe('fresh');
  });
  it('clears the session on refresh failure', async () => {
    useSession.getState().setToken('expired');
    mocks.post.mockRejectedValue(new Error('unauthorized'));
    await expect(refreshSession()).rejects.toThrow('unauthorized');
    expect(useSession.getState().accessToken).toBeNull();
  });
  it('preserves cancellation and removes the OpenAPI prefix', async () => {
    mocks.request.mockResolvedValue({ data: { status: 'ok' } });
    const controller = new AbortController();
    await request({ url: '/api/health', signal: controller.signal });
    expect(mocks.request).toHaveBeenCalledWith(
      expect.objectContaining({ url: '/health', signal: controller.signal }),
    );
  });
});
