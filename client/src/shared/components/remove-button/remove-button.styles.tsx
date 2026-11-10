import { IconButton } from '@mui/material';
import { type CSSObject, styled, type Theme } from '@mui/material/styles';

// Frosted, so it stays readable over any image.
const frostedIconButtonStyles = ({ theme }: { theme: Theme }): CSSObject => {
  const { palette } = theme.vars ?? theme;

  return {
    color: palette.text.primary,
    backgroundColor: theme.alpha(palette.background.paper, 0.8),
    backdropFilter: 'blur(6px)',
    '&:hover': {
      color: palette.error.main,
      backgroundColor: palette.background.paper,
    },
  };
};

export const FrostedIconButton = styled(IconButton)(frostedIconButtonStyles);
