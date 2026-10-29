import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { IconButton, Tooltip, useColorScheme } from '@mui/material';

export const ColorModeToggle = () => {
  const { mode, systemMode, setMode } = useColorScheme();
  if (!mode) {
    return null;
  }
  const isDark = (mode === 'system' ? systemMode : mode) === 'dark';
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';
  const toggle = () => setMode(isDark ? 'light' : 'dark');

  return (
    <Tooltip title={label}>
      <IconButton color="inherit" aria-label={label} onClick={toggle}>
        {isDark ? <LightModeIcon /> : <DarkModeIcon />}
      </IconButton>
    </Tooltip>
  );
};
