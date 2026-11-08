import { Box } from '@mui/material';
import { styled, type Theme } from '@mui/material/styles';

const zoomControlsStyles = ({ theme }: { theme: Theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
});
export const ZoomControls = styled(Box)(zoomControlsStyles);
