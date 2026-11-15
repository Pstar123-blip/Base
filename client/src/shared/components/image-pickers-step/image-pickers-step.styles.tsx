import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

import { PICKER_MIN_WIDTH } from './consts';

export const ImagePickersStepRoot = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
}));

export const PickersGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(3),
  // Side by side when there's room, stacked otherwise.
  gridTemplateColumns: `repeat(auto-fit, minmax(min(${theme.spacing(PICKER_MIN_WIDTH)}, 100%), 1fr))`,
  // Pickers have a max width; center them in their column.
  justifyItems: 'center',
}));
