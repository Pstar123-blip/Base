import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import { IconButton } from '@mui/material';
import { useControls } from 'react-zoom-pan-pinch';

import { ZoomControls } from './lightbox-zoom-controls.styles';

/** Must be rendered inside a `TransformWrapper`. */
export const LightboxZoomControls = () => {
  const { zoomIn, zoomOut, resetTransform } = useControls();

  const handleZoomIn = () => void zoomIn();
  const handleZoomOut = () => void zoomOut();
  const handleReset = () => void resetTransform();

  return (
    <ZoomControls role="group" aria-label="Zoom">
      <IconButton aria-label="Zoom out" onClick={handleZoomOut}>
        <ZoomOutIcon />
      </IconButton>
      <IconButton aria-label="Reset zoom" onClick={handleReset}>
        <RestartAltIcon />
      </IconButton>
      <IconButton aria-label="Zoom in" onClick={handleZoomIn}>
        <ZoomInIcon />
      </IconButton>
    </ZoomControls>
  );
};
