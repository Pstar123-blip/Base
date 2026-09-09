import { describe, expect, it } from 'vitest';

import { useSession } from './store';
describe('session', () => {
  it('clears the in-memory token on sign-out', () => {
    useSession.getState().setToken('token');
    expect(useSession.getState().accessToken).toBe('token');
    useSession.getState().setToken(null);
    expect(useSession.getState().accessToken).toBeNull();
  });
});
