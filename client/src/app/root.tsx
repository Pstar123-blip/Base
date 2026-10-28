import { Button } from '@mui/material';
import { Outlet } from '@tanstack/react-router';
import { closeSnackbar, type SnackbarKey, SnackbarProvider } from 'notistack';

import { ERROR_AUTO_HIDE_DURATION_MS, MAX_SNACKBARS } from '@/shared/constants';

const renderDismissAction = (key: SnackbarKey) => {
  const dismiss = () => closeSnackbar(key);
  return (
    <Button color="inherit" onClick={dismiss}>
      Dismiss
    </Button>
  );
};

export const Root = () => (
  <SnackbarProvider
    maxSnack={MAX_SNACKBARS}
    autoHideDuration={ERROR_AUTO_HIDE_DURATION_MS}
    preventDuplicate
    action={renderDismissAction}
  >
    <Outlet />
  </SnackbarProvider>
);
