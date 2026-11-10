import { Box, Typography } from '@mui/material';
import { styled, type Theme } from '@mui/material/styles';

import { GALLERY_TILE_ASPECT_RATIO, GALLERY_TILE_MIN_WIDTH } from './consts';

type GalleryGridProps = { gap: number };

const galleryGridStyles = ({
  theme,
  gap,
}: GalleryGridProps & { theme: Theme }) => ({
  display: 'grid',
  gridTemplateColumns: `repeat(auto-fill, minmax(min(${theme.spacing(GALLERY_TILE_MIN_WIDTH)}, 100%), 1fr))`,
  gap: theme.spacing(gap),
});
export const GalleryGrid = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'gap',
})<GalleryGridProps>(galleryGridStyles);

const galleryItemStyles = {
  aspectRatio: GALLERY_TILE_ASPECT_RATIO,
};
export const GalleryItem = styled(Box)(galleryItemStyles);

const emptyMessageStyles = ({ theme }: { theme: Theme }) => ({
  ...theme.typography.body1,
  padding: theme.spacing(4),
  textAlign: 'center' as const,
  color: (theme.vars ?? theme).palette.text.secondary,
});
export const EmptyMessage = styled(Typography)(emptyMessageStyles);
