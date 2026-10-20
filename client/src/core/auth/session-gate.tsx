import { useEffect } from 'react';

import { useSession } from '@/lib/store';

import { SigningIn } from '../pages/signing-in';
import { ensureSession } from './auth';

const selectAuthenticated = ({
  tokenStage,
}: ReturnType<typeof useSession.getState>) => tokenStage === 'application';

export const SessionGate = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useSession(selectAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      return;
    }

    void ensureSession().catch(() => undefined);
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <SigningIn />;
  }

  return <>{children}</>;
};
