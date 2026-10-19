import { Alert, Button, CircularProgress, Typography } from '@mui/material';

import { LoadingContainer } from './states.styles';

export const LoadingState = () => {
  return (
    <LoadingContainer role="status">
      <CircularProgress aria-label="Loading" />
      <Typography>Loading…</Typography>
    </LoadingContainer>
  );
};

export const ErrorState = ({
  message = 'Something went wrong',
  retry,
}: {
  message?: string;
  retry?: () => void;
}) => {
  return (
    <Alert
      severity="error"
      action={retry ? <Button onClick={retry}>Retry</Button> : undefined}
    >
      {message}
    </Alert>
  );
};
