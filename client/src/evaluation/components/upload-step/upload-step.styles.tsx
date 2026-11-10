import { Box, Typography } from '@mui/material';
import { type CSSObject, styled, type Theme } from '@mui/material/styles';

import {
  DROPZONE_HEIGHT,
  DROPZONE_MAX_WIDTH,
} from '@/shared/components/file-dropzone/consts';

import {
  GALLERY_DROPZONE_HEIGHT,
  GALLERY_DROPZONE_MAX_WIDTH,
  GALLERY_MIN_HEIGHT,
  GALLERY_SCROLL_INSET,
} from './consts';

// Grows into the step panel, so the gallery can take the height that's left.
const uploadStepRootStyles = ({ theme }: { theme: Theme }): CSSObject => ({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
});

export const UploadStepRoot = styled(Box)(uploadStepRootStyles);

// The dropzone fills it. It shrinks once the gallery shows, leaving the
// gallery the room.
const dropzoneContainerStyles = ({ theme }: { theme: Theme }): CSSObject => ({
  flexShrink: 0,
  alignSelf: 'center',
  width: '100%',
  height: DROPZONE_HEIGHT,
  maxWidth: DROPZONE_MAX_WIDTH,
  transition: theme.transitions.create(['height', 'max-width']),
  '&[data-has-gallery="true"]': {
    height: theme.spacing(GALLERY_DROPZONE_HEIGHT),
    maxWidth: theme.spacing(GALLERY_DROPZONE_MAX_WIDTH),
  },
  '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
});

export const DropzoneContainer = styled(Box)(dropzoneContainerStyles);

// A zero flex basis keeps the gallery's content out of the page's height: it
// fills the space that's left and scrolls inside it, so the page never does.
const gallerySectionStyles = ({ theme }: { theme: Theme }): CSSObject => ({
  flex: '1 1 0',
  minHeight: theme.spacing(GALLERY_MIN_HEIGHT),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
});

export const GallerySection = styled(Box)(gallerySectionStyles);

const galleryToolbarStyles = ({ theme }: { theme: Theme }): CSSObject => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
});

export const GalleryToolbar = styled(Box)(galleryToolbarStyles);

const galleryCountStyles = ({ theme }: { theme: Theme }): CSSObject => ({
  ...theme.typography.subtitle2,
  color: (theme.vars ?? theme).palette.text.secondary,
});

export const GalleryCount = styled(Typography)(galleryCountStyles);

// The inset is padded back in, so tiles line up with the toolbar while their
// hover lift and shadow aren't clipped by the scroll area.
const galleryScrollAreaStyles = ({ theme }: { theme: Theme }): CSSObject => ({
  flex: '1 1 0',
  minHeight: 0,
  overflowY: 'auto',
  overscrollBehavior: 'contain',
  scrollbarGutter: 'stable',
  margin: theme.spacing(-GALLERY_SCROLL_INSET),
  padding: theme.spacing(GALLERY_SCROLL_INSET),
});

export const GalleryScrollArea = styled(Box)(galleryScrollAreaStyles);
