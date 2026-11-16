import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

// One tile per row, each stretching to the container's full width.
export const OptionsList = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  width: '100%',
}));
