import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import { GALLERY_TILE_ASPECT_RATIO, GALLERY_TILE_MIN_WIDTH } from './consts';

type GalleryGridProps = { gap: number };

export const GalleryGrid = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'gap',
})<GalleryGridProps>(({ theme, gap }) => ({
  display: 'grid',
  gridTemplateColumns: `repeat(auto-fill, minmax(min(${theme.spacing(GALLERY_TILE_MIN_WIDTH)}, 100%), 1fr))`,
  gap: theme.spacing(gap),
}));

export const GalleryItem = styled(Box)({
  aspectRatio: GALLERY_TILE_ASPECT_RATIO,
});

export const EmptyMessage = styled(Typography)(({ theme }) => ({
  ...theme.typography.body1,
  padding: theme.spacing(4),
  textAlign: 'center',
  color: (theme.vars ?? theme).palette.text.secondary,
}));
