import type { GalleryImage } from '@/shared/components/image-gallery/types';

export type Selection = {
  id: string;
  label: string;
};

export type CompareImage = {
  src: string;
  alt: string;
  name: string;
  /** Size in bytes, e.g. `File.size`. */
  size: number;
};

export type SummaryImage = GalleryImage & { id: string };
