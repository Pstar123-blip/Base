import { Button } from '@mui/material';
import { closeSnackbar, enqueueSnackbar, type SnackbarKey } from 'notistack';

import { isHttpUrl } from '../utils/is-http-url';
import {
  DOWNLOAD_ERROR_MESSAGE,
  DOWNLOAD_REVOKE_DELAY_MS,
} from './use-download-file.consts';

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

// Downloads the file. When it can't be fetched (e.g. blocked cross-origin) the
// user is told, and for http(s) URLs offered a plain link. The link opens from
// the user's own click: a tab opened after the awaited fetch would no longer
// count as user-initiated and the browser would block it as a popup.
export const useDownloadFile = () => {
  const reportFailure = (src: string, name: string) => {
    const openLink = (key: SnackbarKey) => {
      clickLink(src, name, true);
      closeSnackbar(key);
    };

    enqueueSnackbar(DOWNLOAD_ERROR_MESSAGE, {
      variant: 'error',
      action: isHttpUrl(src)
        ? (key) => (
            <Button color="inherit" onClick={() => openLink(key)}>
              Open image
            </Button>
          )
        : undefined,
    });
  };

  return async (src: string, name: string) => {
    try {
      const response = await fetch(src);

      if (!response.ok) {
        throw new Error(`Download failed with status ${response.status}`);
      }

      const url = URL.createObjectURL(await response.blob());
      clickLink(url, name);
      setTimeout(() => URL.revokeObjectURL(url), DOWNLOAD_REVOKE_DELAY_MS);
    } catch {
      reportFailure(src, name);
    }
  };
};
