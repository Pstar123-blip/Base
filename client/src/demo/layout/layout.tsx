import { AppBar, Button, Toolbar } from '@mui/material';
import { Outlet, useNavigate, useRouter } from '@tanstack/react-router';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';

import { logout } from '@/api/http';
import { ConfirmationDialog } from '@/demo/ui/confirmation-dialog';
import { queryClient } from '@/lib/query';
import { useSession } from '@/lib/store';
import { ColorModeToggle } from '@/shared/ui/color-mode-toggle';

import {
  LayoutBody,
  LayoutMain,
  PageContent,
  PageTitle,
} from './layout.styles';
import { Sidebar } from './sidebar';

const selectAccessToken = (state: ReturnType<typeof useSession.getState>) =>
  state.accessToken;

export const Layout = () => {
  const [confirm, setConfirm] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const token = useSession(selectAccessToken);
  const navigate = useNavigate();
  const router = useRouter();

  const redirectWithoutSession = () => {
    if (!token) {
      if (!signingOut) {
        void router.invalidate();
      }
    }
  };

  useEffect(redirectWithoutSession, [token, router, signingOut]);

  const openConfirmation = () => setConfirm(true);
  const closeConfirmation = () => setConfirm(false);
  const finishSignOut = () => setSigningOut(false);

  const completeSignOut = async () => {
    await logout();
    await queryClient.cancelQueries();
    queryClient.clear();
    await navigate({ to: '/unauthorized', replace: true });
  };

  const reportSignOutError = () =>
    enqueueSnackbar('Sign out failed. Please try again.', { variant: 'error' });

  const confirmSignOut = () => {
    setSigningOut(true);
    void completeSignOut().catch(reportSignOutError).finally(finishSignOut);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <PageTitle variant="h6">Project</PageTitle>
          <ColorModeToggle />
          <Button color="inherit" onClick={openConfirmation}>
            Sign out
          </Button>
        </Toolbar>
      </AppBar>
      <LayoutBody>
        <Sidebar />
        <LayoutMain>
          <PageContent>
            <Outlet />
          </PageContent>
        </LayoutMain>
      </LayoutBody>
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
