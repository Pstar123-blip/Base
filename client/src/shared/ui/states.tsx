import { Alert, Button, CircularProgress, Typography } from '@mui/material';

import { EmptyMessage, LoadingContainer } from './states.styled';

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

export const EmptyState = ({
  message = 'No results found',
}: {
  message?: string;
}) => {
  return <EmptyMessage color="text.secondary">{message}</EmptyMessage>;
};
