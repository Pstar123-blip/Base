import { type SyntheticEvent, useState } from 'react';

import { ImageViewer } from './image-viewer';
import {
  PreviewImage,
  PreviewTooltip,
  Thumbnail,
} from './session-image.styles';

export const SessionImage = ({ src, alt }: { src: string; alt: string }) => {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [portrait, setPortrait] = useState(false);

  const handleLoad = (event: SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = event.currentTarget;
    setPortrait(naturalHeight > naturalWidth);
  };

  return (
    <>
      <PreviewTooltip
        title={<PreviewImage src={src} alt={alt} portrait={portrait} />}
        placement="top"
        disableInteractive
      >
        <Thumbnail
          variant="rounded"
          src={src}
          alt={alt}
          slotProps={{ img: { loading: 'lazy', onLoad: handleLoad } }}
          onClick={() => setViewerOpen(true)}
        />
      </PreviewTooltip>
      <ImageViewer
        open={viewerOpen}
        src={src}
        alt={alt}
        onClose={() => setViewerOpen(false)}
      />
    </>
  );
};
