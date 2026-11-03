import { useState } from 'react';

import { ImageViewer } from './image-viewer';
import {
  PreviewImage,
  PreviewTooltip,
  Thumbnail,
} from './session-image.styles';

export const SessionImage = ({ src, alt }: { src: string; alt: string }) => {
  const [viewerOpen, setViewerOpen] = useState(false);

  return (
    <>
      <PreviewTooltip
        title={<PreviewImage src={src} alt={alt} />}
        placement="top"
        disableInteractive
      >
        <Thumbnail
          variant="rounded"
          src={src}
          alt={alt}
          slotProps={{ img: { loading: 'lazy' } }}
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
