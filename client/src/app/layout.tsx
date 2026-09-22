import { AppBar, Button, Toolbar } from '@mui/material';
import { Outlet, useNavigate } from '@tanstack/react-router';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';

import { logout } from '@/api/http';
import { queryClient } from '@/lib/query';
import { useSession } from '@/lib/store';
import { ConfirmationDialog } from '@/shared/ui/confirmation-dialog';

import { PageContent, PageTitle } from './layout.styled';

const selectAccessToken = (state: ReturnType<typeof useSession.getState>) =>
  state.accessToken;

export const Layout = () => {
  const [confirm, setConfirm] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const token = useSession(selectAccessToken);
  const navigate = useNavigate();

  const redirectWithoutSession = () => {
    if (!token) {
      if (!signingOut) void navigate({ to: '/auth-error', replace: true });
    }
  };

  useEffect(redirectWithoutSession, [token, navigate, signingOut]);

  const openConfirmation = () => setConfirm(true);
  const closeConfirmation = () => setConfirm(false);
  const finishSignOut = () => setSigningOut(false);

  const completeSignOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await navigate({ to: '/signed-out', replace: true });
  };

  const reportSignOutError = () =>
    enqueueSnackbar('Sign out failed. Please try again.', { variant: 'error' });

  const confirmSignOut = () => {
    setSigningOut(true);
    void logout()
      .then(completeSignOut)
      .catch(reportSignOutError)
      .finally(finishSignOut);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <PageTitle variant="h6">Project</PageTitle>
          <Button color="inherit" onClick={openConfirmation}>
            Sign out
          </Button>
        </Toolbar>
      </AppBar>
      <PageContent>
        <Outlet />
      </PageContent>
      <ConfirmationDialog
        open={confirm}
        busy={signingOut}
        title="Sign out?"
        description="You can sign back in at any time."
        onCancel={closeConfirmation}
        onConfirm={confirmSignOut}
      />
    </>
  );
};
