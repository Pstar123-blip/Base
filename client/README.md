# Client

See the [workspace guide](../README.md) for setup and conventions.

`npm run dev`, `build`, `typecheck`, `lint`, `format`, `test`, `generate`, and `docker-build` are available here. Generate the API OpenAPI document first, or use `npm run generate` from the root. VITE_API_URL defaults to /api. Vite reads API_PROXY_TARGET from .env; the example uses http://api:3000 for Docker networking. All VITE_ values are public build-time configuration.
