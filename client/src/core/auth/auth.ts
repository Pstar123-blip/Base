import { create } from 'zustand';

import { queryClient } from '@/lib/query';
import { useSession } from '@/lib/store';
import { AUTH_MAX_ATTEMPTS } from '@/shared/constants';

export type PopupRequest = {
  id: string;
  succeed: (token: string) => void;
  fail: (error: Error) => void;
};

export const useAuthPopup = create<{ request: PopupRequest | null }>(() => ({
  request: null,
}));

const requestPopupToken = (): Promise<string> =>
  new Promise((resolve, reject) => {
    const id = crypto.randomUUID();

    const cleanup = () => {
      if (useAuthPopup.getState().request?.id === id) {
        useAuthPopup.setState({ request: null });
      }
    };

    useAuthPopup.setState({
      request: {
        id,
        succeed: (token) => {
          cleanup();
          resolve(token);
        },
        fail: (error) => {
          cleanup();
          reject(error);
        },
      },
    });
  });

const authenticate = async () => {
  const session = useSession.getState();

  if (session.accessToken && session.tokenStage !== 'provider') {
    return;
  }

  // A reload during exchange must restart sign-in, not accept the provider token.
  if (session.tokenStage === 'provider') session.setToken(null);

  await queryClient.cancelQueries();
  queryClient.clear();

  for (let attempt = 0; attempt < AUTH_MAX_ATTEMPTS; attempt += 1) {
    try {
      await requestPopupToken();
      return;
    } catch {
      // Ignore and retry
    }
  }

  throw new Error('Unable to authenticate');
};

let signingIn: Promise<void> | null = null;

export const ensureSession = (signal?: AbortSignal): Promise<void> => {
  signal?.throwIfAborted();

  if (!signingIn) {
    signingIn = authenticate().finally(() => {
      signingIn = null;
    });
  }

  return signingIn;
};
