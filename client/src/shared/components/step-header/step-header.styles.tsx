import { Box, Typography } from '@mui/material';
import { type CSSObject, styled, type Theme } from '@mui/material/styles';

import { STEP_TITLE_LETTER_SPACING } from './consts';

const stepHeaderRootStyles: CSSObject = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
};

export const StepHeaderRoot = styled(Box)(stepHeaderRootStyles);

const stepTitleStyles = ({ theme }: { theme: Theme }): CSSObject => {
  const { palette } = theme.vars ?? theme;

  return {
    width: 'fit-content',
    fontWeight: theme.typography.fontWeightBold,
    letterSpacing: STEP_TITLE_LETTER_SPACING,
    color: 'transparent',
    backgroundImage: `linear-gradient(135deg, ${palette.primary.main}, ${palette.secondary.main})`,
    backgroundClip: 'text',
  };
};

export const StepTitle = styled(Typography)(stepTitleStyles);

const stepSubtitleStyles = ({ theme }: { theme: Theme }): CSSObject => ({
  color: (theme.vars ?? theme).palette.text.secondary,
});

export const StepSubtitle = styled(Typography)(stepSubtitleStyles);
