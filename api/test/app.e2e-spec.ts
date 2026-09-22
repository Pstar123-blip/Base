import 'reflect-metadata';

import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import request from 'supertest';

import { ENV_KEYS } from '../src/envKeys.constants.js';

describe('HTTP boundary', () => {
  let app: NestExpressApplication;
  beforeAll(async () => {
    process.env[ENV_KEYS.DATABASE_URL] =
      'postgres://unused:unused@localhost/unused';
    process.env[ENV_KEYS.CLIENT_ORIGIN] = 'http://localhost:5173';
    process.env[ENV_KEYS.JWT_ACCESS_SECRET] = 'a'.repeat(32);
    const modulePath = '../dist/app.module.js';
    const { AppModule } = (await import(
      modulePath
    )) as typeof import('../src/app.module.js');
    const setupPath = '../dist/setup.js';
    const { setup } = (await import(
      setupPath
    )) as typeof import('../src/setup.js');
    app = await NestFactory.create<NestExpressApplication>(AppModule, {
      logger: false,
    });
    setup(app);
    await app.init();
  });
  afterAll(async () => {
    await app?.close();
  });
  it('includes security headers on protected routes', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/auth/me')
      .expect(401);
    expect(response.headers['x-content-type-options']).toBe('nosniff');
  });
  it('protects private routes', async () => {
    await request(app.getHttpServer()).get('/api/auth/me').expect(401);
  });
  it('validates DTOs before database access', async () => {
    await request(app.getHttpServer())
      .post('/api/auth/login')
      .set('Origin', 'http://localhost:5173')
      .send({ adfsToken: 'token', unexpected: true })
      .expect(400);
  });
  it.each([undefined, '', '   ', 123])(
    'rejects missing or blank ADFS tokens: %s',
    async (adfsToken) => {
      await request(app.getHttpServer())
        .post('/api/auth/login')
        .set('Origin', 'http://localhost:5173')
        .send({ adfsToken })
        .expect(400);
    },
  );
  it('rejects cross-origin login requests', async () => {
    await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ adfsToken: 'token' })
      .set('Origin', 'https://untrusted.example')
      .expect(403);
  });
});
