import { Button, Container, Stack, Typography } from '@mui/material';
import { Link } from '@tanstack/react-router';

export function SignedOut() {
  return (
    <Container maxWidth="sm" sx={{ py: 10 }}>
      <Stack spacing={3}>
        <Typography variant="h4">You’re signed out</Typography>
        <Button component={Link} to="/" preload={false} variant="contained">
          Return home
        </Button>
      </Stack>
    </Container>
  );
}
