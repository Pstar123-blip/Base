import { Alert } from '@mui/material';

import { formatTime } from '../utils/format';

// Background refreshes fail silently, so say so when the table is out of date.
export const StaleDataNotice = ({ updatedAt }: { updatedAt: number }) => (
  <Alert severity="warning">
    Couldn&apos;t refresh, showing data from {formatTime(new Date(updatedAt))}
  </Alert>
);
