import BrokenImageIcon from '@mui/icons-material/BrokenImage';
import { CardActionArea, CardMedia } from '@mui/material';
import { useState } from 'react';

import { type GalleryImage } from '../types';
import {
  TileCaption,
  TileCaptionText,
  TileCard,
  TileFallback,
} from './image-gallery-tile.styles';

type ImageGalleryTileProps = {
  image: GalleryImage;
  /** When omitted the tile is rendered as non-interactive. */
  onClick?: () => void;
};

export const ImageGalleryTile = ({ image, onClick }: ImageGalleryTileProps) => {
  const src = image.thumbnailSrc ?? image.src;
  // Tracked per src so a new src retries loading without an effect.
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const handleError = () => setFailedSrc(src);

  const media =
    failedSrc === src ? (
      <TileFallback role="img" aria-label={image.alt}>
        <BrokenImageIcon />
      </TileFallback>
    ) : (
      <CardMedia
        component="img"
        image={src}
        alt={image.alt}
        loading="lazy"
        onError={handleError}
      />
    );

  return (
    <TileCard role="listitem">
      {onClick ? (
        <CardActionArea onClick={onClick}>{media}</CardActionArea>
      ) : (
        media
      )}
      {image.caption && (
        <TileCaption>
          <TileCaptionText>{image.caption}</TileCaptionText>
        </TileCaption>
      )}
    </TileCard>
  );
};
