# Mock external ADFS service

This standalone Node service hosts the mock identity-provider popup on port 4000. It has no dependency on the main API and does not need npm packages or a database.

From the repository root, run `npm run dev:adfs`. It loads the same `api/.env` as the main API. Development Compose starts it automatically and shares that env file.

Configuration:

- `MOCK_ADFS_PORT`: listening port, default `4000`.
- `JWT_ACCESS_SECRET`: must match the main API; it stays server-side.
- `CLIENT_ORIGIN`: allowed opener origin, default `http://localhost:5173`.

`GET /login` serves the username/password form. `POST /login` accepts any nonblank credentials and returns `{ success: true, accessToken }`. The page sends the token to its opener as `{ user: { token: accessToken } }.

Provider tokens are HS256 JWTs with a username and five-minute expiration. The main API's normal JWT guard accepts them because it uses the same signing secret. The frontend sends the JWT in the bearer header to `POST /api/auth/create-token`, then replaces it with the returned one-day application token. There is no provider verification endpoint or server-side token store. Issuer and audience are not included or required.

This service is a local development mock. Do not deploy it as a real credentials provider.

Run `npm run test:adfs` from the repository root to check shared-secret JWT signatures, expiration, and login-page origin checks.
