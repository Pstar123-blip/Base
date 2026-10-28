import { Container, Typography } from '@mui/material';
import { styled, type Theme } from '@mui/material/styles';

export const PageTitle = styled(Typography)({ flexGrow: 1 });

const pageContentStyles = ({ theme }: { theme: Theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
});
export const PageContent = styled(Container)(pageContentStyles);
