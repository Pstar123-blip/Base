import { Chip } from '@mui/material';

import type { SessionStatus } from '@/api/generated/model';

import { SESSION_STATUS_COLORS, SESSION_STATUS_LABELS } from '../consts';

export const StatusTag = ({ status }: { status: SessionStatus }) => (
  <Chip
    size="small"
    variant="outlined"
    label={SESSION_STATUS_LABELS[status]}
    color={SESSION_STATUS_COLORS[status]}
  />
);
