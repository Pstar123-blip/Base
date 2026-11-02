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
      clean: true,
      override: {
        mutator: { path: 'src/api/http.ts', name: 'request' },
        query: { signal: true },
        // Operations the API marks with `x-query` only read data, so they
        // should be queries, not mutations, even though they are POSTs.
        transformer: (verb) =>
          verb.originalOperation['x-query']
            ? {
                ...verb,
                override: {
                  ...verb.override,
                  query: { ...verb.override.query, useQuery: true },
                },
              }
            : verb,
      },
    },
  },
});
