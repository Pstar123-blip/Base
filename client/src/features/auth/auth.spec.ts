import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  login: vi.fn(),
  getToken: vi.fn(),
  cancel: vi.fn(),
  clear: vi.fn(),
}));
vi.mock('@/api/generated/api', () => ({ login: mocks.login }));
vi.mock('@/features/auth/adfs', () => ({
  adfsService: { getToken: mocks.getToken },
}));
vi.mock('@/lib/query', () => ({
  queryClient: { cancelQueries: mocks.cancel, clear: mocks.clear },
}));

import { ensureSession } from '@/features/auth/auth';
import { useSession } from '@/lib/store';

beforeEach(() => {
  vi.resetAllMocks();
  useSession.getState().setToken(null);
  mocks.getToken.mockResolvedValue('adfs-token');
  mocks.login.mockResolvedValue({
    accessToken: 'api-token',
    user: {},
  });
});

describe('home authentication', () => {
  it('exchanges the ADFS token once for concurrent home loads', async () => {
    await Promise.all([ensureSession(), ensureSession()]);
    expect(mocks.getToken).toHaveBeenCalledOnce();
    expect(mocks.login).toHaveBeenCalledExactlyOnceWith({
      adfsToken: 'adfs-token',
    });
    expect(useSession.getState().accessToken).toBe('api-token');
  });

  it('uses an existing session without acquiring an ADFS token', async () => {
    useSession.getState().setToken('existing');
    await ensureSession();
    expect(mocks.getToken).not.toHaveBeenCalled();
  });

  it('propagates provider failures and allows retry', async () => {
    mocks.getToken.mockRejectedValueOnce(new Error('ADFS unavailable'));
    await expect(ensureSession()).rejects.toThrow('ADFS unavailable');
    expect(mocks.login).not.toHaveBeenCalled();
    expect(useSession.getState().accessToken).toBeNull();
    await ensureSession();
    expect(useSession.getState().accessToken).toBe('api-token');
  });

  it('propagates API login failures without a session', async () => {
    mocks.login.mockRejectedValue(new Error('Access denied'));
    await expect(ensureSession()).rejects.toThrow('Access denied');
    expect(useSession.getState().accessToken).toBeNull();
  });
});
