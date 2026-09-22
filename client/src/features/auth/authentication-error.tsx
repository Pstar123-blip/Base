import { Alert, Button, Stack, Typography } from '@mui/material';
import { Link } from '@tanstack/react-router';

import { AuthContainer } from './auth.styled';

export const AuthenticationError = () => {
  return (
    <AuthContainer maxWidth="sm">
      <Stack spacing={3}>
        <Typography variant="h4">Unable to sign in</Typography>
        <Alert severity="error">
          We couldn’t sign you in to your workspace. Try again, or contact your
          administrator if the problem continues.
        </Alert>
        <Button component={Link} to="/" preload={false} variant="contained">
          Try again
        </Button>
      </Stack>
    </AuthContainer>
  );
};
