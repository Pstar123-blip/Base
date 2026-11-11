import { Box } from '@mui/material';
import { type CSSObject, styled, type Theme } from '@mui/material/styles';

// Grows to fill the app layout's page area, so content such as step actions
// can sit at the bottom.
const pageLayoutRootStyles = ({ theme }: { theme: Theme }): CSSObject => ({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
});

export const PageLayoutRoot = styled(Box)(pageLayoutRootStyles);

const pageLayoutTitleStyles = ({ theme }: { theme: Theme }): CSSObject => ({
  ...theme.typography.h4,
  margin: 0,
});

export const PageLayoutTitle = styled('h1')(pageLayoutTitleStyles);
