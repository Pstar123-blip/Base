import { useLayoutEffect, useRef, useState } from 'react';

/**
 * A temporary URL for each of `blobs`, e.g. to preview picked files. A blob
 * keeps its URL while it stays in the list, so adding files doesn't reload
 * the ones already shown. URLs are revoked when their blob leaves the list or
 * the component unmounts, so they never leak.
 */
export const useObjectUrls = (blobs: readonly Blob[]) => {
  const cacheRef = useRef(new Map<Blob, string>());
  const [urls, setUrls] = useState<ReadonlyMap<Blob, string>>(new Map());

  // A layout effect, so the URLs are ready before the browser paints and the
  // UI never flashes missing images.
  useLayoutEffect(() => {
    const cache = cacheRef.current;
    const current = new Set(blobs);
    let hasChanged = false;

    cache.forEach((url, blob) => {
      if (!current.has(blob)) {
        URL.revokeObjectURL(url);
        cache.delete(blob);
        hasChanged = true;
      }
    });

    current.forEach((blob) => {
      if (!cache.has(blob)) {
        cache.set(blob, URL.createObjectURL(blob));
        hasChanged = true;
      }
    });

    // Only re-render when the set of blobs changed, so a caller passing a new
    // array with the same blobs on every render doesn't loop.
    if (hasChanged) {
      setUrls(new Map(cache));
    }
  }, [blobs]);

  useLayoutEffect(() => {
    const cache = cacheRef.current;

    return () => {
      cache.forEach((url) => URL.revokeObjectURL(url));
      cache.clear();
    };
  }, []);

  return urls;
};
