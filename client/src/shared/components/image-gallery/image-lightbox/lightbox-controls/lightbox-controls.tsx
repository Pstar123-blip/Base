import DownloadIcon from '@mui/icons-material/Download';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import { IconButton } from '@mui/material';
import { useState } from 'react';
import { useControls } from 'react-zoom-pan-pinch';

import { downloadFile } from '@/shared/utils/download-file';

import { type GalleryImage } from '../../types';
import { ControlsGroup } from './lightbox-controls.styles';

type LightboxControlsProps = {
  image: GalleryImage;
};

/** Must be rendered inside a `TransformWrapper`. */
export const LightboxControls = ({ image }: LightboxControlsProps) => {
  const { zoomIn, zoomOut, resetTransform } = useControls();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleZoomIn = () => void zoomIn();
  const handleZoomOut = () => void zoomOut();
  const handleReset = () => void resetTransform();

  const handleDownload = async () => {
    setIsDownloading(true);

    try {
      await downloadFile(image.src, { fallbackName: image.alt });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <ControlsGroup role="group" aria-label="Image controls">
      <IconButton aria-label="Zoom out" onClick={handleZoomOut}>
        <ZoomOutIcon />
      </IconButton>
      <IconButton aria-label="Reset zoom" onClick={handleReset}>
        <RestartAltIcon />
      </IconButton>
      <IconButton aria-label="Zoom in" onClick={handleZoomIn}>
        <ZoomInIcon />
      </IconButton>
      <IconButton
        aria-label="Download image"
        onClick={() => void handleDownload()}
        disabled={isDownloading}
      >
        <DownloadIcon />
      </IconButton>
    </ControlsGroup>
  );
};
