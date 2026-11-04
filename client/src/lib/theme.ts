import { createTheme } from '@mui/material/styles';

import { COLOR_SCHEME_BACKGROUNDS } from '@/shared/constants';

const FONT_FAMILY = 'Inter, system-ui, sans-serif';
const BORDER_RADIUS = 12;

export const theme = createTheme({
  cssVariables: { colorSchemeSelector: 'data' },
  colorSchemes: {
    light: {
      palette: {
        primary: { main: '#5b5bd6' },
        secondary: { main: '#0e9f8e' },
        background: {
          default: COLOR_SCHEME_BACKGROUNDS.light,
          paper: '#ffffff',
        },
        text: { primary: '#1c2033', secondary: '#5a607a' },
        divider: '#e3e6f0',
      },
    },
    dark: {
      palette: {
        primary: { main: '#9a9aff' },
        secondary: { main: '#4fd1c0' },
        background: {
          default: COLOR_SCHEME_BACKGROUNDS.dark,
          paper: '#181b28',
        },
        text: { primary: '#e8eaf5', secondary: '#a0a6c0' },
        divider: '#2a2e42',
      },
    },
  },
  typography: {
    fontFamily: FONT_FAMILY,
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: BORDER_RADIUS },
  components: {
    MuiButton: { defaultProps: { disableElevation: true } },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
    MuiCard: { defaultProps: { variant: 'outlined' } },
    MuiAppBar: {
      defaultProps: { elevation: 0, color: 'inherit' },
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.vars.palette.background.paper,
          color: theme.vars.palette.text.primary,
          borderBottom: `1px solid ${theme.vars.palette.divider}`,
        }),
      },
    },
  },
});
