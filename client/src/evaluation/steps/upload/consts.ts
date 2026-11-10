import { type DropzoneOptions } from 'react-dropzone';

export const MAX_IMAGES = 50;

export const IMAGE_ACCEPT: DropzoneOptions['accept'] = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
};

export const IMAGE_ACCEPT_DESCRIPTION = `JPEG or PNG · up to ${MAX_IMAGES} images`;

export const GALLERY_LABEL = 'Uploaded images';

/**
 * The gallery scrolls inside its own area so the page doesn't; this keeps it
 * at least about one row tall on short screens. In theme spacing units.
 */
export const GALLERY_MIN_HEIGHT = 36;

/**
 * The dropzone's container once the gallery shows, so both fit on the page.
 * In theme spacing units.
 */
export const GALLERY_DROPZONE_HEIGHT = 28;
export const GALLERY_DROPZONE_MAX_WIDTH = 60;

/** Room for a tile's hover lift and shadow inside the scroll area, in theme spacing units. */
export const GALLERY_SCROLL_INSET = 1;

export const REMOVE_ALL_LABEL = 'Remove all';
export const REMOVE_ALL_TITLE = 'Remove all images?';
