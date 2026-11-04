import { useEffect } from 'react';

import { useSession } from '@/lib/store';

import { SigningIn } from '../pages/signing-in';
import { ensureSession } from './auth';

const selectAuthenticated = ({
  tokenStage,
}: ReturnType<typeof useSession.getState>) => tokenStage === 'application';

const selectSignedOut = ({
  signedOut,
}: ReturnType<typeof useSession.getState>) => signedOut;

export const SessionGate = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useSession(selectAuthenticated);
  const signedOut = useSession(selectSignedOut);

  useEffect(() => {
    if (isAuthenticated || signedOut) {
      return;
    }

    void ensureSession().catch(() => undefined);
  }, [isAuthenticated, signedOut]);

  if (!isAuthenticated) {
    return <SigningIn />;
  }

  return <>{children}</>;
};
