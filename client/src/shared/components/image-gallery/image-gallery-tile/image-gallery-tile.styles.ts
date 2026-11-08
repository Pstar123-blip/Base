import { Box, Card, CardContent, Typography } from '@mui/material';
import { styled, type Theme } from '@mui/material/styles';

const TILE_ASPECT_RATIO = '1 / 1';
const TILE_HOVER_IMAGE_SCALE = 1.06;
const TILE_HOVER_LIFT_SPACING = -0.5;
const TILE_HOVER_SHADOW = 6;

const tileMediaStyles = ({ theme }: { theme: Theme }) => ({
  aspectRatio: TILE_ASPECT_RATIO,
  width: '100%',
  objectFit: 'cover' as const,
  backgroundColor: (theme.vars ?? theme).palette.action.hover,
});

const tileCardStyles = ({ theme }: { theme: Theme }) => ({
  transition: theme.transitions.create(['transform', 'box-shadow'], {
    duration: theme.transitions.duration.short,
  }),
  '& .MuiCardMedia-root': {
    ...tileMediaStyles({ theme }),
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.standard,
      easing: theme.transitions.easing.easeOut,
    }),
  },
  // Clip the zoomed image to the media area, above the caption.
  '& .MuiCardActionArea-root': {
    overflow: 'hidden',
  },
  // Only interactive tiles animate; keyboard focus gets the same feedback.
  '@media (prefers-reduced-motion: no-preference)': {
    '&:has(.MuiCardActionArea-root:hover), &:has(.MuiCardActionArea-root.Mui-focusVisible)':
      {
        transform: `translateY(${theme.spacing(TILE_HOVER_LIFT_SPACING)})`,
        boxShadow: theme.shadows[TILE_HOVER_SHADOW],
        '& .MuiCardMedia-root': {
          transform: `scale(${TILE_HOVER_IMAGE_SCALE})`,
        },
      },
  },
});
export const TileCard = styled(Card)(tileCardStyles);

const tileFallbackStyles = ({ theme }: { theme: Theme }) => ({
  ...tileMediaStyles({ theme }),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: (theme.vars ?? theme).palette.text.disabled,
});
export const TileFallback = styled(Box)(tileFallbackStyles);

const tileCaptionStyles = ({ theme }: { theme: Theme }) => ({
  padding: theme.spacing(1, 1.5),
  '&:last-child': { paddingBottom: theme.spacing(1) },
});
export const TileCaption = styled(CardContent)(tileCaptionStyles);

const tileCaptionTextStyles = ({ theme }: { theme: Theme }) => ({
  ...theme.typography.body2,
  color: (theme.vars ?? theme).palette.text.secondary,
});
export const TileCaptionText = styled(Typography)(tileCaptionTextStyles);
