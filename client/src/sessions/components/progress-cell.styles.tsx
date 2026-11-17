import { LinearProgress } from '@mui/material';
import { styled } from '@mui/material/styles';

export const ProgressCellRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  minWidth: theme.spacing(14),
}));

export const ProgressBar = styled(LinearProgress)({ flexGrow: 1 });
