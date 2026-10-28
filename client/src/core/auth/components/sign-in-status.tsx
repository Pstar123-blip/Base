import { Alert, Button, Stack, Typography } from '@mui/material';

import { useLoginPopup } from '../use-login-popup';

export const SignInStatus = () => {
  const { isActive, blocked, busy, openWindow } = useLoginPopup();

  if (!isActive) {
    return null;
  }

  return (
    <Stack spacing={2}>
      {blocked && !busy && (
        <Alert severity="info">
          Allow popups for this site to continue. Sign-in will open
          automatically.
        </Alert>
      )}
      {blocked && !busy && (
        <Button variant="contained" onClick={openWindow}>
          Open sign-in window
        </Button>
      )}
      {busy && <Typography role="status">Completing sign-in...</Typography>}
    </Stack>
  );
};
