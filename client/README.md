# Client

See the [workspace guide](../README.md) for setup and conventions.

Organize source by ownership:

```text
src/
  app/                 # Router, application layout, and global notifications
  features/
    auth/              # Sign-in flow, ADFS adapter, and auth screens
    dashboard/         # Workspace dashboard
  shared/
    ui/                # Reusable table, dialog, and loading/error/empty states
  api/                 # HTTP transport and generated API client/models
  lib/                 # Common configuration, query client, and session/UI stores
  main.tsx             # Application entry point and providers
```

Keep feature-specific components, hooks, helpers, and tests inside their feature.
Add subfolders within a feature when it grows enough to need them. Put reusable,
domain-independent components in `shared/ui`; shared UI should not import from
features or `app`. Use `app` to compose features and define routes. Keep tests next
to the code they cover, and leave generated API files under `api/generated`.

`npm run dev`, `build`, `typecheck`, `lint`, `format`, `test`, `generate`, and `docker-build` are available here. Generate the API OpenAPI document first, or use `npm run generate` from the root. VITE_API_URL defaults to /api. Vite reads API_PROXY_TARGET from .env; the example uses http://api:3000 for Docker networking. All VITE_ values are public build-time configuration.
