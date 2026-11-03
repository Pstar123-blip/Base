import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const Stage = styled(Box)({
  position: 'fixed',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  backgroundColor: 'rgba(0, 0, 0, 0.92)',
});

export const ViewerImage = styled('img', {
  shouldForwardProp: (prop) => prop !== 'dragging' && prop !== 'pannable',
})<{ dragging: boolean; pannable: boolean }>(({ dragging, pannable }) => ({
  maxWidth: '100%',
  maxHeight: '100%',
  objectFit: 'contain',
  userSelect: 'none',
  touchAction: 'none',
  cursor: dragging ? 'grabbing' : pannable ? 'grab' : 'default',
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
  borderRadius: 2,
  backgroundColor: 'rgba(30, 30, 30, 0.9)',
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
