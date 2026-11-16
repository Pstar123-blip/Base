import { checkboxClasses, radioClasses } from '@mui/material';
import { type CSSObject, styled, type Theme } from '@mui/material/styles';

type OptionTileProps = { checked: boolean; disabled: boolean; error: boolean };

const optionTileStyles = ({
  theme,
  checked,
  disabled,
  error,
}: OptionTileProps & { theme: Theme }): CSSObject => {
  const { palette } = theme.vars ?? theme;
  const accent = error ? palette.error : palette.primary;

  return {
    display: 'flex',
    alignItems: 'flex-start',
    gap: theme.spacing(1),
    padding: theme.spacing(1.5, 2, 1.5, 1),
    borderRadius: theme.shape.borderRadius,
    border: `1.5px solid ${checked || error ? accent.main : palette.divider}`,
    backgroundColor: checked
      ? theme.alpha(accent.main, 0.08)
      : palette.background.paper,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    userSelect: 'none',
    transition: theme.transitions.create(
      ['border-color', 'background-color', 'box-shadow', 'transform'],
      { duration: theme.transitions.duration.shorter },
    ),
    ...(!disabled && {
      '&:hover': {
        borderColor: accent.main,
        transform: 'translateY(-1px)',
        boxShadow: `${theme.spacing(0, 0.5, 1.5)} ${theme.alpha(accent.main, 0.15)}`,
      },
      '&:active': { transform: 'translateY(0)' },
    }),
    '&:has(input:focus-visible)': {
      outline: `2px solid ${accent.main}`,
      outlineOffset: 2,
    },
    [`& .${checkboxClasses.root}, & .${radioClasses.root}`]: {
      padding: theme.spacing(0.25, 0.5),
    },
  };
};

// A `<label>` accepts phrasing content only, so everything rendered inside
// the tile below is a `span`.
export const OptionTile = styled('label', {
  shouldForwardProp: (prop) =>
    prop !== 'checked' && prop !== 'disabled' && prop !== 'error',
})<OptionTileProps>(optionTileStyles);

export const OptionText = styled('span')({
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
});

export const OptionTitle = styled('span')(({ theme }) => ({
  ...theme.typography.body1,
  fontWeight: 600,
  lineHeight: 1.6,
}));

export const OptionDescription = styled('span')(({ theme }) => ({
  ...theme.typography.body2,
  color: (theme.vars ?? theme).palette.text.secondary,
}));
