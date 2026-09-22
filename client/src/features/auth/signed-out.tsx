import { Button, Stack, Typography } from '@mui/material';
import { Link } from '@tanstack/react-router';

import { AuthContainer } from './auth.styled';

export const SignedOut = () => {
  return (
    <AuthContainer maxWidth="sm">
      <Stack spacing={3}>
        <Typography variant="h4">You’re signed out</Typography>
        <Button component={Link} to="/" preload={false} variant="contained">
          Return home
        </Button>
      </Stack>
    </AuthContainer>
  );
};
