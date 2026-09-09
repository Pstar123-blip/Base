import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Typography,
} from '@mui/material';
export function LoadingState() {
  return (
    <Box role="status" sx={{ p: 4, textAlign: 'center' }}>
      <CircularProgress aria-label="Loading" />
      <Typography>Loading…</Typography>
    </Box>
  );
}
export function ErrorState({
  message = 'Something went wrong',
  retry,
}: {
  message?: string;
  retry?: () => void;
}) {
  return (
    <Alert
      severity="error"
      action={retry ? <Button onClick={retry}>Retry</Button> : undefined}
    >
      {message}
    </Alert>
  );
}
export function EmptyState({
  message = 'No results found',
}: {
  message?: string;
}) {
  return (
    <Typography sx={{ p: 4, textAlign: 'center' }} color="text.secondary">
      {message}
    </Typography>
  );
}
