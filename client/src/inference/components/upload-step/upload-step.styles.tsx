import { Box } from '@mui/material';
import {
  type CSSObject,
  keyframes,
  styled,
  type Theme,
} from '@mui/material/styles';

import {
  DROPZONE_HEIGHT,
  DROPZONE_MAX_WIDTH,
} from '@/shared/components/file-dropzone/consts';
import { ImageTile } from '@/shared/components/image-tile/image-tile';

import {
  PREVIEW_BORDER_RADIUS,
  PREVIEW_ENTER_SCALE,
  SLOT_MIN_WIDTH,
} from './consts';

const previewEnter = keyframes`
  from { opacity: 0; transform: scale(${PREVIEW_ENTER_SCALE}); }
  to { opacity: 1; transform: none; }
`;

const uploadStepRootStyles = ({ theme }: { theme: Theme }): CSSObject => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
});

export const UploadStepRoot = styled(Box)(uploadStepRootStyles);

const slotsGridStyles = ({ theme }: { theme: Theme }): CSSObject => ({
  display: 'grid',
  gap: theme.spacing(3),
  // Side by side when there's room, stacked otherwise.
  gridTemplateColumns: `repeat(auto-fit, minmax(min(${theme.spacing(SLOT_MIN_WIDTH)}, 100%), 1fr))`,
});

export const SlotsGrid = styled(Box)(slotsGridStyles);

// A slot's footprint, shared by the dropzone and the image that replaces it,
// so one takes the other's place exactly.
const slotStyles: CSSObject = {
  width: '100%',
  height: DROPZONE_HEIGHT,
  maxWidth: DROPZONE_MAX_WIDTH,
  justifySelf: 'center',
};

// The dropzone fills it.
export const DropzoneSlot = styled(Box)(slotStyles);

const droppedImageTileStyles = ({ theme }: { theme: Theme }): CSSObject => ({
  ...slotStyles,
  borderRadius: theme.spacing(PREVIEW_BORDER_RADIUS),
  animation: `${previewEnter} ${theme.transitions.duration.standard}ms ${theme.transitions.easing.easeOut}`,
  '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
});

export const DroppedImageTile = styled(ImageTile)(droppedImageTileStyles);
