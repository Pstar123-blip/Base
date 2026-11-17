import type { SessionType } from '@/api/generated/model';
import {
  SESSION_TYPE_COLORS,
  SESSION_TYPE_LABELS,
} from '@/shared/session-type-constants';

import { TypeChip } from './type-tag.styles';

export const TypeTag = ({ type }: { type: SessionType }) => (
  <TypeChip
    size="small"
    label={SESSION_TYPE_LABELS[type]}
    accent={SESSION_TYPE_COLORS[type]}
  />
);
