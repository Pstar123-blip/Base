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
  // Tracked by id so the lightbox keeps showing the same image if `items` are
  // reordered or change around it. Kept separate from `isLightboxOpen` so the
  // last image stays rendered while the lightbox runs its close transition.
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const activeIndex = items.findIndex((item) => getId(item) === activeId);
  const activeItem = activeIndex === -1 ? undefined : items[activeIndex];

  // The open image was removed: close for real, so the lightbox doesn't
  // silently re-open if it comes back.
  if (isLightboxOpen && !activeItem) {
    setIsLightboxOpen(false);
  }

  if (!items.length) {
    return <EmptyMessage>{emptyMessage}</EmptyMessage>;
  }

  const isInteractive = lightbox || !!onItemClick;

  const close = () => setIsLightboxOpen(false);

  const step = (delta: number) => {
    const nextItem = items[(activeIndex + delta + items.length) % items.length];

    if (nextItem) {
      setActiveId(getId(nextItem));
    }
  };

  const showNext = () => step(1);
  const showPrevious = () => step(-1);

  const select = (item: T, index: number) => {
    onItemClick?.(item, index);

    if (lightbox) {
      setActiveId(getId(item));
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
