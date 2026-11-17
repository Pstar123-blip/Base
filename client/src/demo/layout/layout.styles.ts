import { Box, Container, IconButton, Typography } from '@mui/material';
import { styled, type Theme } from '@mui/material/styles';

export const PageTitle = styled(Typography)({ flexGrow: 1 });

// A full-height flex column so pages can stretch to the bottom of the view.
const pageContentStyles = ({ theme }: { theme: Theme }) => ({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column' as const,
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
});
export const PageContent = styled(Container)(pageContentStyles);

export const LayoutBody = styled(Box)({
  display: 'flex',
  flexGrow: 1,
  minHeight: 0,
  overflow: 'hidden',
});
export const LayoutMain = styled('main')({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  minWidth: 0,
  overflowY: 'auto',
});
export const LayoutRoot = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  height: '100dvh',
});

const menuButtonStyles = ({ theme }: { theme: Theme }) => ({
  marginRight: theme.spacing(1),
  [theme.breakpoints.up('md')]: { display: 'none' },
});
export const MenuButton = styled(IconButton)(menuButtonStyles);
