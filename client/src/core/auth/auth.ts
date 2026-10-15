import { create } from 'zustand';

import { queryClient } from '@/lib/query';
import { useSession } from '@/lib/store';
import { AUTH_MAX_ATTEMPTS } from '@/shared/constants';

type PopupRequest = {
  id: string;
  succeed: (token: string) => void;
  fail: (error: Error) => void;
};

export const useAuthPopup = create<{ request: PopupRequest | null }>(() => ({
  request: null,
}));

const requestPopupToken = (signal?: AbortSignal): Promise<string> =>
  new Promise((resolve, reject) => {
    signal?.throwIfAborted();
    const id = crypto.randomUUID();

    const cleanup = () => {
      signal?.removeEventListener('abort', cancel);

      if (useAuthPopup.getState().request?.id === id) {
        useAuthPopup.setState({ request: null });
      }
    };

    const cancel = () => {
      cleanup();
      reject(new DOMException('Sign-in cancelled', 'AbortError'));
    };

    signal?.addEventListener('abort', cancel, { once: true });
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

let signingIn: {
  promise: Promise<void>;
  signal?: AbortSignal;
} | null = null;

const authenticate = async (signal?: AbortSignal) => {
  signal?.throwIfAborted();

  const session = useSession.getState();

  if (session.accessToken && session.tokenStage !== 'provider') {
    return;
  }

  // A reload during exchange must restart sign-in, not accept the provider token.
  if (session.tokenStage === 'provider') session.setToken(null);

  await queryClient.cancelQueries();
  signal?.throwIfAborted();
  queryClient.clear();

  for (let attempt = 0; attempt < AUTH_MAX_ATTEMPTS; attempt += 1) {
    try {
      await requestPopupToken(signal);
      signal?.throwIfAborted();
      return;
    } catch {
      signal?.throwIfAborted();
    }
  }

  throw new Error('Unable to authenticate');
};

export const ensureSession = (signal?: AbortSignal): Promise<void> => {
  if (!signingIn || signingIn.signal?.aborted) {
    const promise = authenticate(signal).finally(() => {
      if (signingIn?.promise === promise) signingIn = null;
    });
    signingIn = { promise, signal };
  }

  return signingIn.promise;
};
