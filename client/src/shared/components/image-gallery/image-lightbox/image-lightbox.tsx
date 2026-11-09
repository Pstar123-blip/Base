import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';
import { CardMedia, IconButton } from '@mui/material';
import { type KeyboardEvent } from 'react';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

import { type GalleryImage } from '../types';
import {
  CLOSE_LABEL,
  LIGHTBOX_MAX_SCALE,
  LIGHTBOX_MIN_SCALE,
  LIGHTBOX_NEXT_KEY,
  LIGHTBOX_PREVIOUS_KEY,
  NEXT_IMAGE_LABEL,
  PREVIOUS_IMAGE_LABEL,
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
import { LightboxControls } from './lightbox-controls/lightbox-controls';

type ImageLightboxProps = {
  open: boolean;
  /** Stays set while closing, so the close transition still shows the image. */
  image: GalleryImage;
  /** Identifies the image; zoom resets whenever it changes. */
  imageId: string;
  index: number;
  total: number;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
};

export const ImageLightbox = ({
  open,
  image,
  imageId,
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
      open={open}
      onClose={onClose}
      onKeyDown={handleKeyDown}
      slotProps={{ paper: { 'aria-label': image.alt } }}
    >
      <TransformWrapper
        key={imageId}
        minScale={LIGHTBOX_MIN_SCALE}
        maxScale={LIGHTBOX_MAX_SCALE}
        doubleClick={{ mode: 'toggle' }}
      >
        <LightboxToolbar>
          <LightboxCounter aria-live="polite">
            {index + 1} / {total}
          </LightboxCounter>
          <LightboxControls image={image} />
          <IconButton aria-label={CLOSE_LABEL} onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </LightboxToolbar>
        <LightboxStage>
          {canNavigate && (
            <PreviousButton
              aria-label={PREVIOUS_IMAGE_LABEL}
              onClick={onPrevious}
            >
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
            <NextButton aria-label={NEXT_IMAGE_LABEL} onClick={onNext}>
              <ChevronRightIcon />
            </NextButton>
          )}
        </LightboxStage>
        {image.caption && <LightboxCaption>{image.caption}</LightboxCaption>}
      </TransformWrapper>
    </LightboxDialog>
  );
};
