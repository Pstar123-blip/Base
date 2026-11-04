import { Alert, Button, Stack, Typography } from '@mui/material';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';

import { selectSignedOut, useSession } from '@/lib/store';

import { ensureSession } from '../auth/auth';
import { SigningIn } from './signing-in';
import { AuthContainer } from './unauthorized-route.styles';

export const UnauthorizedRoute = () => {
  const navigate = useNavigate();
  const [signingIn, setSigningIn] = useState(false);
  const signedOut = useSession(selectSignedOut);

  const relogin = async () => {
    setSigningIn(true);

    try {
      // A stale token would make ensureSession a no-op; force a fresh sign-in.
      if (!signedOut) {
        useSession.getState().setToken(null);
      }

      // Keep signedOut set until sign-in succeeds so the guards stay quiet.
      await ensureSession();
      useSession.getState().clearSignedOut();
      await navigate({ to: '/', replace: true });
    } catch {
      // Cancelled or failed sign-in: stay on this page in its current state.
    } finally {
      setSigningIn(false);
    }
  };

  if (signingIn) {
    return <SigningIn />;
  }

  return (
    <AuthContainer maxWidth="sm">
      <Stack spacing={3}>
        <Typography variant="h4">
          {signedOut ? 'Signed out' : 'Unauthorized'}
        </Typography>
        {signedOut ? (
          <Alert severity="info">You have been signed out.</Alert>
        ) : (
          <Alert severity="error">
            We couldn’t sign you in to your workspace. Try again, or contact
            your administrator if the problem continues.
          </Alert>
        )}
        <Button onClick={relogin} variant="contained">
          {signedOut ? 'Sign in' : 'Relogin'}
        </Button>
      </Stack>
    </AuthContainer>
  );
};
