import { useLayoutEffect, useState } from 'react';

/**
 * A temporary URL pointing at `blob`, e.g. to preview a picked file. Revoked
 * when the blob changes or the component unmounts, so it never leaks.
 */
export const useObjectUrl = (blob: Blob | null) => {
  const [url, setUrl] = useState<string>();

  // A layout effect, so the URL is ready before the browser paints and the
  // UI never flashes a missing image.
  useLayoutEffect(() => {
    if (!blob) {
      return;
    }

    const objectUrl = URL.createObjectURL(blob);

    setUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
      setUrl(undefined);
    };
  }, [blob]);

  return url;
};
