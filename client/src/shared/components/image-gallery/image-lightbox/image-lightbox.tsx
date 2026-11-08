import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';
import { CardMedia, IconButton } from '@mui/material';
import { type KeyboardEvent } from 'react';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

import { type GalleryImage } from '../types';
import {
  LIGHTBOX_MAX_SCALE,
  LIGHTBOX_MIN_SCALE,
  LIGHTBOX_NEXT_KEY,
  LIGHTBOX_PREVIOUS_KEY,
} from './consts';
import {
  LightboxCaption,
  LightboxCounter,
  LightboxDialog,
  LightboxStage,
  LightboxToolbar,
  NextButton,
  PreviousButton,
} from './image-lightbox.styles';
import { LightboxZoomControls } from './lightbox-zoom-controls/lightbox-zoom-controls';

type ImageLightboxProps = {
  /** The open image, or `null` when the lightbox is closed. */
  image: GalleryImage | null;
  index: number;
  total: number;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
};

export const ImageLightbox = ({
  image,
  index,
  total,
  onClose,
  onNext,
  onPrevious,
}: ImageLightboxProps) => {
  const canNavigate = total > 1;

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!canNavigate) {
      return;
    }

    if (event.key === LIGHTBOX_NEXT_KEY) {
      onNext();
    } else if (event.key === LIGHTBOX_PREVIOUS_KEY) {
      onPrevious();
    }
  };

  return (
    <LightboxDialog
      fullScreen
      open={!!image}
      onClose={onClose}
      onKeyDown={handleKeyDown}
      slotProps={{ paper: { 'aria-label': image?.alt } }}
    >
      {image && (
        // Keyed by src so zoom resets when navigating to another image.
        <TransformWrapper
          key={image.src}
          minScale={LIGHTBOX_MIN_SCALE}
          maxScale={LIGHTBOX_MAX_SCALE}
          doubleClick={{ mode: 'toggle' }}
        >
          <LightboxToolbar>
            <LightboxCounter aria-live="polite">
              {index + 1} / {total}
            </LightboxCounter>
            <LightboxZoomControls />
            <IconButton aria-label="Close" onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </LightboxToolbar>
          <LightboxStage>
            {canNavigate && (
              <PreviousButton aria-label="Previous image" onClick={onPrevious}>
                <ChevronLeftIcon />
              </PreviousButton>
            )}
            <TransformComponent>
              <CardMedia
                component="img"
                image={image.src}
                alt={image.alt}
                draggable={false}
              />
            </TransformComponent>
            {canNavigate && (
              <NextButton aria-label="Next image" onClick={onNext}>
                <ChevronRightIcon />
              </NextButton>
            )}
          </LightboxStage>
          {image.caption && <LightboxCaption>{image.caption}</LightboxCaption>}
        </TransformWrapper>
      )}
    </LightboxDialog>
  );
};
