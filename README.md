# Full-stack project base

Clone this repository to start a project with authentication, an API, a database, and a working example screen. Replace the example UI with your own pages while keeping the infrastructure.

The stack is React/Vite, Material UI, TanStack Router and Query, Zustand, NestJS, PostgreSQL, and Drizzle. npm workspaces and Turborepo manage the client and API together.

## Start locally

Install Node.js 24 and Docker with Docker Compose. Start Docker before running the commands below.

From the repository root, install dependencies and create your local environment files:

```sh
npm ci
```

PowerShell:

```powershell
Copy-Item api/.env.example api/.env
Copy-Item client/.env.example client/.env
```

macOS/Linux:

```sh
cp api/.env.example api/.env
cp client/.env.example client/.env
```

Copy these files only on first setup; keep your existing settings when updating a project. Real `.env` files are ignored by Git.

In `api/.env`, replace the example `JWT_ACCESS_SECRET` with a private random value of at least 32 characters. You can generate one with:

```sh
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Start the development stack:

```sh
npm run docker:dev
```

Compose starts PostgreSQL, applies committed migrations, and starts the API, client, and separate mock login service.

| Service                   | Address                        |
| ------------------------- | ------------------------------ |
| Frontend                  | http://localhost:5173          |
| API documentation         | http://localhost:3000/api/docs |
| Mock login page           | http://localhost:4000/login    |
| PostgreSQL from your host | localhost:5432                 |

Open the frontend. The login popup opens automatically; the mock accepts any nonblank username and password. If the browser blocks the popup, allow popups or use the displayed **Open sign-in window** button. The credentials form belongs to the separate mock service.

Source edits under `client/src` and `api/src` are mounted into development containers. After changing environment values, rerun `npm run docker:dev` to recreate the affected containers. Dependency or Dockerfile changes require rebuilding, which this command also does.

Stop development containers with `npm run docker:down`. The database stays in its Docker volume.

## What to keep and what to replace

```text
api/
  src/auth/             JWT guard, token issuance, and example user schema/repository
  src/database/         Database connection
  src/common/           Logging and request context
  openapi.json          Generated API contract
client/src/
  app/                  Root providers and route registration
  core/auth/            Popup login, session checks, and token exchange
  core/pages/           Sign-in, Unauthorized, and Not Found pages
  demo/                 Replaceable example layout, dashboard, and UI components
  shared/ui/            Loading and error states used by core screens
  shared/constants.ts   Shared client constants
  lib/                  Theme, environment, query client, and session store
  api/                  Axios setup and generated API client
mock-adfs/              Separate local mock identity provider
```

Keep `app/`, `core/`, `lib/`, and `api/` as the starting infrastructure. Customize the theme in `client/src/lib/theme.ts` and adjust the core page appearance as needed.

Everything under `client/src/demo/` is example UI. It includes the dashboard, navigation layout, table, empty state, and logout confirmation dialog. No core page imports from this folder.

## Replace the demo with your project

1. Create your own pages and, if needed, a layout outside `demo/`.
2. Open `client/src/app/router.tsx`. Replace the `Dashboard` and `Layout` imports and the clearly marked demo route definitions with your own components and routes.
3. Update `root.addChildren(...)` to register your replacement routes. Keep `unauthorizedRoute` registered.
4. Delete `client/src/demo/` once nothing imports it.
5. Rename the project metadata in the package files, update application text and theme, and set `LOG_SERVICE_NAME` in `api/.env`.
6. Run `npm run typecheck` and `npm run build`.

Keep the root route's `beforeLoad: requireSession`. It protects all child routes by default, including new pages. `/unauthorized` is the explicit exception so failed sign-in can display its recovery button. A pathless layout route only provides layout; authentication comes from the root.

The demo layout also contains example logout and token-change handling. If your new layout needs those behaviors, carry them over when replacing it.

See [the demo removal guide](client/src/demo/README.md).

## Connect your real login service

Set the popup URL in `client/.env`:

```dotenv
VITE_ADFS_LOGIN_URL=https://your-login-service.example/login
```

The frontend opens this URL unchanged, without adding query parameters. Changing only the URL is sufficient when your provider supports the following contract:

```js
window.opener.postMessage(
  { user: { token: providerToken } },
  'https://your-frontend.example',
);
```

The frontend reads `event.data.user.token` and checks that `event.source` is the popup it opened. No message type, nonce, or success flag is required. The listener currently does not check `event.origin`.

The provider JWT must have a compatible signing algorithm, be signed with the same server-side `JWT_ACCESS_SECRET` as the API, and contain a nonblank `username` of at most 254 characters. The mock uses HS256. The API has no issuer, audience, token-kind, or required `sub` checks. Sharing a secret alone is insufficient if your real provider uses a different signing scheme or popup response format; adapt the integration in that case.

Set `CLIENT_ORIGIN` in `api/.env` to your frontend's exact origin, including its port when applicable:

```dotenv
CLIENT_ORIGIN=http://localhost:5173
```

This controls API CORS and the `Origin` check on token creation. It is separate from popup message checks. The mock uses its own `CLIENT_ORIGIN` to target its response; development Compose explicitly sets that value to `http://localhost:5173`. Update that Compose setting too if your local frontend origin changes.

Never put the signing secret in `client/.env` or a `VITE_` variable. `VITE_` values are public browser configuration.

### Authentication flow

1. Root routing checks for a completed application token in the persisted session. It does not call `/auth/me` to validate the session.
2. If a token is missing, the signing-in screen mounts the popup hook and opens the external login window.
3. The provider sends `{ user: { token } }` to the opener.
4. The frontend temporarily stores that provider token. Axios attaches it as a bearer header to `POST /api/auth/create-token`, which takes no request body.
5. The API JWT guard verifies the token. The API then issues its own one-day token, which replaces the provider token in storage. Login does not create a database user.
6. Subsequent API calls use the application token automatically. The API guard validates it on each protected request.

Popup or token-exchange failures restart the entire flow: one initial attempt and two retries. After three failed attempts, the app shows Unauthorized. **Relogin** starts another sign-in flow.

An interrupted provider-token exchange is marked in storage so refreshing restarts login. A `401` clears the session only if the failed request used the current token. Logout removes the local token; it does not revoke already issued JWTs. The demo dashboard calls `/auth/me` for display data, separately from session authentication.

For the relevant files, see [the authentication guide](client/src/core/auth/README.md) and [the mock service guide](mock-adfs/README.md).

## Environment settings

The example files are configured for development **inside Docker**:

| Setting               | File          | Purpose                                                    |
| --------------------- | ------------- | ---------------------------------------------------------- |
| `DATABASE_URL`        | `api/.env`    | PostgreSQL connection; Docker hostname is `db`             |
| `JWT_ACCESS_SECRET`   | `api/.env`    | Server-only JWT signing and verification secret            |
| `CLIENT_ORIGIN`       | `api/.env`    | Allowed frontend origin                                    |
| `PORT`                | `api/.env`    | API port; default 3000                                     |
| `VITE_API_URL`        | `client/.env` | Browser API base URL; default `/api`                       |
| `API_PROXY_TARGET`    | `client/.env` | Vite's API proxy target; Docker value is `http://api:3000` |
| `VITE_ADFS_LOGIN_URL` | `client/.env` | External popup URL                                         |

PostgreSQL development credentials are defined in `docker-compose-dev.yml`: user `user`, password `password`, database `app`. Keep them consistent with `DATABASE_URL`. Initialization settings only apply when the database volume is first created.

### Run applications on your host

To use local Node processes with PostgreSQL in Docker:

1. Set `DATABASE_URL=postgres://user:password@localhost:5432/app` in `api/.env`.
2. Set `API_PROXY_TARGET=http://localhost:3000` in `client/.env`.
3. Start the database and apply migrations:

```sh
docker compose -f docker-compose-dev.yml up -d db
npm run db:migrate -w api
```

4. In one terminal, run `npm run dev:adfs`.
5. In another terminal, run `npm run dev` to start the client and API.

The host-side migration command uses the host database address from `api/.env`. For the full Docker setup instead, keep the Docker addresses and run migrations with `docker compose -f docker-compose-dev.yml run --rm migrate`.

Restart host processes after changing environment settings.

## Add API features and database changes

Use feature modules with controllers, services, and repositories. Controllers describe and validate requests; services implement business rules; repositories own database queries. Register new modules with the application module.

API routes require a token by default. Use `@Public()` for intentionally public endpoints and `@User()` to read the authenticated user. The current user DTO contains `id` and `username`; the guard derives both from the JWT username. The example users table is not consulted during login, so database-based account provisioning or account restrictions need project-specific implementation.

After editing the Drizzle schema:

```sh
npm run db:generate -w api
```

Review and commit the generated migration, then apply it to your development database. Docker startup applies committed migrations automatically.

After changing API endpoints or DTOs:

```sh
npm run generate
```

This exports OpenAPI and regenerates the Axios client and TanStack Query helpers. Commit `api/openapi.json` and `client/src/api/generated/`; edit the API definitions rather than the generated files.

Use `@/` aliases within each application. API ESM imports use `.js` extensions. Nest-injected dependencies and validated DTOs need runtime imports for decorator metadata.

## Everyday commands

Run these from the repository root unless a workspace is specified.

| Command                    | Purpose                                                   |
| -------------------------- | --------------------------------------------------------- |
| `npm run docker:dev`       | Build and start the complete development stack            |
| `npm run docker:down`      | Stop the development stack, preserving database data      |
| `npm run docker:logs`      | Follow development logs                                   |
| `npm run dev`              | Run client and API on the host; start the mock separately |
| `npm run typecheck`        | Check both workspaces                                     |
| `npm run lint`             | Check lint rules                                          |
| `npm run lint:work`        | Apply automatic lint fixes                                |
| `npm run format:check`     | Check formatting                                          |
| `npm run format:work`      | Apply formatting                                          |
| `npm run build`            | Build client and API                                      |
| `npm run generate`         | Regenerate OpenAPI and the frontend API client            |
| `npm run test:adfs`        | Run the mock provider tests                               |
| `npm run docker:prod`      | Build and start production Compose                        |
| `npm run docker:prod:down` | Stop production Compose                                   |
| `npm run docker:prod:logs` | Follow production logs                                    |

`npm run format` currently checks formatting, just like `format:check`. Use `format:work` to change files. VS Code's recommended ESLint and Prettier extensions provide formatting and fixes on save.

Root workspace tasks run through Turborepo. Use `npm run build -w api` or `npm run typecheck -w client` to target one workspace. Test runner scripts also exist for unit, end-to-end, and integration tests; add project tests as you build features. Runner configuration alone does not imply existing coverage.

## Logging and local endpoint testing

Rename `LOG_SERVICE_NAME` for each cloned project. `LOG_LEVEL` defaults to `info`; `LOG_FORMAT` defaults to readable output in development and ECS JSON in production. Set it explicitly to `pretty` or `ecs` if needed. ECS output can be collected by Elastic Agent/Filebeat; configure the collector separately.

Use Nest's contextual `Logger` in your services; the shared logging module forwards it to Winston. HTTP completion logs include status, duration, and request ID. Automatic HTTP logs omit headers, bodies, tokens, cookies, and query strings. Keep credentials and tokens out of custom log messages too. Extend logging in `api/src/common/logger.ts` and `logging.module.ts`.

For local endpoint testing, optionally set a private `DEV_MASTER_TOKEN` in `api/.env` and recreate the API container. Send it as `Authorization: Bearer <value>` or use Swagger's Authorize dialog. It bypasses the JWT guard only in `development`. It does not populate user claims, so endpoints requiring `@User()` or verified auth claims still need a real login token; token creation requires verified claims. Leave it unset for normal login testing.

## Deploy a cloned project

Production Compose starts PostgreSQL, migrations, the API, and the compiled frontend. It does **not** start the mock login service.

Before deploying:

1. Configure the real provider and its popup message as described above.
2. Configure production API settings: `NODE_ENV=production`, your public HTTPS `CLIENT_ORIGIN`, a private signing secret compatible with your provider, and the production `DATABASE_URL`.
3. Replace the example PostgreSQL credentials in `docker-compose.yml` and keep the connection URL consistent.
4. Supply production `VITE_API_URL` and `VITE_ADFS_LOGIN_URL` **when building the frontend**. These values are compiled into the browser bundle; restarting its static server does not change them.
5. Configure an HTTPS ingress to route `/api` to the API and other paths to the client. The static client server provides SPA fallback but does not proxy API requests.
6. Review migrations and configure database backups before starting the deployment.

The current client Dockerfile exposes a `VITE_API_URL` build argument, but not `VITE_ADFS_LOGIN_URL`, and local `.env` files are excluded from Docker builds. Add the login URL as a build argument/environment value in the Docker build stage and pass it through your deployment configuration before using a real provider in a Docker production build. Changing `client/.env` alone does not configure that image.

Run `npm run docker:prod` after configuring the build and environment. Default host ports are 3000 on loopback for the API and 8080 for the frontend. An ingress on the Compose network can use `api:3000` and `client:8080`. PostgreSQL is not published by production Compose.

When removing the mock entirely, remove `mock-adfs/`, its root npm scripts, its development Compose service, and the API service's `depends_on` entry for it. Keep the real provider URL configured for the frontend.

Choose a project license, update package metadata and deployment naming, and configure monitoring for your environment.
