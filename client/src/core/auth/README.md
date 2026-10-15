# Authentication

To use another provider, change `VITE_ADFS_LOGIN_URL` in `client/.env` and restart Vite.

The provider page must send the same message as the mock:

```js
window.opener.postMessage(
  { user: { token: providerJwt } },
  parentOrigin,
);
```

The popup opens the configured URL unchanged, without adding query parameters. Configure the provider's target origin to match the frontend origin. The provider JWT must use the same server-side signing secret as the API.

Follow the code in this order:

1. `require-session.ts`: the router checks whether sign-in is needed.
2. `auth.ts`: waits for sign-in, shares concurrent requests, and retries twice.
3. `use-login-popup.ts`: opens the external URL, handles its message, and cleans up.
4. `services/auth-service.ts`: temporarily stores the provider JWT, calls the main API, and saves the application JWT. On failure it clears its temporary token.

`components/sign-in-status.tsx` only displays progress and the blocked-popup fallback. All credentials UI is hosted by the external provider.
