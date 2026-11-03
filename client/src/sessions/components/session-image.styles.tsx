import { Avatar, Tooltip, tooltipClasses } from '@mui/material';
import { styled } from '@mui/material/styles';

import { IMAGE_PREVIEW_SIZE_PX, IMAGE_SIZE_PX } from '../consts';

export const Thumbnail = styled(Avatar)({
  width: IMAGE_SIZE_PX,
  height: IMAGE_SIZE_PX,
  cursor: 'zoom-in',
});

export const PreviewImage = styled('img')({
  display: 'block',
  maxWidth: IMAGE_PREVIEW_SIZE_PX,
  maxHeight: `min(${IMAGE_PREVIEW_SIZE_PX}px, 75vh)`,
});

export const PreviewTooltip = styled(Tooltip)({
  [`& .${tooltipClasses.tooltip}`]: { padding: 4 },
});
