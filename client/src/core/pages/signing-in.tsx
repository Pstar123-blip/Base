import { Stack, Typography } from '@mui/material';

import { SignInStatus } from '@/core/auth/components/sign-in-status';
import { LoadingState } from '@/shared/ui/states';

import { AuthContainer } from './signing-in.styles';

export const SigningIn = () => {
  return (
    <AuthContainer maxWidth="sm">
      <Stack spacing={3}>
        <Typography variant="h4">Sign in to your workspace</Typography>
        <Typography>Complete sign-in in the separate window.</Typography>
        <SignInStatus />
        <LoadingState />
      </Stack>
    </AuthContainer>
  );
};
