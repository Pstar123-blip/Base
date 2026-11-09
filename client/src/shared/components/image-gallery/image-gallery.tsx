import { useState } from 'react';

import { DEFAULT_EMPTY_MESSAGE, DEFAULT_GALLERY_GAP } from './consts';
import { EmptyMessage, GalleryGrid } from './image-gallery.styles';
import { ImageGalleryTile } from './image-gallery-tile/image-gallery-tile';
import { ImageLightbox } from './image-lightbox/image-lightbox';
import { type GalleryImage } from './types';

export type ImageGalleryProps<T> = {
  items: readonly T[];
  getId: (item: T) => string;
  /**
   * Maps a domain item to what the gallery needs to render it. Called on every
   * render for each item, so keep it cheap and pure.
   */
  getImage: (item: T) => GalleryImage;
  /** Called when a tile is activated, before the lightbox opens. */
  onItemClick?: (item: T, index: number) => void;
  /** Open a full-screen viewer when a tile is clicked. Defaults to `true`. */
  lightbox?: boolean;
  /** Space between tiles, in theme spacing units. Defaults to `1`. */
  gap?: number;
  emptyMessage?: string;
  /** Accessible name for the gallery list. */
  label?: string;
};

export const ImageGallery = <T,>({
  items,
  getId,
  getImage,
  onItemClick,
  lightbox = true,
  gap = DEFAULT_GALLERY_GAP,
  emptyMessage = DEFAULT_EMPTY_MESSAGE,
  label,
}: ImageGalleryProps<T>) => {
  // Kept separate from `isLightboxOpen` so the last image stays rendered while
  // the lightbox runs its close transition.
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const activeItem = items.at(activeIndex);

  // Items shrank past the open image: close for real, so the lightbox doesn't
  // silently re-open on this index if items grow back.
  if (isLightboxOpen && !activeItem) {
    setIsLightboxOpen(false);
  }

  if (!items.length) {
    return <EmptyMessage>{emptyMessage}</EmptyMessage>;
  }

  const isInteractive = lightbox || !!onItemClick;

  const close = () => setIsLightboxOpen(false);
  const step = (delta: number) =>
    setActiveIndex((index) => (index + delta + items.length) % items.length);
  const showNext = () => step(1);
  const showPrevious = () => step(-1);

  const select = (item: T, index: number) => {
    onItemClick?.(item, index);

    if (lightbox) {
      setActiveIndex(index);
      setIsLightboxOpen(true);
    }
  };

  const renderTile = (item: T, index: number) => (
    <ImageGalleryTile
      key={getId(item)}
      image={getImage(item)}
      onClick={isInteractive ? () => select(item, index) : undefined}
    />
  );

  return (
    <>
      <GalleryGrid role="list" aria-label={label} gap={gap}>
        {items.map(renderTile)}
      </GalleryGrid>
      {lightbox && activeItem && (
        <ImageLightbox
          open={isLightboxOpen}
          image={getImage(activeItem)}
          imageId={getId(activeItem)}
          index={activeIndex}
          total={items.length}
          onClose={close}
          onNext={showNext}
          onPrevious={showPrevious}
        />
      )}
    </>
  );
};
