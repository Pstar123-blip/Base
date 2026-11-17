import { Box } from '@mui/material';
import { type CSSObject, styled, type Theme } from '@mui/material/styles';

import { CHOICES_MAX_WIDTH } from './consts';

const selectTypeStepRootStyles = ({ theme }: { theme: Theme }): CSSObject => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
});

export const SelectTypeStepRoot = styled(Box)(selectTypeStepRootStyles);

// Caps the tiles' width and centers them, instead of spanning the whole page.
const choicesContainerStyles = ({ theme }: { theme: Theme }): CSSObject => ({
  width: '100%',
  maxWidth: theme.spacing(CHOICES_MAX_WIDTH),
  marginInline: 'auto',
});

export const ChoicesContainer = styled(Box)(choicesContainerStyles);
