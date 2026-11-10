import { DEFAULT_DOWNLOAD_FILE_NAME } from '@/shared/constants';

export type DownloadFileOptions = {
  /** Name to save the file as. Defaults to the file name in the URL. */
  fileName?: string;
  /** Used when there's no `fileName` and the URL has no file name. */
  fallbackName?: string;
};

const NON_FILE_NAME_CHARS = /[^a-z0-9.]+/gi;
const EDGE_DASHES = /^-+|-+$/g;

const toFileName = (text: string) =>
  text.replace(NON_FILE_NAME_CHARS, '-').replace(EDGE_DASHES, '').toLowerCase();

const hasExtension = (name: string) => name.includes('.');

const getUrlFileName = (url: string) => {
  const lastSegment = new URL(url, window.location.href).pathname
    .split('/')
    .pop();

  return lastSegment && hasExtension(lastSegment)
    ? decodeURIComponent(lastSegment)
    : undefined;
};

const withExtension = (name: string, mimeType: string) => {
  const extension = mimeType.split('/')[1]?.split(/[+;]/)[0];

  return hasExtension(name) || !extension ? name : `${name}.${extension}`;
};

const resolveFileName = (
  url: string,
  mimeType: string,
  { fileName, fallbackName }: DownloadFileOptions,
) => {
  const name =
    fileName ??
    getUrlFileName(url) ??
    (fallbackName && toFileName(fallbackName)) ??
    DEFAULT_DOWNLOAD_FILE_NAME;

  return withExtension(name || DEFAULT_DOWNLOAD_FILE_NAME, mimeType);
};

/** Saves an in-memory file, e.g. a generated CSV. */
export const downloadBlob = (blob: Blob, fileName: string) => {
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = objectUrl;
  link.download = fileName;
  link.click();
  // Revoking synchronously can cancel the download in Firefox and Safari.
  setTimeout(() => URL.revokeObjectURL(objectUrl));
};

const fetchBlob = async (url: string) => {
  try {
    const response = await fetch(url);

    return response.ok ? await response.blob() : null;
  } catch {
    return null;
  }
};

/**
 * Downloads the file at `url`. Fetches it as a blob because browsers ignore
 * `download` on cross-origin links; if the file can't be fetched (e.g. the
 * host doesn't allow CORS), opens the URL in a new tab instead.
 */
export const downloadFile = async (
  url: string,
  options: DownloadFileOptions = {},
) => {
  const blob = await fetchBlob(url);

  if (!blob) {
    window.open(url, '_blank', 'noopener');
    return;
  }

  downloadBlob(blob, resolveFileName(url, blob.type, options));
};
