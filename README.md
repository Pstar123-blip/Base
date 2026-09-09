# Full-stack starter

A strict TypeScript npm workspace with NestJS/Express, PostgreSQL/Drizzle, and React/Vite. Node 24 and Docker Compose are recommended.

## Start

```sh
npm ci
cp api/.env.example api/.env
cp client/.env.example client/.env
cp .env.example .env
npm run docker:dev
```

Open http://localhost:5173 and create an account. API documentation is at http://localhost:3000/api/docs. Development uses `docker-compose-dev.yml` with `api/Dockerfile.dev` and `client/Dockerfile.dev`. Production uses `docker-compose.yml` with the standard Dockerfiles. Development runs in Docker with `npm run docker:dev`; migrations run before the API starts and source changes reload automatically.

## Development environment

Use three env files: root `.env` for Compose/database settings, `api/.env` for backend settings, and `client/.env` for frontend settings. Copy the examples once; real env files are Git-ignored and excluded from Docker builds.

Development Compose loads all service environment settings through `env_file`, with no inline environment overrides: PostgreSQL uses root `.env`, the API and migration service use `api/.env`, and Vite uses `client/.env`.

The env files use Docker service addresses directly: API DATABASE_URL connects to `db:5432`, and client API_PROXY_TARGET is `http://api:3000`. Browser-facing values remain `CLIENT_ORIGIN=http://localhost:5173` and `VITE_API_URL=/api`. Keep API PORT=3000 aligned with the Compose port mapping and proxy target.

Keep POSTGRES_USER, POSTGRES_PASSWORD and POSTGRES_DB in root `.env` consistent with DATABASE_URL in `api/.env`. PostgreSQL initialization settings apply only to a new database volume; changing credentials for an existing database requires updating PostgreSQL itself.

Only VITE_ variables are exposed to browser code. Running the API or Vite directly on the host requires changing the Docker service addresses to localhost. Database commands run inside Docker by default; to apply migrations manually, use `docker compose -f docker-compose-dev.yml run --rm migrate`.

After editing an env file, rerun `npm run docker:dev` to recreate affected containers; restarting an existing container does not reload its environment. Restart host-run processes after editing their environment.

Production uses the same env-file paths with deployment-specific contents: root `.env` for PostgreSQL and `api/.env` for the API and migrations. Neither Compose file overrides environment values. The production client is static nginx output; VITE_ values are build-time configuration, so passing `client/.env` to nginx would not configure the compiled client.

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

## API conventions

Use a feature module with controller → service → repository. Controllers validate DTOs and describe responses using Swagger decorators; services implement business rules; repositories own Drizzle queries. Explicit SQL names are snake_case while TypeScript properties use camelCase. Users have createdAt, updatedAt and deletedAt. Soft-deleted users cannot authenticate; unique emails remain reserved. Drizzle's updatedAt callback applies to ORM updates; raw SQL writers must set updated_at themselves.

Every route requires a valid access token unless marked `@Public()`. `@User()` supplies a safe user DTO. `@Permissions('users:read')` checks current database permissions on every request. Add role and role-permission tables when the domain needs roles; never trust client-side permission checks. Registration grants no permissions.

Access JWTs expire in 15 minutes and live only in client memory. Refresh JWTs expire in seven days, are stored in a Strict HttpOnly cookie, and are hashed in the database. Rotation atomically consumes the old session, so a refresh token can only be used once. Logout revokes the refresh session; issued access tokens remain valid until expiry. Cookie-writing auth endpoints require the configured Origin header. Production cookies require HTTPS. Expired session records should be periodically purged.

Winston handles Nest application logs and HTTP logs through the nest-winston adapter. Logs use JSON with timestamp, level, service and requestId; HTTP logs also include method, path, statusCode and durationMs. HTTP fields are top-level for log queries. The default threshold is info, with error/fatal output on stderr and other levels on stdout. Configure levels and transports in `api/src/common/logger.ts`. Request IDs are generated server-side and returned as x-request-id. Credentials, cookies, authorization headers and query strings are not logged. `/api/health` is liveness, not database readiness.

## Client conventions

Material UI's centralized theme and CssBaseline wrap TanStack Router and Query. The route tree separates login from the authenticated layout and supplies pending, error and 404 views. Zustand holds ephemeral session/UI state; Query owns server state; React Hook Form owns forms.

Generate contracts after changing API DTOs. Commit `api/openapi.json` and `client/src/api/generated`; do not edit generated files. Generated hooks use the central Axios mutator, including AbortSignal cancellation. Query defaults avoid retries for 4xx errors, retry transient failures twice, and report errors centrally. Mutations do not retry automatically. In mutation `onSuccess`, invalidate the affected generated query key (for example `queryClient.invalidateQueries({queryKey: getMeQueryKey()})`). Parameterized keys must include filters and pagination; use generated key helpers where available.

`DataTable` supports sorting, filtering, pagination, visibility and selection. Pass stable row IDs. To paginate remotely, pass `serverPagination: {state, onChange, rowCount}` and fetch using that state in the query key. Sorting and filtering currently apply to the loaded page in remote mode; add validated API sort/filter parameters and controlled table state when implementing a domain list endpoint.

## Production and forks

`npm run docker:down` and `npm run docker:logs` target development; use `docker:prod:down` and `docker:prod:logs` for production.

On the deployment host, copy root `.env.example` to `.env` and `api/.env.example` to `api/.env`. Set database credentials in root `.env`. In `api/.env`, set NODE_ENV=production, PORT=3000, a matching DATABASE_URL, independent random JWT secrets, and CLIENT_ORIGIN to the public HTTPS origin. These files belong to that deployment; do not reuse the development values for production. Run `npm run docker:prod`. Put a TLS-terminating ingress in front of port 8080. nginx serves the SPA and proxies /api to the private API. PostgreSQL is not exposed by production Compose. Migrations run as a one-off service before startup; back up the database and review migrations before deploying schema changes.

For a fork, rename workspace/image names, choose a license, customize the theme and application identity, decide whether public registration is appropriate, and configure backups and monitoring. Add distributed rate limiting at your ingress before exposing authentication publicly.

Patched transitive dependency overrides are recorded at the root for Multer, js-yaml 4.x and Drizzle Kit’s older esbuild helper. Reassess them when upgrading those parent packages; generation, builds and tests cover the overrides.

ADFS is intentionally an extension point, not a configured provider. A real integration needs tenant metadata, client credentials, callback URLs and an identity-to-local-user mapping. Implement the authorization-code flow with PKCE in a separate auth provider module; map identities to local users and reuse application session issuance. Do not put identity-provider secrets in Vite environment variables.

## Testing

Unit tests cover environment validation, password hashing, authentication rotation and client behavior. Run `npm run test:e2e` for HTTP guard, validation, origin and security-header checks without a database. Run `TEST_DATABASE_URL=postgres://... npm run test:integration` against a disposable database for migration and full authentication lifecycle coverage. Integration tests apply migrations and clean up only the randomly named user they create. CI supplies PostgreSQL and runs all suites, generated-contract checks, types, lint, formatting and builds. Add repository and browser tests as your domain grows.

Reference documentation: [Nest authentication](https://docs.nestjs.com/security/authentication), [Orval React Query generation](https://orval.dev/docs/guides/react-query/), [Drizzle](https://orm.drizzle.team/).
