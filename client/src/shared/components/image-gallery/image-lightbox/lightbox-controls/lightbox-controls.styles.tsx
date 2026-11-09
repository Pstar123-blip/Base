import { Box } from '@mui/material';
import { styled, type Theme } from '@mui/material/styles';

const controlsGroupStyles = ({ theme }: { theme: Theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
});
export const ControlsGroup = styled(Box)(controlsGroupStyles);
