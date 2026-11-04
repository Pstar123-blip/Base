import { Box, Container, Typography } from '@mui/material';
import { styled, type Theme } from '@mui/material/styles';
import type { ElementType } from 'react';

export const PageTitle = styled(Typography)({ flexGrow: 1 });

const pageContentStyles = ({ theme }: { theme: Theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
});
export const PageContent = styled(Container)(pageContentStyles);

export const LayoutBody = styled(Box)({ display: 'flex', flexGrow: 1 });
export const LayoutMain = styled(Box)<{ component?: ElementType }>({
  flexGrow: 1,
  minWidth: 0,
});
export const LayoutRoot = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
});
