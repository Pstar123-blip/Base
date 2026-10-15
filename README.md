# Full-stack app

A strict TypeScript npm workspace orchestrated by Turborepo with NestJS/Express, PostgreSQL/Drizzle, and React/Vite. Node 24 and Docker Compose are recommended.

## Start

```sh
npm ci
cp api/.env.example api/.env
cp client/.env.example client/.env
npm run docker:dev
```

Open http://localhost:5173. The sign-in effect opens the separate mock ADFS service at `http://localhost:4000/login`. Use any nonblank username and password. The popup opens automatically. If the browser blocks it, allow popups for this site; the app retries opening automatically. Development Compose starts the mock, database, API and client together; migrations run before the API starts. API documentation is at http://localhost:3000/api/docs.

For host development, run `npm run dev:adfs` in a separate terminal alongside the API and client. The mock has no npm dependencies. See [mock-adfs/README.md](mock-adfs/README.md).

- Frontend: `VITE_ADFS_LOGIN_URL=http://localhost:4000/login` chooses the external popup page.
- Shared signing secret: the main API and mock ADFS both load `JWT_ACCESS_SECRET` from `api/.env`. It is never exposed to the frontend.
- Mock: `CLIENT_ORIGIN=http://localhost:5173` restricts its opener. Keep this aligned with the frontend origin.

Changing the frontend provider requires changing `VITE_ADFS_LOGIN_URL` while preserving the popup message contract. The real provider must sign its JWT with the same server-side `JWT_ACCESS_SECRET` as the main API. There are no issuer or audience requirements and no provider verification URL. Production does not start the mock.
## Development environment

Use two env files: `api/.env` for backend settings, including the database connection URL, and `client/.env` for frontend settings. Copy the examples once; real env files are Git-ignored and excluded from Docker builds.

Development Compose loads `api/.env` for the API and migration service, and `client/.env` for Vite. PostgreSQL initialization settings are defined directly in the `db.environment` section of `docker-compose-dev.yml`: `POSTGRES_USER=user`, `POSTGRES_PASSWORD=password`, and `POSTGRES_DB=app`.

The env files use Docker service addresses directly: API DATABASE_URL connects to `db:5432`, and client API_PROXY_TARGET is `http://api:3000`. Browser-facing values remain `CLIENT_ORIGIN=http://localhost:5173` and `VITE_API_URL=/api`. Keep API PORT=3000 aligned with the Compose port mapping and proxy target.

Keep POSTGRES_USER, POSTGRES_PASSWORD and POSTGRES_DB in the Docker Compose files consistent with DATABASE_URL in `api/.env`. PostgreSQL initialization settings apply only to a new database volume; changing credentials for an existing database requires updating PostgreSQL itself.

Only VITE_ variables are exposed to browser code. Running the API or Vite directly on the host requires changing the Docker service addresses to localhost. Database commands run inside Docker by default; to apply migrations manually, use `docker compose -f docker-compose-dev.yml run --rm migrate`.

After editing an env file, rerun `npm run docker:dev` to recreate affected containers; restarting an existing container does not reload its environment. Restart host-run processes after editing their environment.

Production loads `api/.env` for the API and migrations. PostgreSQL initialization settings are defined directly in the `db.environment` section of `docker-compose.yml`. The client uses `serve` through its preview script to serve the compiled build on port 8080 with SPA fallback. VITE_ values remain build-time configuration; the static server does not load `client/.env` or proxy API requests. Route `/api` to the API through your deployment ingress.

## Commands

| Command                                                     | Purpose                                                                            |
| ----------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `npm run docker:dev`                                        | API, client and PostgreSQL in Docker with watch mode                               |
| `npm run build`                                             | Production builds                                                                  |
| `npm run typecheck`                                         | Strict checks across workspaces                                                    |
| `npm run lint`                                              | ESLint and consistent import ordering                                              |
| `npm run format` / `format:check`                           | Prettier                                                                           |
| `npm test`                                                  | API and client unit tests                                                          |
| `npm run generate`                                          | Export OpenAPI without a database connection; generate Axios types and Query hooks |
| `npm run db:generate -w api`                                | Generate a migration after editing the schema                                      |
| `docker compose -f docker-compose-dev.yml run --rm migrate` | Apply committed migrations in Docker                                               |
| `npm run docker-build`                                      | Build production images                                                            |
| `npm run docker:prod`                                       | Start production Compose                                                           |

Each workspace also exposes its own lint, format and typecheck scripts. Both workspaces expose Docker build scripts. Use `@/` aliases within applications. Nest constructor dependencies and validated DTOs need runtime imports; the API disables the type-import autofix rule to preserve decorator metadata. API ESM imports include `.js`; the build rewrites aliases for Node.

## Editor formatting

Install the recommended VS Code extensions, ESLint (`dbaeumer.vscode-eslint`) and Prettier (`esbenp.prettier-vscode`). Workspace settings apply ESLint fixes and Prettier formatting on save. ESLint requires braces around control-flow bodies and blank lines between definitions, class members, and blocks. Prettier handles indentation and layout.

Run `npm run format` to apply the same rules throughout the repository. CI checks the rules with `npm run lint` and `npm run format:check`.

## Turborepo

Root `dev`, `build`, `typecheck`, `lint`, `test`, `generate`, `test:e2e`, `test:integration`, and `docker-build` commands run through Turborepo. `npm run dev` starts both applications on the host; configure localhost addresses as described above. Compose and repository-wide formatting commands remain direct commands.

`turbo.json` defines the task graph. API builds cache `dist/`; typechecks, lint and unit tests cache successful results. Shared TypeScript/ESLint configuration invalidates caches. Client builds run uncached because Vite loads local environment files that Turbo does not track. Local cache files live in `.turbo/` and are ignored by Git and Docker.

Generation runs API OpenAPI export before client generation. Generation, end-to-end tests, database integration tests, and Docker builds always execute; development tasks are persistent and uncached. `TEST_DATABASE_URL` is explicitly passed through for integration tests.

Use `npm run build -- --filter=api` to build only the API, or `npx turbo run build --dry` to inspect the task graph. Workspace commands such as `npm run build -w api` still work directly. See the [Turborepo task configuration documentation](https://turborepo.com/docs/crafting-your-repository/configuring-tasks).

## API conventions

Use a feature module with controller → service → repository. Controllers validate DTOs and describe responses using Swagger decorators; services implement business rules; data-specific repositories own all database queries. Services and controllers must use repositories rather than accessing the database directly. Explicit SQL names are snake_case while TypeScript properties use camelCase. Users have createdAt, updatedAt and deletedAt. Soft-deleted users cannot authenticate; unique usernames remain reserved. Drizzle's updatedAt callback applies to ORM updates; raw SQL writers must set updated_at themselves.

Every route requires a valid access token unless marked `@Public()`. `@User()` supplies a safe user DTO. Public user objects contain only `id` and `username`.

Access JWTs expire in one day and are persisted in local storage. Unauthorized responses clear the client token and require a new sign-in. Logout clears the local token; issued access tokens remain valid until expiry. Login requires the configured Origin header.

For local endpoint testing, set `DEV_MASTER_TOKEN` in `api/.env` and restart the API (recreate the container when using Compose). With `NODE_ENV=development`, send `Authorization: Bearer <DEV_MASTER_TOKEN>` or paste the token into Swagger's Authorize dialog. Requests authenticate as `{ "id": "dev", "username": "dev" }` without logging in. This token is disabled when unset and is never accepted in test or production environments.

Winston handles Nest startup, application, error and HTTP logs through one shared `LoggingModule` and the nest-winston adapter. Console logs default to readable pretty output in development/test and Elastic Common Schema (ECS) JSON in production. Set `LOG_FORMAT=pretty` or `LOG_FORMAT=ecs` to override. Pretty output includes timestamp, level, context, request ID, metadata and error stacks; colors are enabled for interactive terminals. Use `LOG_FORMAT=ecs` when Elastic Agent/Filebeat collects stdout/stderr. This configures the log format; configure the collector separately to send logs to Elasticsearch. Set `LOG_LEVEL` (default `info`) and `LOG_SERVICE_NAME` (default `api`) in `api/.env`; rename the service when cloning this base. Supported thresholds are `fatal`, `error`, `warn`, `info`, `http`, `verbose`, `debug`, and `silly`. Error/fatal logs go to stderr; other levels go to stdout, suitable for Docker log collection.

Every completed HTTP response is logged once, including guard failures and unknown routes. Responses return `x-request-id`; safe incoming IDs (1?128 letters, digits, underscores or hyphens) are reused, otherwise a UUID is generated. The same `http.request.id` accompanies logs written during the request. Completion logs include method, path, status and duration in nanoseconds; 4xx responses use warn and 5xx responses use error. Headers, bodies, tokens, cookies and query strings are omitted from automatic HTTP logs.

For new services, use Nest's contextual logger; it forwards to the shared Winston instance:

```ts
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  create() {
    this.logger.log({ message: 'Order created', orderId: 'example-id' });
    this.logger.debug('Additional diagnostic details');
  }
}
```

Use `logger.error(error)` for an Error object or `logger.error('Operation failed', error.stack)` for an explicit message and stack. Never put credentials or personal data in messages or metadata; automatic HTTP omissions do not sanitize custom messages. Auth logs record outcomes without identities or tokens, and the database pool reports unexpected idle connection errors. Extend formats and transports in `api/src/common/logger.ts`; module configuration lives in `api/src/common/logging.module.ts`. Custom transports receive ECS JSON by default, so you can use `createPrettyFormat()` on a console transport and an ECS file/remote transport simultaneously. File or remote transports can be added there when a cloned project's deployment requires them. See the [Winston documentation](https://github.com/winstonjs/winston) and [Nest adapter documentation](https://github.com/gremo/nest-winston).


## Client conventions

For the authentication flow and provider URL setting, see [core/auth/README.md](client/src/core/auth/README.md).

Material UI's centralized theme and CssBaseline wrap TanStack Router and Query. The root route protects every path except `/unauthorized`. If a completed application token is already stored, authentication proceeds without calling `/auth/me`; the server guard checks it when API requests are made. If there is no token, `useLoginPopup` opens `VITE_ADFS_LOGIN_URL` and listens for a correlated message inside `useEffect`. The effect stores the signed ADFS JWT temporarily, and Axios attaches it as a bearer header to `POST /api/auth/create-token`. This endpoint is protected by the same JWT guard, which validates the shared-secret signature and expiration. The API then issues an application JWT with its own one-day lifetime; this replaces the ADFS JWT in local storage. No separate provider verification request is made. Popup or exchange failure restarts the whole process, with an initial attempt plus two retries; after exhaustion, `/unauthorized` offers a Relogin button. Cleanup cancels pending work and removes listeners, timers, and the popup. The dashboard may still call `/auth/me` to load account display data; that is separate from session authentication.

Session persistence records `tokenStage` alongside the token. A saved provider token means exchange was interrupted, so a reload clears it and restarts sign-in. Successful exchange marks the application token as complete. The auth service owns token exchange and storage; the popup hook owns the window and message listener, while the component renders its status and buttons. A 401 clears the session only when the failed request used the currently stored token, preserving newer logins when older requests finish late.

The configured external URL is opened unchanged. The mock uses its server-side `CLIENT_ORIGIN` setting as the message target origin. After authenticating and obtaining a provider token, it sends this message to the opener, using the specific application origin as `targetOrigin`:

```js
window.opener.postMessage(
  { user: { token: accessToken } },
  parentOrigin,
);
```

An unsuccessful result omits the token. The parent checks that the message comes from the popup window it opened. The main API JWT guard verifies the provider token signature and expiration using the shared secret.

Generate contracts after changing API DTOs. Commit `api/openapi.json` and `client/src/api/generated`; do not edit generated files. Generated hooks use the central Axios mutator, including AbortSignal cancellation. Query defaults avoid retries for 4xx errors, retry transient failures twice, and report errors centrally. Mutations do not retry automatically. In mutation `onSuccess`, invalidate the affected generated query key (for example `queryClient.invalidateQueries({queryKey: getMeQueryKey()})`). Parameterized keys must include filters and pagination; use generated key helpers where available.

`DataTable` supports sorting, filtering, pagination, visibility and selection. Pass stable row IDs. To paginate remotely, pass `serverPagination: {state, onChange, rowCount}` and fetch using that state in the query key. Sorting and filtering currently apply to the loaded page in remote mode; add validated API sort/filter parameters and controlled table state when implementing a domain list endpoint.

## Production and forks

`npm run docker:down` and `npm run docker:logs` target development; use `docker:prod:down` and `docker:prod:logs` for production.

On the deployment host, copy `api/.env.example` to `api/.env`. Set POSTGRES_USER, POSTGRES_PASSWORD and POSTGRES_DB in the `db.environment` section of `docker-compose.yml`. In `api/.env`, set NODE_ENV=production, PORT=3000, DATABASE_URL to match those PostgreSQL settings, JWT_ACCESS_SECRET to a unique random secret, and CLIENT_ORIGIN to the public HTTPS origin. These files belong to that deployment; do not reuse the development values for production. Run `npm run docker:prod`. Configure a TLS-terminating ingress to route `/api` to the API at host port 3000 and all other paths to the client at port 8080. The API port is bound to host loopback for the ingress; an ingress on the Compose network can use `api:3000` and `client:8080` directly. `serve` handles static assets and SPA routes. PostgreSQL is not exposed by production Compose. Migrations run as a one-off service before startup; back up the database and review migrations before deploying schema changes.

For a fork, rename workspace/image names, choose a license, customize the theme and application identity, decide whether public registration is appropriate, and configure backups and monitoring. Add distributed rate limiting at your ingress before exposing authentication publicly.

Patched transitive dependency overrides are recorded at the root for Multer, js-yaml 4.x and Drizzle Kit’s older esbuild helper. Reassess them when upgrading those parent packages; generation, builds and tests cover the overrides.

`POST /api/auth/create-token` takes no token request body. It requires `Authorization: Bearer <ADFS JWT>`; the JWT guard verifies the signature with `JWT_ACCESS_SECRET` and passes the verified identity to token issuance. The API issues its own one-day JWT, preserving identity fields while replacing upstream JWT timestamps. The separate `mock-adfs/` service signs five-minute HS256 JWTs with the same secret. It accepts any nonblank credentials and stores no passwords or database users. Its JWTs are accepted by the API guard just like application JWTs; there is no `/verify` endpoint, replay store, issuer/audience check, or token-kind discriminator.

## Testing

Client tests cover the external popup effect, popup-source checks, blocked and closed windows, timeouts, StrictMode cleanup, route cancellation, and protection at the root route. Run `npm run test:adfs` for provider JWT signing, expiration and login-origin checks. Run `npm run test:e2e` for the live provider-to-API token exchange, HTTP guard, validation, origin and security-header checks without a database. Run `TEST_DATABASE_URL=postgres://... npm run test:integration` against a disposable database for migration and authentication coverage; it verifies that login does not create a user. CI supplies PostgreSQL and runs all suites, generated-contract checks, types, lint, formatting and builds. Add repository and browser tests as your domain grows.

Reference documentation: [Nest authentication](https://docs.nestjs.com/security/authentication), [Orval React Query generation](https://orval.dev/docs/guides/react-query/), [Drizzle](https://orm.drizzle.team/).
