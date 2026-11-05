import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import { IconButton, Modal } from '@mui/material';
import {
  type PointerEvent,
  useEffect,
  useRef,
  useState,
  type WheelEvent,
} from 'react';

import { ZOOM_MAX, ZOOM_MIN, ZOOM_STEP } from '../consts';
import { getImageName } from '../utils/get-image-name';
import {
  CloseButton,
  Footer,
  ImageName,
  Stage,
  ViewerImage,
} from './image-viewer.styles';

const clampZoom = (zoom: number) =>
  Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, zoom));

const ORIGIN = { x: 0, y: 0 };

// Max pan distance on one axis. The black margin allowed beside the image
// scales with the image (same proportion as when fully zoomed out), which
// works out to half the viewport size per zoom step beyond ZOOM_MIN.
const getLimit = (viewportSize: number, zoom: number) =>
  Math.max(0, (viewportSize * (zoom - ZOOM_MIN)) / 2);

const clamp = (value: number, limit: number) =>
  Math.min(limit, Math.max(-limit, value));

export const ImageViewer = ({
  open,
  src,
  alt,
  onClose,
}: {
  open: boolean;
  src: string;
  alt: string;
  onClose: () => void;
}) => {
  const [zoom, setZoom] = useState(ZOOM_MIN);
  const [offset, setOffset] = useState(ORIGIN);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef(ORIGIN);
  const name = getImageName(src, alt);

  useEffect(() => {
    if (open) {
      setZoom(ZOOM_MIN);
      setOffset(ORIGIN);
    }
  }, [open]);

  const clampOffset = (value: typeof ORIGIN, targetZoom: number) => {
    return {
      x: clamp(value.x, getLimit(window.innerWidth, targetZoom)),
      y: clamp(value.y, getLimit(window.innerHeight, targetZoom)),
    };
  };

  const handleWheel = (event: WheelEvent) => {
    const direction = event.deltaY < 0 ? 1 : -1;
    const next = clampZoom(zoom * (1 + direction * ZOOM_STEP));
    setZoom(next);
    setOffset(next === ZOOM_MIN ? ORIGIN : clampOffset(offset, next));
  };

  const startDrag = (event: PointerEvent<HTMLElement>) => {
    // Let the close/download buttons receive their clicks.
    if (event.target instanceof Element && event.target.closest('button')) {
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);
    dragStart.current = {
      x: event.clientX - offset.x,
      y: event.clientY - offset.y,
    };
    setDragging(true);
  };

  const drag = (event: PointerEvent<HTMLElement>) => {
    if (!dragging) {
      return;
    }

    setOffset(
      clampOffset(
        {
          x: event.clientX - dragStart.current.x,
          y: event.clientY - dragStart.current.y,
        },
        zoom,
      ),
    );
  };

  const endDrag = () => setDragging(false);

  const download = async () => {
    try {
      const blob = await (await fetch(src)).blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = name;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      // Fetch can be blocked cross-origin; fall back to a plain link.
      const link = document.createElement('a');
      link.href = src;
      link.download = name;
      link.target = '_blank';
      link.click();
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Stage
        dragging={dragging}
        pannable={zoom > ZOOM_MIN}
        onWheel={handleWheel}
        onPointerDown={startDrag}
        onPointerMove={drag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <ViewerImage
          src={src}
          alt={alt}
          draggable={false}
          dragging={dragging}
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
          }}
        />
        <CloseButton>
          <IconButton color="inherit" aria-label="Close" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </CloseButton>
        <Footer>
          <ImageName variant="h6" title={name}>
            {name}
          </ImageName>
          <IconButton
            color="inherit"
            size="large"
            aria-label="Download"
            onClick={download}
          >
            <DownloadIcon fontSize="large" />
          </IconButton>
        </Footer>
      </Stage>
    </Modal>
  );
};
