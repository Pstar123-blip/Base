import { Thumbnail } from './session-image.styles';

export const SessionImage = ({ src, alt }: { src: string; alt: string }) => (
  <Thumbnail
    variant="rounded"
    src={src}
    alt={alt}
    slotProps={{ img: { loading: 'lazy' } }}
  />
);
