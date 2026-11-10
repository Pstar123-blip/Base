import { type ReactNode } from 'react';

export type GalleryImage = {
  /** Full-size image, shown in the lightbox. */
  src: string;
  /** Required for accessibility; also the accessible name of the tile. */
  alt: string;
  /** Smaller image used for the grid tile. Falls back to `src`. */
  thumbnailSrc?: string;
  caption?: ReactNode;
};
