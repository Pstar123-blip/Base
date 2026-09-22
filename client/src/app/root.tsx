import { Button } from '@mui/material';
import { Outlet } from '@tanstack/react-router';
import { closeSnackbar, type SnackbarKey, SnackbarProvider } from 'notistack';

const ERROR_AUTO_HIDE_DURATION_MS = 6000;

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
    maxSnack={3}
    autoHideDuration={ERROR_AUTO_HIDE_DURATION_MS}
    preventDuplicate
    action={renderDismissAction}
  >
    <Outlet />
  </SnackbarProvider>
);
