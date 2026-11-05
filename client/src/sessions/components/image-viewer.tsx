import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import { IconButton, Modal } from '@mui/material';
import {
  type MouseEvent,
  type PointerEvent,
  useRef,
  useState,
  type WheelEvent,
} from 'react';

import { ORIGIN, ZOOM_MAX, ZOOM_MIN, ZOOM_WHEEL_SENSITIVITY } from '../consts';
import { getImageName } from '../utils/get-image-name';
import { downloadFile } from '../utils/trigger-download';
import {
  CloseButton,
  Footer,
  ImageName,
  Stage,
  ViewerImage,
} from './image-viewer.styles';

const clampZoom = (zoom: number) =>
  Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, zoom));

const PRIMARY_BUTTON = 0;

// Max pan distance on one axis. The black margin allowed beside the image
// scales with the image (same proportion as when fully zoomed out), which
// works out to half the viewport size per zoom step beyond ZOOM_MIN.
const getLimit = (viewportSize: number, zoom: number) =>
  Math.max(0, (viewportSize * (zoom - ZOOM_MIN)) / 2);

const clamp = (value: number, limit: number) =>
  Math.min(limit, Math.max(-limit, value));

// Mounted only while open, so its zoom and drag state always start fresh.
export const ImageViewer = ({
  src,
  alt,
  onClose,
}: {
  src: string;
  alt: string;
  onClose: () => void;
}) => {
  const [zoom, setZoom] = useState(ZOOM_MIN);
  const [offset, setOffset] = useState(ORIGIN);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef(ORIGIN);
  const moved = useRef(false);
  const name = getImageName(src, alt);

  const clampOffset = (value: typeof ORIGIN, targetZoom: number) => ({
    x: clamp(value.x, getLimit(window.innerWidth, targetZoom)),
    y: clamp(value.y, getLimit(window.innerHeight, targetZoom)),
  });

  const handleWheel = (event: WheelEvent) => {
    if (event.deltaY === 0) {
      return;
    }

    const next = clampZoom(zoom * (1 - event.deltaY * ZOOM_WHEEL_SENSITIVITY));
    setZoom(next);
    setOffset(next === ZOOM_MIN ? ORIGIN : clampOffset(offset, next));
  };

  const startDrag = (event: PointerEvent<HTMLElement>) => {
    // Let the close/download buttons receive their clicks.
    if (event.target instanceof Element && event.target.closest('button')) {
      return;
    }

    if (zoom <= ZOOM_MIN || event.button !== PRIMARY_BUTTON) {
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);
    moved.current = false;
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

    moved.current = true;
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

  // A click on the stage itself (not the image or buttons) is a click on the
  // backdrop; ignore the click that ends a drag.
  const closeOnBackdrop = (event: MouseEvent) => {
    if (event.target === event.currentTarget && !moved.current) {
      onClose();
    }
  };

  const download = () => void downloadFile(src, name);

  return (
    <Modal open onClose={onClose}>
      <Stage
        dragging={dragging}
        pannable={zoom > ZOOM_MIN}
        onWheel={handleWheel}
        onPointerDown={startDrag}
        onPointerMove={drag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onLostPointerCapture={endDrag}
        onClick={closeOnBackdrop}
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
