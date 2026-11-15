import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import { GALLERY_TILE_ASPECT_RATIO, GALLERY_TILE_MIN_WIDTH } from './consts';

type GalleryGridProps = { gap: number; columns?: number };

export const GalleryGrid = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'gap' && prop !== 'columns',
})<GalleryGridProps>(({ theme, gap, columns }) => {
  const minWidth = theme.spacing(GALLERY_TILE_MIN_WIDTH);
  // `columns` is a maximum: tiles never get narrower than the minimum width,
  // so narrow screens drop columns instead of squeezing the tiles.
  const trackWidth =
    columns === undefined
      ? `min(${minWidth}, 100%)`
      : `min(max(${minWidth}, calc((100% - ${columns - 1} * ${theme.spacing(gap)}) / ${columns})), 100%)`;

  // With a column maximum the tracks have a fixed width, so fewer tiles than
  // columns collapse the empty tracks and sit centered.
  return {
    display: 'grid',
    gridTemplateColumns:
      columns === undefined
        ? `repeat(auto-fill, minmax(${trackWidth}, 1fr))`
        : `repeat(auto-fit, ${trackWidth})`,
    justifyContent: columns === undefined ? undefined : 'center',
    gap: theme.spacing(gap),
  };
});

export const GalleryItem = styled(Box)({
  aspectRatio: GALLERY_TILE_ASPECT_RATIO,
});

export const EmptyMessage = styled(Typography)(({ theme }) => ({
  ...theme.typography.body1,
  padding: theme.spacing(4),
  textAlign: 'center',
  color: (theme.vars ?? theme).palette.text.secondary,
}));
