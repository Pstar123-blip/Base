import { Box } from '@mui/material';
import { type CSSObject, styled, type Theme } from '@mui/material/styles';

const evaluationPageRootStyles = ({ theme }: { theme: Theme }): CSSObject => ({
  // Fills the page height so the step actions sit at the bottom.
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
});

export const EvaluationPageRoot = styled(Box)(evaluationPageRootStyles);

const evaluationPageTitleStyles = ({ theme }: { theme: Theme }): CSSObject => ({
  ...theme.typography.h4,
  margin: 0,
});

export const EvaluationPageTitle = styled('h1')(evaluationPageTitleStyles);
