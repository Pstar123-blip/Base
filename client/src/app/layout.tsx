import { AppBar, Button, Container, Toolbar, Typography } from '@mui/material';
import { Outlet, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

import { logout } from '@/api/http';
import { queryClient } from '@/lib/query';
import { useSession, useUi } from '@/lib/store';
import { ConfirmationDialog } from '@/shared/ui/confirmation-dialog';

export function Layout() {
  const [confirm, setConfirm] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const token = useSession((state) => state.accessToken);
  const navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      if (!signingOut) void navigate({ to: '/auth-error', replace: true });
    }
  }, [token, navigate, signingOut]);
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Project starter
          </Typography>
          <Button color="inherit" onClick={() => setConfirm(true)}>
            Sign out
          </Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ py: 4 }}>
        <Outlet />
      </Container>
      <ConfirmationDialog
        open={confirm}
        busy={signingOut}
        title="Sign out?"
        description="You can sign back in at any time."
        onCancel={() => setConfirm(false)}
        onConfirm={() => {
          setSigningOut(true);
          void logout()
            .then(async () => {
              await queryClient.cancelQueries();
              queryClient.clear();
              await navigate({ to: '/signed-out', replace: true });
            })
            .catch(() =>
              useUi.getState().notify('Sign out failed. Please try again.'),
            )
            .finally(() => setSigningOut(false));
        }}
      />
    </>
  );
}
