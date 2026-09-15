import axios from 'axios';

import { login } from '@/api/generated/api';
import { refreshSession } from '@/api/http';
import { adfsService } from '@/features/auth/adfs';
import { queryClient } from '@/lib/query';
import { useSession } from '@/lib/store';

let signingIn: Promise<void> | null = null;

const authenticate = async () => {
  try {
    await refreshSession();
    return;
  } catch (error) {
    // Only an absent or expired session should trigger a new ADFS login.
    if (!axios.isAxiosError(error) || error.response?.status !== 401) {
      throw error;
    }
  }

  const adfsToken = await adfsService.getToken();
  const data = await login({ adfsToken });
  await queryClient.cancelQueries();
  queryClient.clear();
  useSession.getState().setToken(data.accessToken);
};

export const ensureSession = (): Promise<void> => {
  if (useSession.getState().accessToken) {
    return Promise.resolve();
  }

  signingIn ??= authenticate()
    .catch((error: unknown) => {
      useSession.getState().setToken(null);
      throw error;
    })
    .finally(() => {
      signingIn = null;
    });
  return signingIn;
};
