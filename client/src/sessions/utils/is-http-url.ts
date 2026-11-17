import { HTTP_PROTOCOLS } from './is-http-url.consts';

export const isHttpUrl = (url: string) => {
  try {
    return HTTP_PROTOCOLS.includes(new URL(url, window.location.href).protocol);
  } catch {
    return false;
  }
};
