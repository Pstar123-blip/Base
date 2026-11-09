import type { SessionStatus } from '@/api/generated/model';

import { SESSION_STATUS_COLORS, SESSION_STATUS_LABELS } from '../consts';
import { StatusChip } from './status-tag.styles';

export const StatusTag = ({ status }: { status: SessionStatus }) => (
  <StatusChip
    size="small"
    variant="outlined"
    label={SESSION_STATUS_LABELS[status]}
    color={SESSION_STATUS_COLORS[status]}
  />
);
