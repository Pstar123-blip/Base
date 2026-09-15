import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Typography,
} from '@mui/material';

export const LoadingState = () => {
  return (
    <Box role="status" sx={{ p: 4, textAlign: 'center' }}>
      <CircularProgress aria-label="Loading" />
      <Typography>Loading…</Typography>
    </Box>
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
  return (
    <Typography sx={{ p: 4, textAlign: 'center' }} color="text.secondary">
      {message}
    </Typography>
  );
};
