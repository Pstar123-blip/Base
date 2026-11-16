import { Box, FormLabel } from '@mui/material';
import { styled } from '@mui/material/styles';

export const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(1.5),
}));

export const GroupLabel = styled(FormLabel)(({ theme }) => ({
  fontWeight: 600,
  color: (theme.vars ?? theme).palette.text.primary,
}));

export const HeaderActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginLeft: 'auto',
}));

export const CountPill = styled('span')(({ theme }) => {
  const { palette } = theme.vars ?? theme;

  return {
    ...theme.typography.caption,
    fontWeight: 700,
    fontVariantNumeric: 'tabular-nums',
    padding: theme.spacing(0.25, 1),
    borderRadius: 999,
    color: palette.primary.main,
    backgroundColor: theme.alpha(palette.primary.main, 0.12),
  };
});
