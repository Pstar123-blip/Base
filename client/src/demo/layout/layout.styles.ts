import { Box, Container, IconButton, Typography } from '@mui/material';
import { styled, type Theme } from '@mui/material/styles';
import type { ElementType } from 'react';

export const PageTitle = styled(Typography)({ flexGrow: 1 });

const pageContentStyles = ({ theme }: { theme: Theme }) => ({
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
export const LayoutMain = styled(Box)<{ component?: ElementType }>({
  flexGrow: 1,
  minWidth: 0,
  overflowY: 'auto',
});
export const LayoutRoot = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
});

const menuButtonStyles = ({ theme }: { theme: Theme }) => ({
  marginRight: theme.spacing(1),
  [theme.breakpoints.up('md')]: { display: 'none' },
});
export const MenuButton = styled(IconButton)(menuButtonStyles);
