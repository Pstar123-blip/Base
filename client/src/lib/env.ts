const baseUrl = import.meta.env.VITE_API_URL || '/api';

if (!baseUrl.startsWith('/')) {
  const url = new URL(baseUrl);

  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error('VITE_API_URL must be a relative path or HTTP(S) URL');
  }
}

export const env = { apiUrl: baseUrl };
