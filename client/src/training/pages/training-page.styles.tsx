import { Box } from '@mui/material';
import { type CSSObject, styled, type Theme } from '@mui/material/styles';

const trainingPageRootStyles = ({ theme }: { theme: Theme }): CSSObject => ({
  // Fills the page height so the step actions sit at the bottom.
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
});

export const TrainingPageRoot = styled(Box)(trainingPageRootStyles);

const trainingPageTitleStyles = ({ theme }: { theme: Theme }): CSSObject => ({
  ...theme.typography.h4,
  margin: 0,
});

export const TrainingPageTitle = styled('h1')(trainingPageTitleStyles);
