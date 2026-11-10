import { IMAGE_ACCEPT, IMAGE_ACCEPT_DESCRIPTION } from '@/shared/constants';

export const UPLOAD_TITLE = 'Upload files';
export const UPLOAD_SUBTITLE = `Add two images (${IMAGE_ACCEPT_DESCRIPTION}) to continue.`;

export const FIRST_IMAGE_SLOT = {
  label: 'First image',
  description: IMAGE_ACCEPT_DESCRIPTION,
  accept: IMAGE_ACCEPT,
};

export const SECOND_IMAGE_SLOT = {
  label: 'Second image',
  description: IMAGE_ACCEPT_DESCRIPTION,
  accept: IMAGE_ACCEPT,
};

/** Narrowest a slot gets before the slots stack, in theme spacing units. */
export const SLOT_MIN_WIDTH = 40;
/** How small the preview starts when it replaces the dropzone. */
export const PREVIEW_ENTER_SCALE = 0.96;
/** In theme spacing units. */
export const PREVIEW_BORDER_RADIUS = 3;
