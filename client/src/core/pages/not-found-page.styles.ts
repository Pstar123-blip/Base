import { Container } from '@mui/material';
import { styled, type Theme } from '@mui/material/styles';

const notFoundContainerStyles = ({ theme }: { theme: Theme }) => ({
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(8),
});
export const NotFoundContainer = styled(Container)(notFoundContainerStyles);
