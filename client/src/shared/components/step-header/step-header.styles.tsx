import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import { STEP_TITLE_LETTER_SPACING } from './consts';

export const StepHeaderRoot = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
});

// An h2, under the page's h1, at h5 size.
export const StepTitle = styled('h2')(({ theme }) => {
  const { palette } = theme.vars ?? theme;

  return {
    ...theme.typography.h5,
    margin: 0,
    width: 'fit-content',
    fontWeight: theme.typography.fontWeightBold,
    letterSpacing: STEP_TITLE_LETTER_SPACING,
    color: 'transparent',
    backgroundImage: `linear-gradient(135deg, ${palette.primary.main}, ${palette.secondary.main})`,
    backgroundClip: 'text',
  };
});

export const StepSubtitle = styled(Typography)(({ theme }) => ({
  color: (theme.vars ?? theme).palette.text.secondary,
}));
