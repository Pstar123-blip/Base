import { createToken } from '@/api/generated/api';
import { useSession } from '@/lib/store';

export const authService = {
  createToken: async (providerToken: string, signal?: AbortSignal) => {
    signal?.throwIfAborted();
    useSession.getState().setProviderToken(providerToken);

    try {
      const { accessToken } = await createToken({ signal });
      signal?.throwIfAborted();
      useSession.getState().setToken(accessToken);
      return accessToken;
    } catch (error) {
      const session = useSession.getState();

      if (
        session.tokenStage === 'provider' &&
        session.accessToken === providerToken
      ) {
        session.setToken(null);
      }

      throw error;
    }
  },
};
