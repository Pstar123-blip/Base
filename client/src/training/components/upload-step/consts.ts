import { JPEG_ACCEPT, PNG_ACCEPT } from '@/shared/constants';

export const UPLOAD_TITLE = 'Upload files';
export const UPLOAD_SUBTITLE = 'Add a JPEG and a PNG to continue.';

export const FIRST_IMAGE_SLOT = {
  label: 'First image',
  description: 'JPEG only',
  accept: JPEG_ACCEPT,
};

export const SECOND_IMAGE_SLOT = {
  label: 'Second image',
  description: 'PNG only',
  accept: PNG_ACCEPT,
};

/** Narrowest a slot gets before the slots stack, in theme spacing units. */
export const SLOT_MIN_WIDTH = 40;
/** How small the preview starts when it replaces the dropzone. */
export const PREVIEW_ENTER_SCALE = 0.96;
/** In theme spacing units. */
export const PREVIEW_BORDER_RADIUS = 3;
