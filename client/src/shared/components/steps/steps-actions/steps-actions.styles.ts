import { Box, Button, buttonClasses } from '@mui/material';
import { type CSSObject, styled, type Theme } from '@mui/material/styles';

const actionsBarStyles = ({ theme }: { theme: Theme }): CSSObject => ({
  display: 'flex',
  justifyContent: 'space-between',
  gap: theme.spacing(1),
  paddingTop: theme.spacing(3),
  borderTop: `1px solid ${(theme.vars ?? theme).palette.divider}`,
});
export const ActionsBar = styled(Box)(actionsBarStyles);

const primaryActionStyles = ({ theme }: { theme: Theme }): CSSObject => {
  const { palette } = theme.vars ?? theme;
  const enabled = `&:not(.${buttonClasses.disabled})`;

  return {
    paddingInline: theme.spacing(3),
    transition: theme.transitions.create(['box-shadow', 'transform']),
    [enabled]: {
      backgroundImage: `linear-gradient(135deg, ${palette.primary.main}, ${palette.secondary.main})`,
    },
    [`${enabled}:hover`]: {
      boxShadow: `0 6px 20px ${theme.alpha(palette.primary.main, 0.45)}`,
      transform: 'translateY(-1px)',
    },
  };
};

export const PrimaryActionButton = styled(Button)(primaryActionStyles);
