import {
  Avatar,
  Tooltip,
  tooltipClasses,
  type TooltipProps,
} from '@mui/material';
import { styled } from '@mui/material/styles';

import { IMAGE_PREVIEW_SIZE_PX, IMAGE_SIZE_PX } from '../consts';

export const Thumbnail = styled(Avatar)({
  width: IMAGE_SIZE_PX,
  height: IMAGE_SIZE_PX,
  cursor: 'zoom-in',
});

export const PreviewImage = styled('img')({
  display: 'block',
  width: IMAGE_PREVIEW_SIZE_PX,
  height: IMAGE_PREVIEW_SIZE_PX,
  objectFit: 'cover',
});

export const PreviewTooltip = styled(
  ({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ),
)({
  [`& .${tooltipClasses.tooltip}`]: {
    padding: 0,
    maxWidth: 'none',
    overflow: 'hidden',
  },
});
