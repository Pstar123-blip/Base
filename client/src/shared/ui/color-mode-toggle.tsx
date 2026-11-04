import BrightnessAutoIcon from '@mui/icons-material/BrightnessAuto';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { IconButton, Tooltip, useColorScheme } from '@mui/material';

const NEXT_MODE = { light: 'dark', dark: 'system', system: 'light' } as const;
const MODE_ICONS = {
  light: <LightModeIcon />,
  dark: <DarkModeIcon />,
  system: <BrightnessAutoIcon />,
};

export const ColorModeToggle = () => {
  const { mode, setMode } = useColorScheme();

  if (!mode) {
    return null;
  }

  const next = NEXT_MODE[mode];
  const label = `Theme: ${mode}. Switch to ${next}`;
  const toggle = () => setMode(next);

  return (
    <Tooltip title={label}>
      <IconButton color="inherit" aria-label={label} onClick={toggle}>
        {MODE_ICONS[mode]}
      </IconButton>
    </Tooltip>
  );
};
