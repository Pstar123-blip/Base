import { Box, Typography } from '@mui/material';
import { styled, type Theme } from '@mui/material/styles';

const loadingContainerStyles = ({ theme }: { theme: Theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center' as const,
});
export const LoadingContainer = styled(Box)(loadingContainerStyles);

const emptyMessageStyles = ({ theme }: { theme: Theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center' as const,
});
export const EmptyMessage = styled(Typography)(emptyMessageStyles);
