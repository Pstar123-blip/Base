import { IMAGE_ACCEPT_DESCRIPTION } from '@/shared/constants';

export const MAX_IMAGES = 50;

export const UPLOAD_TITLE = 'Upload files';
export const UPLOAD_SUBTITLE = `Add up to ${MAX_IMAGES} images (${IMAGE_ACCEPT_DESCRIPTION}) to continue.`;
export const DROPZONE_DESCRIPTION = `${IMAGE_ACCEPT_DESCRIPTION} · up to ${MAX_IMAGES} images`;

export const GALLERY_LABEL = 'Uploaded images';
export const getGalleryCountLabel = (count: number) =>
  `${count} of ${MAX_IMAGES} images`;
export const getRemoveImageLabel = (fileName: string) => `Remove ${fileName}`;

export const REMOVE_ALL_LABEL = 'Remove all';
export const REMOVE_ALL_TITLE = 'Remove all images?';
export const getRemoveAllDescription = (count: number) =>
  `All ${count} images will be removed. You'll need to upload them again.`;

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
