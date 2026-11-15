import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

// Grows to fill the app layout's page area, so content such as step actions
// can sit at the bottom.
export const PageLayoutRoot = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
}));

export const PageLayoutTitle = styled('h1')(({ theme }) => ({
  ...theme.typography.h4,
  margin: 0,
}));
