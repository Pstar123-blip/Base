import { Box, Dialog, IconButton, Toolbar, Typography } from '@mui/material';
import { styled, type Theme } from '@mui/material/styles';

import { ZOOM_CONTENT_CLASS, ZOOM_WRAPPER_CLASS } from './consts';

const lightboxDialogStyles = ({ theme }: { theme: Theme }) => ({
  '& .MuiDialog-paper': {
    display: 'flex',
    flexDirection: 'column' as const,
    backgroundColor: (theme.vars ?? theme).palette.background.default,
  },
});
export const LightboxDialog = styled(Dialog)(lightboxDialogStyles);

const lightboxToolbarStyles = {
  justifyContent: 'space-between',
};
export const LightboxToolbar = styled(Toolbar)(lightboxToolbarStyles);

const lightboxCounterStyles = ({ theme }: { theme: Theme }) => ({
  ...theme.typography.body2,
  color: (theme.vars ?? theme).palette.text.secondary,
});
export const LightboxCounter = styled(Typography)(lightboxCounterStyles);

const lightboxStageStyles = ({ theme }: { theme: Theme }) => ({
  position: 'relative' as const,
  flex: 1,
  minHeight: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(0, 8),
  [theme.breakpoints.down('sm')]: {
    padding: 0,
  },
  [`& .${ZOOM_WRAPPER_CLASS}, & .${ZOOM_CONTENT_CLASS}`]: {
    width: '100%',
    height: '100%',
  },
  [`& .${ZOOM_WRAPPER_CLASS}`]: {
    cursor: 'grab',
    '&:active': { cursor: 'grabbing' },
  },
  [`& .${ZOOM_CONTENT_CLASS}`]: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  '& .MuiCardMedia-root': {
    width: 'auto',
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain' as const,
    userSelect: 'none' as const,
  },
});
export const LightboxStage = styled(Box)(lightboxStageStyles);

const navButtonStyles = ({ theme }: { theme: Theme }) => ({
  position: 'absolute' as const,
  top: '50%',
  transform: 'translateY(-50%)',
  // Keep above the zoom wrapper, which is itself positioned.
  zIndex: theme.zIndex.fab,
  backgroundColor: (theme.vars ?? theme).palette.background.paper,
  boxShadow: theme.shadows[2],
  '&:hover': {
    backgroundColor: (theme.vars ?? theme).palette.background.paper,
    boxShadow: theme.shadows[4],
  },
});

const previousButtonStyles = ({ theme }: { theme: Theme }) => ({
  left: theme.spacing(1),
});
export const PreviousButton = styled(IconButton)(
  navButtonStyles,
  previousButtonStyles,
);

const nextButtonStyles = ({ theme }: { theme: Theme }) => ({
  right: theme.spacing(1),
});
export const NextButton = styled(IconButton)(navButtonStyles, nextButtonStyles);

const lightboxCaptionStyles = ({ theme }: { theme: Theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center' as const,
});
export const LightboxCaption = styled(Typography)(lightboxCaptionStyles);
