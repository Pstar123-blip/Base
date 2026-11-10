import BrokenImageIcon from '@mui/icons-material/BrokenImage';
import { CardActionArea, CardMedia } from '@mui/material';
import { type ReactNode, useState } from 'react';

import { DEFAULT_TILE_FIT } from './consts';
import {
  TileAction,
  TileCaption,
  TileCaptionText,
  TileCard,
  TileFallback,
} from './image-tile.styles';
import { type ImageTileFit } from './types';

export type ImageTileProps = {
  src: string;
  /** Required for accessibility; also the accessible name of the tile. */
  alt: string;
  caption?: ReactNode;
  /** Defaults to `cover`, which crops the image to fill the tile. */
  fit?: ImageTileFit;
  /** When omitted the tile is rendered as non-interactive. */
  onClick?: () => void;
  /** Overlaid on the top-right corner, e.g. a remove button. */
  action?: ReactNode;
  className?: string;
};

/** An image card that fills its container; the parent sets its size. */
export const ImageTile = ({
  src,
  alt,
  caption,
  fit = DEFAULT_TILE_FIT,
  onClick,
  action,
  className,
}: ImageTileProps) => {
  // Tracked per src so a new src retries loading without an effect.
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const handleError = () => setFailedSrc(src);

  const media =
    failedSrc === src ? (
      <TileFallback role="img" aria-label={alt}>
        <BrokenImageIcon />
      </TileFallback>
    ) : (
      <CardMedia
        component="img"
        image={src}
        alt={alt}
        loading="lazy"
        onError={handleError}
      />
    );

  return (
    <TileCard className={className} fit={fit}>
      {onClick ? (
        <CardActionArea onClick={onClick}>{media}</CardActionArea>
      ) : (
        media
      )}
      {action && <TileAction>{action}</TileAction>}
      {caption && (
        <TileCaption>
          <TileCaptionText>{caption}</TileCaptionText>
        </TileCaption>
      )}
    </TileCard>
  );
};
