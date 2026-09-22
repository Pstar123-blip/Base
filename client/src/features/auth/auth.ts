import { login } from '@/api/generated/api';
import { adfsService } from '@/features/auth/adfs';
import { queryClient } from '@/lib/query';
import { useSession } from '@/lib/store';

let signingIn: Promise<void> | null = null;

const authenticate = async () => {
  const adfsToken = await adfsService.getToken();
  const data = await login({ adfsToken });
  await queryClient.cancelQueries();
  queryClient.clear();
  useSession.getState().setToken(data.accessToken);
};

const handleAuthenticationError = (error: unknown) => {
  useSession.getState().setToken(null);
  throw error;
};

const finishAuthentication = () => {
  signingIn = null;
};

export const ensureSession = (): Promise<void> => {
  if (useSession.getState().accessToken) {
    return Promise.resolve();
  }

  signingIn ??= authenticate()
    .catch(handleAuthenticationError)
    .finally(finishAuthentication);
  return signingIn;
};
