import { createTheme } from '@mui/material/styles';
export const theme = createTheme({
  palette: { primary: { main: '#3658a5' }, background: { default: '#f5f7fb' } },
  typography: { fontFamily: 'Inter, system-ui, sans-serif' },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: { defaultProps: { disableElevation: true } },
    MuiPaper: { defaultProps: { elevation: 0 } },
  },
});
