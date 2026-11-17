import DownloadIcon from '@mui/icons-material/Download';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import { IconButton } from '@mui/material';
import { useState } from 'react';
import { useControls } from 'react-zoom-pan-pinch';

import { downloadFile } from '@/shared/utils/download-file';

import { type GalleryImage } from '../../types';
import {
  CONTROLS_GROUP_LABEL,
  DOWNLOAD_LABEL,
  RESET_ZOOM_LABEL,
  ZOOM_IN_LABEL,
  ZOOM_OUT_LABEL,
} from './consts';
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
    <ControlsGroup role="group" aria-label={CONTROLS_GROUP_LABEL}>
      <IconButton aria-label={ZOOM_OUT_LABEL} onClick={handleZoomOut}>
        <ZoomOutIcon />
      </IconButton>
      <IconButton aria-label={RESET_ZOOM_LABEL} onClick={handleReset}>
        <RestartAltIcon />
      </IconButton>
      <IconButton aria-label={ZOOM_IN_LABEL} onClick={handleZoomIn}>
        <ZoomInIcon />
      </IconButton>
      <IconButton
        aria-label={DOWNLOAD_LABEL}
        onClick={() => void handleDownload()}
        disabled={isDownloading}
      >
        <DownloadIcon />
      </IconButton>
    </ControlsGroup>
  );
};
