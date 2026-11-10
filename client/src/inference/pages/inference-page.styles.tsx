import { Box } from '@mui/material';
import { type CSSObject, styled, type Theme } from '@mui/material/styles';

const inferencePageRootStyles = ({ theme }: { theme: Theme }): CSSObject => ({
  // Fills the page height so the step actions sit at the bottom.
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
});

export const InferencePageRoot = styled(Box)(inferencePageRootStyles);

const inferencePageTitleStyles = ({ theme }: { theme: Theme }): CSSObject => ({
  ...theme.typography.h4,
  margin: 0,
});

export const InferencePageTitle = styled('h1')(inferencePageTitleStyles);
