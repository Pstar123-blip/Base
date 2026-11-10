import { IconButton } from '@mui/material';
import { type CSSObject, styled, type Theme } from '@mui/material/styles';

import { FROSTED_BACKGROUND_OPACITY, FROSTED_BLUR } from './consts';

// Frosted, so it stays readable over any image.
const frostedIconButtonStyles = ({ theme }: { theme: Theme }): CSSObject => {
  const { palette } = theme.vars ?? theme;

  return {
    color: palette.text.primary,
    backgroundColor: theme.alpha(
      palette.background.paper,
      FROSTED_BACKGROUND_OPACITY,
    ),
    backdropFilter: FROSTED_BLUR,
    '&:hover': {
      color: palette.error.main,
      backgroundColor: palette.background.paper,
    },
  };
};

export const FrostedIconButton = styled(IconButton)(frostedIconButtonStyles);
