import { type SyntheticEvent, useState } from 'react';

import {
  PreviewImage,
  PreviewTooltip,
  Thumbnail,
  ThumbnailButton,
} from './session-image.styles';

export interface ViewedImage {
  src: string;
  alt: string;
}

export type ImageOpener = (image: ViewedImage) => void;

export const SessionImage = ({
  src,
  alt,
  onOpen,
}: ViewedImage & { onOpen: ImageOpener }) => {
  const [portrait, setPortrait] = useState(false);

  const handleLoad = (event: SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = event.currentTarget;
    setPortrait(naturalHeight > naturalWidth);
  };

  return (
    <PreviewTooltip
      title={<PreviewImage src={src} alt={alt} portrait={portrait} />}
      placement="top"
      disableInteractive
    >
      <ThumbnailButton
        aria-label={`View ${alt} full screen`}
        onClick={() => onOpen({ src, alt })}
      >
        <Thumbnail
          variant="rounded"
          src={src}
          alt={alt}
          slotProps={{ img: { onLoad: handleLoad } }}
        />
      </ThumbnailButton>
    </PreviewTooltip>
  );
};
