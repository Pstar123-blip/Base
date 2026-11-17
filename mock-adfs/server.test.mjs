import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { once } from 'node:events';
import test from 'node:test';

import { createMockAdfsServer } from './server.mjs';

const secret = 'a'.repeat(32);
const withProvider = async (run) => {
  const server = createMockAdfsServer({ jwtSecret: secret });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const origin = `http://127.0.0.1:${server.address().port}`;
  const login = (
    credentials = { username: 'tester', password: 'private-password' },
  ) =>
    fetch(`${origin}/login`, {
      method: 'POST',
      headers: { Origin: origin, 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
  try {
    await run({ origin, login });
  } finally {
    server.closeAllConnections();
    await new Promise((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
  }
};

test('serves the external login form without query parameters', async () => {
  await withProvider(async ({ origin }) => {
    const response = await fetch(`${origin}/login`);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.match(html, /type="password"/);
    assert.match(
      html,
      /name="client-origin" content="http:\/\/localhost:5173"/,
    );
    assert.ok(!html.includes('__CLIENT_ORIGIN__'));
  });
});

test('issues a JWT signed with the shared secret and a five-minute expiry', async () => {
  await withProvider(async ({ login }) => {
    const response = await login();
    assert.equal(response.status, 200);
    const data = await response.json();
    assert.equal(data.success, true);
    const [header, payload, signature] = data.accessToken.split('.');
    assert.equal(JSON.parse(Buffer.from(header, 'base64url')).alg, 'HS256');
    assert.equal(
      signature,
      createHmac('sha256', secret)
        .update(`${header}.${payload}`)
        .digest('base64url'),
    );
    const claims = JSON.parse(Buffer.from(payload, 'base64url'));
    assert.equal(claims.username, 'tester');
    assert.equal(claims.exp - claims.iat, 300);
    assert.equal(claims.password, undefined);
    assert.equal(claims.iss, undefined);
    assert.equal(claims.aud, undefined);
  });
});

test('rejects blank credentials and does not expose a verification endpoint', async () => {
  await withProvider(async ({ origin, login }) => {
    assert.equal(
      (await login({ username: '', password: 'private' })).status,
      400,
    );
    assert.equal(
      (await login({ username: 'tester', password: '   ' })).status,
      400,
    );
    assert.equal(
      (await fetch(`${origin}/verify`, { method: 'POST' })).status,
      404,
    );
  });
});

test('requires an explicitly configured signing secret', () => {
  assert.throws(
    () => createMockAdfsServer({ jwtSecret: '' }),
    /JWT_ACCESS_SECRET/,
  );
});
/* global Buffer, fetch */
