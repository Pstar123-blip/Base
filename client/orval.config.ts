import { defineConfig } from 'orval';
export default defineConfig({
  api: {
    input: '../api/openapi.json',
    output: {
      target: 'src/api/generated/api.ts',
      schemas: 'src/api/generated/model',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      override: {
        mutator: { path: 'src/api/http.ts', name: 'request' },
        query: { signal: true },
      },
    },
  },
});
