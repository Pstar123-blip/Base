import { redirect } from '@tanstack/react-router';

import { ensureSession } from './auth';

export const requireSession = async ({
  location,
  abortController,
}: {
  location: { pathname: string };
  abortController: AbortController;
}) => {
  if (location.pathname.replace(/\/+$/, '') === '/unauthorized') return;

  try {
    await ensureSession(abortController.signal);
  } catch {
    if (abortController.signal.aborted) return;
    throw redirect({ to: '/unauthorized', replace: true });
  }
};
