import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import {
  VIEWER_BACKDROP_COLOR,
  VIEWER_FOOTER_COLOR,
  VIEWER_FOOTER_MAX_WIDTH,
  VIEWER_FOOTER_RADIUS_PX,
  VIEWER_TRANSITION,
} from '../consts';

export const Stage = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'dragging',
})<{ dragging: boolean }>(({ dragging }) => ({
  // Only a hand while dragging; the image shows its own cursor.
  cursor: dragging ? 'grabbing' : 'default',
  userSelect: 'none',
  position: 'fixed',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  backgroundColor: VIEWER_BACKDROP_COLOR,
}));

export const ViewerImage = styled('img', {
  shouldForwardProp: (prop) => prop !== 'dragging' && prop !== 'pannable',
})<{ dragging: boolean; pannable: boolean }>(({ dragging, pannable }) => ({
  maxWidth: '100%',
  maxHeight: '100%',
  objectFit: 'contain',
  userSelect: 'none',
  touchAction: 'none',
  cursor: dragging ? 'grabbing' : pannable ? 'grab' : 'default',
  transition: dragging ? 'none' : VIEWER_TRANSITION,
}));

export const CloseButton = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  right: theme.spacing(2),
  color: theme.palette.common.white,
}));

export const Footer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(2),
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(1.5, 3),
  borderRadius: VIEWER_FOOTER_RADIUS_PX,
  backgroundColor: VIEWER_FOOTER_COLOR,
  border: `1px solid ${theme.palette.grey[700]}`,
  boxShadow: theme.shadows[8],
  color: theme.palette.common.white,
  maxWidth: VIEWER_FOOTER_MAX_WIDTH,
}));

export const ImageName = styled(Typography)({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});
