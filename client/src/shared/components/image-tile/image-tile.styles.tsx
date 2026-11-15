import {
  Box,
  Card,
  cardActionAreaClasses,
  CardContent,
  cardMediaClasses,
  Typography,
} from '@mui/material';
import { type CSSObject, styled, type Theme } from '@mui/material/styles';

import {
  TILE_ACTION_INSET,
  TILE_HOVER_IMAGE_SCALE,
  TILE_HOVER_LIFT_SPACING,
  TILE_HOVER_SHADOW,
} from './consts';
import { type ImageTileFit } from './types';

const actionArea = `.${cardActionAreaClasses.root}`;
const media = `.${cardMediaClasses.root}`;

// Shared by the image and its fallback: takes whatever height the caption
// leaves.
const tileMediaStyles = (theme: Theme): CSSObject => ({
  flex: 1,
  minHeight: 0,
  width: '100%',
  backgroundColor: (theme.vars ?? theme).palette.action.hover,
});

type TileCardProps = { fit: ImageTileFit };

// Fills its container: the parent decides the tile's size and shape.
export const TileCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'fit',
})<TileCardProps>(({ theme, fit }) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100%',
  transition: theme.transitions.create(['transform', 'box-shadow'], {
    duration: theme.transitions.duration.short,
  }),
  [`& ${media}`]: {
    ...tileMediaStyles(theme),
    objectFit: fit,
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.standard,
      easing: theme.transitions.easing.easeOut,
    }),
  },
  // Clip the zoomed image to the media area, above the caption.
  [`& ${actionArea}`]: {
    flex: 1,
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  // Only interactive tiles animate; keyboard focus gets the same feedback.
  '@media (prefers-reduced-motion: no-preference)': {
    [`&:has(${actionArea}:hover), &:has(${actionArea}.${cardActionAreaClasses.focusVisible})`]:
      {
        transform: `translateY(${theme.spacing(TILE_HOVER_LIFT_SPACING)})`,
        boxShadow: theme.shadows[TILE_HOVER_SHADOW],
        [`& ${media}`]: {
          transform: `scale(${TILE_HOVER_IMAGE_SCALE})`,
        },
      },
  },
}));

export const TileFallback = styled(Box)(({ theme }) => ({
  ...tileMediaStyles(theme),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: (theme.vars ?? theme).palette.text.disabled,
}));

export const TileAction = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(TILE_ACTION_INSET),
  right: theme.spacing(TILE_ACTION_INSET),
  zIndex: 1,
}));

export const TileCaption = styled(CardContent)(({ theme }) => ({
  flexShrink: 0,
  padding: theme.spacing(1, 1.5),
  '&:last-child': { paddingBottom: theme.spacing(1) },
}));

export const TileCaptionText = styled(Typography)(({ theme }) => ({
  ...theme.typography.body2,
  color: (theme.vars ?? theme).palette.text.secondary,
}));
