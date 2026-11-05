import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import {
  VIEWER_BACKDROP_COLOR,
  VIEWER_FOOTER_COLOR,
  VIEWER_FOOTER_RADIUS_PX,
} from '../consts';

export const Stage = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'dragging' && prop !== 'pannable',
})<{ dragging: boolean; pannable: boolean }>(({ dragging, pannable }) => ({
  cursor: dragging ? 'grabbing' : pannable ? 'grab' : 'default',
  position: 'fixed',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  backgroundColor: VIEWER_BACKDROP_COLOR,
}));

export const ViewerImage = styled('img', {
  shouldForwardProp: (prop) => prop !== 'dragging',
})<{ dragging: boolean }>(({ dragging }) => ({
  maxWidth: '100%',
  maxHeight: '100%',
  objectFit: 'contain',
  userSelect: 'none',
  touchAction: 'none',
  cursor: 'inherit',
  transition: dragging ? 'none' : 'transform 0.08s ease-out',
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
  maxWidth: '90vw',
}));

export const ImageName = styled(Typography)({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});
