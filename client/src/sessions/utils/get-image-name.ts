export const getImageName = (src: string, fallback: string) =>
  decodeURIComponent(src.split(/[?#]/)[0]?.split('/').pop() ?? '') || fallback;
