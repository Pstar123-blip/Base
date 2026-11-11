// Also loaded by vite.config.ts in Node: keep imports to types and plain
// packages, no app aliases or UI modules.
import type { Accept } from 'react-dropzone';

export const REQUEST_TIMEOUT_MS = 15_000;

export const QUERY_STALE_TIME_MS = 30_000;
export const QUERY_GC_TIME_MS = 5 * 60_000;
export const MAX_QUERY_RETRIES = 2;

export const ERROR_AUTO_HIDE_DURATION_MS = 6000;
export const MAX_SNACKBARS = 3;

export const SESSION_STORAGE_KEY = 'session';

export const DEFAULT_TABLE_PAGE_SIZE = 5;
export const TABLE_PAGE_SIZE_OPTIONS = [DEFAULT_TABLE_PAGE_SIZE, 10, 20];

export const AUTH_MAX_ATTEMPTS = 3;
export const AUTH_POPUP_TIMEOUT_MS = 5 * 60_000;
export const AUTH_POPUP_POLL_MS = 300;
export const AUTH_POPUP_REOPEN_MS = 1000;

/** Used when a download has no file name from the caller or the URL. */
export const DEFAULT_DOWNLOAD_FILE_NAME = 'download';

/** The image types the app accepts for upload. */
export const JPEG_ACCEPT: Accept = { 'image/jpeg': ['.jpg', '.jpeg'] };
export const PNG_ACCEPT: Accept = { 'image/png': ['.png'] };
export const IMAGE_ACCEPT: Accept = { ...JPEG_ACCEPT, ...PNG_ACCEPT };
export const IMAGE_ACCEPT_DESCRIPTION = 'JPEG or PNG';

/**
 * The standard footprint of an upload area, in px: a dropzone, or the preview
 * that takes its place. Shared so every upload control lines up.
 */
export const UPLOAD_AREA_HEIGHT = 340;
export const UPLOAD_AREA_MAX_WIDTH = 720;

export const COLOR_MODE_STORAGE_KEY = 'color-mode';
export const COLOR_SCHEME_BACKGROUNDS = {
  light: '#f6f7fb',
  dark: '#0f111a',
} as const;
