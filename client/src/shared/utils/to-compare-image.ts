import type { CompareImage } from '@/shared/components/compare-row/types';

/** Describes a picked file for the compare row, or nothing until it has a URL. */
export const toCompareImage = (
  file: File | null,
  src: string | undefined,
): CompareImage | undefined =>
  file && src
    ? { src, alt: file.name, name: file.name, size: file.size }
    : undefined;
