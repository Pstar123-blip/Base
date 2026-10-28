import { createHmac } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { pathToFileURL } from 'node:url';

const TOKEN_TTL_SECONDS = 5 * 60;
const MAX_BODY_BYTES = 16_384;

export const createMockAdfsServer = ({
  clientOrigin = 'http://localhost:5173',
  now = Date.now,
  jwtSecret = process.env.JWT_ACCESS_SECRET,
} = {}) => {
  if (typeof jwtSecret !== 'string' || jwtSecret.length < 32) {
    throw new Error(
      'JWT_ACCESS_SECRET must match the main API secret and have at least 32 characters',
    );
  }
  const signToken = (username) => {
    const issuedAt = Math.floor(now() / 1000);
    const header = Buffer.from(
      JSON.stringify({ alg: 'HS256', typ: 'JWT' }),
    ).toString('base64url');
    const payload = Buffer.from(
      JSON.stringify({
        username,
        iat: issuedAt,
        exp: issuedAt + TOKEN_TTL_SECONDS,
      }),
    ).toString('base64url');
    const data = `${header}.${payload}`;
    const signature = createHmac('sha256', jwtSecret)
      .update(data)
      .digest('base64url');
    return `${data}.${signature}`;
  };
  const json = (response, status, body) => {
    response.writeHead(status, {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    });
    response.end(JSON.stringify(body));
  };
  const body = async (request) => {
    let data = '';
    for await (const chunk of request) {
      data += chunk;
      if (Buffer.byteLength(data) > MAX_BODY_BYTES)
        throw new Error('Body too large');
    }
    return JSON.parse(data);
  };

  return createServer(async (request, response) => {
    const url = new URL(request.url ?? '/', 'http://localhost');
    try {
      if (request.method === 'GET' && url.pathname === '/health') {
        json(response, 200, { status: 'ok' });
        return;
      }
      if (request.method === 'GET' && url.pathname === '/login') {
        response.writeHead(200, {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-store',
          'Content-Security-Policy':
            "default-src 'self'; script-src 'self'; style-src 'self'; form-action 'self'; frame-ancestors 'none'",
          'Referrer-Policy': 'no-referrer',
        });
        const html = await readFile(
          new URL('./login.html', import.meta.url),
          'utf8',
        );
        const escapedOrigin = clientOrigin
          .replaceAll('&', '&amp;')
          .replaceAll('"', '&quot;')
          .replaceAll('<', '&lt;')
          .replaceAll('>', '&gt;');
        response.end(html.replace('__CLIENT_ORIGIN__', escapedOrigin));
        return;
      }
      if (
        request.method === 'GET' &&
        ['/login.js', '/login.css'].includes(url.pathname)
      ) {
        response.writeHead(200, {
          'Content-Type': url.pathname.endsWith('.js')
            ? 'text/javascript'
            : 'text/css',
          'Cache-Control': 'no-store',
        });
        response.end(
          await readFile(new URL(`.${url.pathname}`, import.meta.url)),
        );
        return;
      }
      if (request.method === 'POST' && url.pathname === '/login') {
        // Credentials are posted to this service from its own page.
        const requestOrigin = request.headers.origin;
        if (
          !requestOrigin ||
          new URL(requestOrigin).host !== request.headers.host
        ) {
          json(response, 403, { message: 'Untrusted origin' });
          return;
        }
        const { username, password } = await body(request);
        if (
          typeof username !== 'string' ||
          !username.trim() ||
          typeof password !== 'string' ||
          !password.trim()
        ) {
          json(response, 400, {
            message: 'Username and password are required',
          });
          return;
        }
        const accessToken = signToken(username.trim());
        json(response, 200, { success: true, accessToken });
        return;
      }
      json(response, 404, { message: 'Not found' });
    } catch {
      json(response, 400, { message: 'Invalid request' });
    }
  });
};

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const port = Number(process.env.MOCK_ADFS_PORT ?? 4000);
  const server = createMockAdfsServer({
    clientOrigin: process.env.CLIENT_ORIGIN,
  });
  server.listen(port, '0.0.0.0', () => {
    console.log(`Mock ADFS listening on port ${port}`);
  });
}
/* global Buffer, console, process, URL */
