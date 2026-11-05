import type { SessionType } from '@/api/generated/model';

import {
  SESSION_TYPE_COLORS,
  SESSION_TYPE_LABELS,
  UNKNOWN_TYPE_COLOR,
  UNKNOWN_TYPE_LABEL,
} from '../consts';
import { TypeChip } from './type-tag.styles';

export const TypeTag = ({ type }: { type: SessionType }) => (
  <TypeChip
    size="small"
    label={SESSION_TYPE_LABELS[type] ?? UNKNOWN_TYPE_LABEL}
    accent={SESSION_TYPE_COLORS[type] ?? UNKNOWN_TYPE_COLOR}
  />
);
