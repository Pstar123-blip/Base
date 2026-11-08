import { Box, checkboxClasses, FormLabel, Typography } from '@mui/material';
import { type CSSObject, styled, type Theme } from '@mui/material/styles';

// The app theme enables `cssVariables`, so `vars` (with color channels) is
// always present at runtime.
const paletteOf = (theme: Theme) =>
  (theme.vars as NonNullable<Theme['vars']>).palette;

const tint = (channel: string, opacity: number) =>
  `rgb(${channel} / ${opacity})`;

const headerStyles = ({ theme }: { theme: Theme }): CSSObject => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(1.5),
});
export const Header = styled(Box)(headerStyles);

const groupLabelStyles = ({ theme }: { theme: Theme }): CSSObject => ({
  fontWeight: 600,
  color: paletteOf(theme).text.primary,
});
export const GroupLabel = styled(FormLabel)(groupLabelStyles);

const headerActionsStyles = ({ theme }: { theme: Theme }): CSSObject => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginLeft: 'auto',
});
export const HeaderActions = styled(Box)(headerActionsStyles);

const countPillStyles = ({ theme }: { theme: Theme }): CSSObject => ({
  ...theme.typography.caption,
  fontWeight: 700,
  fontVariantNumeric: 'tabular-nums',
  padding: theme.spacing(0.25, 1),
  borderRadius: 999,
  color: paletteOf(theme).primary.main,
  backgroundColor: tint(paletteOf(theme).primary.mainChannel, 0.12),
});
export const CountPill = styled('span')(countPillStyles);

// One tile per row, each stretching to the container's full width.
const optionsListStyles = ({ theme }: { theme: Theme }): CSSObject => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  width: '100%',
});
export const OptionsList = styled(Box)(optionsListStyles);

type OptionTileProps = { checked: boolean; disabled: boolean; error: boolean };

const optionTileStyles = ({
  theme,
  checked,
  disabled,
  error,
}: OptionTileProps & { theme: Theme }): CSSObject => {
  const palette = paletteOf(theme);
  const accent = error ? palette.error : palette.primary;

  return {
    display: 'flex',
    alignItems: 'flex-start',
    gap: theme.spacing(1),
    padding: theme.spacing(1.5, 2, 1.5, 1),
    borderRadius: theme.shape.borderRadius,
    border: `1.5px solid ${checked ? accent.main : error ? palette.error.main : palette.divider}`,
    backgroundColor: checked
      ? tint(accent.mainChannel, 0.08)
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
        boxShadow: `0 4px 12px ${tint(accent.mainChannel, 0.15)}`,
      },
      '&:active': { transform: 'translateY(0)' },
    }),
    '&:has(input:focus-visible)': {
      outline: `2px solid ${accent.main}`,
      outlineOffset: 2,
    },
    [`& .${checkboxClasses.root}`]: { padding: theme.spacing(0.25, 0.5) },
  };
};

export const OptionTile = styled('label', {
  shouldForwardProp: (prop) =>
    prop !== 'checked' && prop !== 'disabled' && prop !== 'error',
})<OptionTileProps>(optionTileStyles);

const optionTextStyles = (): CSSObject => ({
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
});
export const OptionText = styled(Box)(optionTextStyles);

const optionTitleStyles = (): CSSObject => ({
  fontWeight: 600,
  lineHeight: 1.6,
});
export const OptionTitle = styled(Typography)(optionTitleStyles);
