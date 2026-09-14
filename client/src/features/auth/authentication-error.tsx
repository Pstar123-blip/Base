import { Alert, Button, Container, Stack, Typography } from '@mui/material';
import { Link } from '@tanstack/react-router';

export function AuthenticationError() {
  return (
    <Container maxWidth="sm" sx={{ py: 10 }}>
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
    </Container>
  );
}
