import type { Server } from 'node:http';

export const startMockAdfs = async () => {
  const modulePath = '../../mock-adfs/server.mjs';
  const { createMockAdfsServer } = (await import(modulePath)) as {
    createMockAdfsServer: (options: { jwtSecret: string }) => Server;
  };
  const server = createMockAdfsServer({ jwtSecret: 'a'.repeat(32) });
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();

  if (!address || typeof address === 'string') {
    throw new Error('Missing mock provider port');
  }

  const origin = `http://127.0.0.1:${address.port}`;
  return {
    token: async (username = 'mock.adfs') => {
      const response = await fetch(`${origin}/login`, {
        method: 'POST',
        headers: { Origin: origin, 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password: 'mock-password' }),
      });

      if (!response.ok) {
        throw new Error('Mock provider login failed');
      }

      const data = (await response.json()) as { accessToken: string };
      return data.accessToken;
    },
    close: () =>
      new Promise<void>((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
        server.closeAllConnections();
      }),
  };
};
