import { Typography } from '@mui/material';

import { formatPercent } from '../utils/format';
import { ProgressBar, ProgressCellRoot } from './progress-cell.styles';

export const ProgressCell = ({ value }: { value: number | null }) => {
  if (value === null) {
    return null;
  }

  return (
    <ProgressCellRoot>
      <ProgressBar variant="determinate" value={value} />
      <Typography variant="body2">{formatPercent(value)}</Typography>
    </ProgressCellRoot>
  );
};
