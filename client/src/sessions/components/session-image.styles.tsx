import {
  Avatar,
  ButtonBase,
  Tooltip,
  tooltipClasses,
  type TooltipProps,
} from '@mui/material';
import { styled } from '@mui/material/styles';

import { IMAGE_PREVIEW_SIZE_PX, IMAGE_SIZE_PX } from '../consts';

export const ThumbnailButton = styled(ButtonBase)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  cursor: 'zoom-in',
}));

export const Thumbnail = styled(Avatar)({
  width: IMAGE_SIZE_PX,
  height: IMAGE_SIZE_PX,
});

export const PreviewImage = styled('img', {
  shouldForwardProp: (prop) => prop !== 'portrait',
})<{ portrait: boolean }>(({ portrait }) => ({
  display: 'block',
  width: portrait ? 'auto' : IMAGE_PREVIEW_SIZE_PX,
  height: portrait ? IMAGE_PREVIEW_SIZE_PX : 'auto',
}));

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
