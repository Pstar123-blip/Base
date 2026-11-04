import { redirect } from '@tanstack/react-router';

import { useSession } from '@/lib/store';

import { ensureSession } from './auth';

export const requireSession = async ({
  location,
  abortController,
}: {
  location: { pathname: string };
  abortController: AbortController;
}) => {
  if (location.pathname.replace(/\/+$/, '') === '/unauthorized') {
    return;
  }

  if (useSession.getState().signedOut) {
    throw redirect({ to: '/unauthorized', replace: true });
  }

  try {
    await ensureSession(abortController.signal);
  } catch {
    if (abortController.signal.aborted) {
      return;
    }

    throw redirect({ to: '/unauthorized', replace: true });
  }
};
