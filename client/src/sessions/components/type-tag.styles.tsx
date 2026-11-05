import { Chip } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';

import {
  TYPE_TAG_BORDER_ALPHA,
  TYPE_TAG_FILL_ALPHA,
  TYPE_TAG_FONT_WEIGHT,
} from '../consts';

export const TypeChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== 'accent',
})<{ accent: string }>(({ accent }) => ({
  color: accent,
  backgroundColor: alpha(accent, TYPE_TAG_FILL_ALPHA),
  border: `1px solid ${alpha(accent, TYPE_TAG_BORDER_ALPHA)}`,
  fontWeight: TYPE_TAG_FONT_WEIGHT,
}));
