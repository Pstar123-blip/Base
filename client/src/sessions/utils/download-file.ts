import { enqueueSnackbar } from 'notistack';

import {
  DOWNLOAD_ERROR_MESSAGE,
  DOWNLOAD_REVOKE_DELAY_MS,
  HTTP_PROTOCOLS,
} from '../consts';

const isHttpUrl = (url: string) => {
  try {
    return HTTP_PROTOCOLS.includes(new URL(url, window.location.href).protocol);
  } catch {
    return false;
  }
};

const clickLink = (href: string, name: string, newTab = false) => {
  const link = document.createElement('a');
  link.href = href;
  link.download = name;

  if (newTab) {
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  }

  link.click();
};

// Downloads the file; when it can't be fetched (e.g. blocked cross-origin)
// falls back to opening a plain link, but only for http(s) URLs. Otherwise
// the user is told it failed.
export const downloadFile = async (src: string, name: string) => {
  try {
    const response = await fetch(src);

    if (!response.ok) {
      throw new Error(`Download failed with status ${response.status}`);
    }

    const url = URL.createObjectURL(await response.blob());
    clickLink(url, name);
    setTimeout(() => URL.revokeObjectURL(url), DOWNLOAD_REVOKE_DELAY_MS);
  } catch {
    if (isHttpUrl(src)) {
      clickLink(src, name, true);
    } else {
      enqueueSnackbar(DOWNLOAD_ERROR_MESSAGE, { variant: 'error' });
    }
  }
};
