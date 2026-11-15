import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

import { ImageTile } from '@/shared/components/image-tile/image-tile';
import { UPLOAD_AREA_HEIGHT, UPLOAD_AREA_MAX_WIDTH } from '@/shared/constants';

import { PREVIEW_BORDER_RADIUS } from './consts';

// The picker's footprint. It matches the dropzone's default size and the
// preview fills it, so one takes the other's place exactly.
export const ImagePickerRoot = styled(Box)({
  width: '100%',
  height: UPLOAD_AREA_HEIGHT,
  maxWidth: UPLOAD_AREA_MAX_WIDTH,
});

export const Preview = styled(ImageTile)(({ theme }) => ({
  borderRadius: theme.spacing(PREVIEW_BORDER_RADIUS),
}));
