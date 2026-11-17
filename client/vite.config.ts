import { fileURLToPath, URL } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv, type Plugin } from 'vite';

import {
  COLOR_MODE_STORAGE_KEY,
  COLOR_SCHEME_BACKGROUNDS,
} from './src/shared/constants.ts';

// Shares the color-mode constants with the inline script/styles in index.html.
const injectColorModeConstants = (): Plugin => ({
  name: 'inject-color-mode-constants',
  transformIndexHtml: (html) =>
    html
      .replaceAll('__COLOR_MODE_STORAGE_KEY__', COLOR_MODE_STORAGE_KEY)
      .replaceAll('__BACKGROUND_LIGHT__', COLOR_SCHEME_BACKGROUNDS.light)
      .replaceAll('__BACKGROUND_DARK__', COLOR_SCHEME_BACKGROUNDS.dark),
});

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), injectColorModeConstants()],
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
    server: {
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target:
            process.env.API_PROXY_TARGET ??
            env.API_PROXY_TARGET ??
            'http://localhost:3000',
          changeOrigin: true,
        },
      },
    },
  };
});
