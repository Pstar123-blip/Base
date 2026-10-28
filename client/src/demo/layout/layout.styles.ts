import { Container, Typography } from '@mui/material';
import { styled, type Theme } from '@mui/material/styles';

export const PageTitle = styled(Typography)({ flexGrow: 1 });

const pageContentStyles = ({ theme }: { theme: Theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
});
export const PageContent = styled(Container)(pageContentStyles);

export const LayoutBody = styled('div')({ display: 'flex', flexGrow: 1 });
export const LayoutMain = styled('main')({ flexGrow: 1, minWidth: 0 });
export const LayoutRoot = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
});
