import 'reflect-metadata';

import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
describe('HTTP boundary', () => {
  let app: NestExpressApplication;
  beforeAll(async () => {
    process.env.DATABASE_URL = 'postgres://unused:unused@localhost/unused';
    process.env.CLIENT_ORIGIN = 'http://localhost:5173';
    process.env.JWT_ACCESS_SECRET = 'a'.repeat(32);
    process.env.JWT_REFRESH_SECRET = 'b'.repeat(32);
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
  it('serves public health with security headers', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/health')
      .expect(200);
    expect(response.body).toEqual({ status: 'ok' });
    expect(response.headers['x-request-id']).toBeTruthy();
    expect(response.headers['x-content-type-options']).toBe('nosniff');
  });
  it('protects private routes', async () => {
    await request(app.getHttpServer()).get('/api/auth/me').expect(401);
  });
  it('validates DTOs before database access', async () => {
    await request(app.getHttpServer())
      .post('/api/auth/login')
      .set('Origin', 'http://localhost:5173')
      .send({ email: 'invalid', password: 'short', unexpected: true })
      .expect(400);
  });
  it('rejects cross-origin session requests', async () => {
    await request(app.getHttpServer())
      .post('/api/auth/refresh')
      .set('Origin', 'https://untrusted.example')
      .expect(403);
  });
});
