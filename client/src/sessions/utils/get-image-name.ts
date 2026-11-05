import { FILE_NAME_PATTERN } from '../consts';

const decode = (segment: string) => {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
};

// The last URL segment when it looks like a file name, otherwise the fallback.
export const getImageName = (src: string, fallback: string) => {
  const segment = decode(src.split(/[?#]/)[0]?.split('/').pop() ?? '');

  return FILE_NAME_PATTERN.test(segment) ? segment : fallback;
};
