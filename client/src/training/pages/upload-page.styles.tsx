import { Box, IconButton, Typography } from '@mui/material';
import {
  type CSSObject,
  keyframes,
  styled,
  type Theme,
} from '@mui/material/styles';

import {
  DROP_AREA_MAX_WIDTH,
  DROP_AREA_MIN_HEIGHT,
} from '@/shared/components/file-dropzone/consts';
import { ImageTile } from '@/shared/components/image-tile/image-tile';

const previewEnter = keyframes`
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: none; }
`;

const uploadPageRootStyles = ({ theme }: { theme: Theme }): CSSObject => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
});

export const UploadPageRoot = styled(Box)(uploadPageRootStyles);

const uploadHeaderStyles: CSSObject = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
};

export const UploadHeader = styled(Box)(uploadHeaderStyles);

const uploadTitleStyles = ({ theme }: { theme: Theme }): CSSObject => {
  const { palette } = theme.vars ?? theme;

  return {
    width: 'fit-content',
    fontWeight: theme.typography.fontWeightBold,
    letterSpacing: '-0.01em',
    color: 'transparent',
    backgroundImage: `linear-gradient(135deg, ${palette.primary.main}, ${palette.secondary.main})`,
    backgroundClip: 'text',
  };
};

export const UploadTitle = styled(Typography)(uploadTitleStyles);

const uploadSubtitleStyles = ({ theme }: { theme: Theme }): CSSObject => ({
  color: (theme.vars ?? theme).palette.text.secondary,
});

export const UploadSubtitle = styled(Typography)(uploadSubtitleStyles);

const slotsGridStyles = ({ theme }: { theme: Theme }): CSSObject => ({
  display: 'grid',
  gap: theme.spacing(3),
  // Side by side when there's room, stacked otherwise.
  gridTemplateColumns: `repeat(auto-fit, minmax(min(${theme.spacing(40)}, 100%), 1fr))`,
});

export const SlotsGrid = styled(Box)(slotsGridStyles);

// Takes the dropzone's exact footprint, so the image replaces it in place.
const droppedImageTileStyles = ({ theme }: { theme: Theme }): CSSObject => ({
  height: DROP_AREA_MIN_HEIGHT,
  maxWidth: DROP_AREA_MAX_WIDTH,
  marginInline: 'auto',
  borderRadius: theme.spacing(3),
  animation: `${previewEnter} ${theme.transitions.duration.standard}ms ${theme.transitions.easing.easeOut}`,
  '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
});

export const DroppedImageTile = styled(ImageTile)(droppedImageTileStyles);

// Frosted, so it stays readable over any image.
const removeButtonStyles = ({ theme }: { theme: Theme }): CSSObject => {
  const { palette } = theme.vars ?? theme;

  return {
    color: palette.text.primary,
    backgroundColor: theme.alpha(palette.background.paper, 0.8),
    backdropFilter: 'blur(6px)',
    '&:hover': {
      color: palette.error.main,
      backgroundColor: palette.background.paper,
    },
  };
};

export const RemoveButton = styled(IconButton)(removeButtonStyles);
