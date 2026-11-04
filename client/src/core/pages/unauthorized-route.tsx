import { Alert, Button, Stack, Typography } from '@mui/material';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';

import { useSession } from '@/lib/store';

import { SigningIn } from './signing-in';
import { AuthContainer } from './unauthorized-route.styles';

const selectSignedOut = (state: ReturnType<typeof useSession.getState>) =>
  state.signedOut;

export const UnauthorizedRoute = () => {
  const navigate = useNavigate();
  const [signingIn, setSigningIn] = useState(false);

  const relogin = async () => {
    setSigningIn(true);
    useSession.getState().clearSignedOut();
    useSession.getState().setToken(null);

    try {
      await navigate({ to: '/', replace: true });
    } finally {
      setSigningIn(false);
    }
  };

  const signedOut = useSession(selectSignedOut);

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
