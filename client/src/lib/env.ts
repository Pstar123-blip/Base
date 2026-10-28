const baseUrl = import.meta.env.VITE_API_URL || '/api';

if (!baseUrl.startsWith('/')) {
  const url = new URL(baseUrl);

  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error('VITE_API_URL must be a relative path or HTTP(S) URL');
  }
}

const adfsLoginUrl = new URL(
  import.meta.env.VITE_ADFS_LOGIN_URL || 'http://localhost:4000/login',
);

if (!['http:', 'https:'].includes(adfsLoginUrl.protocol)) {
  throw new Error('VITE_ADFS_LOGIN_URL must be an HTTP(S) URL');
}

export const env = { apiUrl: baseUrl, adfsLoginUrl: adfsLoginUrl.href };
