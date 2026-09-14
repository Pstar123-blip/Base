import { Alert, Snackbar } from '@mui/material';
import { Outlet } from '@tanstack/react-router';

import { useUi } from '@/lib/store';

const ERROR_AUTO_HIDE_DURATION_MS = 6000;

export function Root() {
  const { error, notify } = useUi();
  return (
    <>
      <Outlet />
      <Snackbar
        open={!!error}
        autoHideDuration={ERROR_AUTO_HIDE_DURATION_MS}
        onClose={() => notify(null)}
      >
        <Alert severity="error" onClose={() => notify(null)}>
          {error}
        </Alert>
      </Snackbar>
    </>
  );
}
