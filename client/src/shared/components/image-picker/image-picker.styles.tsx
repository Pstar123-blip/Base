import { Box } from '@mui/material';
import {
  type CSSObject,
  keyframes,
  styled,
  type Theme,
} from '@mui/material/styles';

import { ImageTile } from '@/shared/components/image-tile/image-tile';
import { UPLOAD_AREA_HEIGHT, UPLOAD_AREA_MAX_WIDTH } from '@/shared/constants';

import { PREVIEW_BORDER_RADIUS, PREVIEW_ENTER_SCALE } from './consts';

const previewEnter = keyframes`
  from { opacity: 0; transform: scale(${PREVIEW_ENTER_SCALE}); }
  to { opacity: 1; transform: none; }
`;

// The picker's footprint. It matches the dropzone's default size and the
// preview fills it, so one takes the other's place exactly.
const imagePickerRootStyles: CSSObject = {
  width: '100%',
  height: UPLOAD_AREA_HEIGHT,
  maxWidth: UPLOAD_AREA_MAX_WIDTH,
};

export const ImagePickerRoot = styled(Box)(imagePickerRootStyles);

const previewStyles = ({ theme }: { theme: Theme }): CSSObject => ({
  borderRadius: theme.spacing(PREVIEW_BORDER_RADIUS),
  animation: `${previewEnter} ${theme.transitions.duration.standard}ms ${theme.transitions.easing.easeOut}`,
  '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
});

export const Preview = styled(ImageTile)(previewStyles);
