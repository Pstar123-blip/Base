import { Container } from '@mui/material';
import { styled, type Theme } from '@mui/material/styles';

const authContainerStyles = ({ theme }: { theme: Theme }) => ({
  paddingTop: theme.spacing(10),
  paddingBottom: theme.spacing(10),
});
export const AuthContainer = styled(Container)(authContainerStyles);
