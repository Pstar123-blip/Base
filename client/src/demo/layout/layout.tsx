import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Button, Toolbar } from '@mui/material';
import { Outlet, useNavigate, useRouter } from '@tanstack/react-router';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';

import { queryClient } from '@/lib/query';
import { selectAccessToken, selectSignedOut, useSession } from '@/lib/store';
import { ColorModeToggle } from '@/shared/ui/color-mode-toggle';
import { ConfirmationDialog } from '@/shared/ui/confirmation-dialog';

import {
  LayoutBody,
  LayoutMain,
  LayoutRoot,
  MenuButton,
  PageContent,
  PageTitle,
} from './layout.styles';
import { Sidebar } from './sidebar';

export const Layout = () => {
  const [confirm, setConfirm] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const token = useSession(selectAccessToken);
  const signedOut = useSession(selectSignedOut);
  const navigate = useNavigate();
  const router = useRouter();

  const redirectWithoutSession = () => {
    // Deliberate sign-out navigates itself; only an expired session needs this.
    if (!token && !signedOut) {
      void router.invalidate();
    }
  };

  useEffect(redirectWithoutSession, [token, signedOut, router]);

  const openConfirmation = () => setConfirm(true);
  const closeConfirmation = () => setConfirm(false);
  const openSidebar = () => setSidebarOpen(true);
  const closeSidebar = () => setSidebarOpen(false);
  const finishSignOut = () => setSigningOut(false);

  const completeSignOut = async () => {
    // Stop in-flight requests, then sign out (drops the token and flags the
    // sign-out so the destination shows "Signed out", not an error). If the
    // cancel throws we stay signed in and report the failure.
    await queryClient.cancelQueries();
    useSession.getState().signOut();
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
    <LayoutRoot>
      <AppBar position="static">
        <Toolbar>
          <MenuButton
            color="inherit"
            aria-label="Open menu"
            onClick={openSidebar}
          >
            <MenuIcon />
          </MenuButton>
          <PageTitle variant="h6">Project</PageTitle>
          <ColorModeToggle />
          <Button color="inherit" onClick={openConfirmation}>
            Sign out
          </Button>
        </Toolbar>
      </AppBar>
      <LayoutBody>
        <Sidebar open={sidebarOpen} onClose={closeSidebar} />
        <LayoutMain>
          <PageContent maxWidth={false}>
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
    </LayoutRoot>
  );
};
