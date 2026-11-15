import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import { FileDropzone } from '@/shared/components/file-dropzone/file-dropzone';
import { UPLOAD_AREA_MAX_WIDTH } from '@/shared/constants';

import {
  GALLERY_DROPZONE_HEIGHT,
  GALLERY_DROPZONE_MAX_WIDTH,
  GALLERY_MIN_HEIGHT,
  GALLERY_SCROLL_INSET,
} from './consts';

// Grows into the step panel, so the gallery can take the height that's left.
export const UploadStepRoot = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
}));

type DropzoneProps = { hasGallery: boolean };

// Shrinks once the gallery shows, leaving the gallery the room.
export const Dropzone = styled(FileDropzone, {
  shouldForwardProp: (prop) => prop !== 'hasGallery',
})<DropzoneProps>(({ theme, hasGallery }) => ({
  flexShrink: 0,
  alignSelf: 'center',
  maxWidth: UPLOAD_AREA_MAX_WIDTH,
  transition: theme.transitions.create(['height', 'max-width']),
  ...(hasGallery && {
    height: theme.spacing(GALLERY_DROPZONE_HEIGHT),
    maxWidth: theme.spacing(GALLERY_DROPZONE_MAX_WIDTH),
  }),
  '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
}));

// A zero flex basis keeps the gallery's content out of the page's height: it
// fills the space that's left and scrolls inside it, so the page never does.
export const GallerySection = styled(Box)(({ theme }) => ({
  flex: '1 1 0',
  minHeight: theme.spacing(GALLERY_MIN_HEIGHT),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
}));

export const GalleryToolbar = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
}));

export const GalleryCount = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: (theme.vars ?? theme).palette.text.secondary,
}));

// The inset is padded back in, so tiles line up with the toolbar while their
// hover lift and shadow aren't clipped by the scroll area.
export const GalleryScrollArea = styled(Box)(({ theme }) => ({
  flex: '1 1 0',
  minHeight: 0,
  overflowY: 'auto',
  overscrollBehavior: 'contain',
  scrollbarGutter: 'stable',
  margin: theme.spacing(-GALLERY_SCROLL_INSET),
  padding: theme.spacing(GALLERY_SCROLL_INSET),
}));
