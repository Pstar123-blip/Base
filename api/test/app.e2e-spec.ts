import 'reflect-metadata';

import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import { NestFactory } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import type { NestExpressApplication } from '@nestjs/platform-express';
import request from 'supertest';

import {
  ACCESS_TOKEN_KIND,
  JWT_AUDIENCE,
  JWT_ISSUER,
} from '../src/auth/auth.constants.js';
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
  it('returns request IDs on guard failures and unknown routes', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/auth/me?token=secret')
      .set('x-request-id', 'test-request-123')
      .expect(401);
    expect(response.headers['x-request-id']).toBe('test-request-123');
    const unknown = await request(app.getHttpServer())
      .get('/api/missing')
      .set('x-request-id', 'invalid id')
      .expect(404);
    expect(unknown.headers['x-request-id']).toMatch(/^[a-f0-9-]{36}$/);
  });
  it('protects private routes', async () => {
    await request(app.getHttpServer()).get('/api/auth/me').expect(401);
  });
  it('logs in and authenticates without a database connection', async () => {
    const login = await request(app.getHttpServer())
      .post('/api/auth/login')
      .set('Origin', 'http://localhost:5173')
      .send({ adfsToken: 'mock-adfs-token' })
      .expect(200);
    expect(login.body.accessToken).toEqual(expect.any(String));
    expect(login.headers['set-cookie']).toBeUndefined();
    const profile = await request(app.getHttpServer())
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${login.body.accessToken}`)
      .expect(200);
    expect(profile.body).toEqual({ id: 'mock.adfs', username: 'mock.adfs' });
  });
  it('rejects tampered tokens', async () => {
    await request(app.getHttpServer())
      .get('/api/auth/me')
      .set('Authorization', 'Bearer tampered')
      .expect(401);
  });
  it.each([
    { kind: ACCESS_TOKEN_KIND, username: 'mock.adfs', expiresIn: -1 },
    { kind: 'refresh', username: 'mock.adfs', expiresIn: 60 },
    { kind: ACCESS_TOKEN_KIND, username: '', expiresIn: 60 },
  ])('rejects invalid JWT claims: %s', async ({ expiresIn, ...claims }) => {
    const token = await app.get(JwtService).signAsync(
      { sub: 'mock.adfs', ...claims },
      {
        secret: process.env[ENV_KEYS.JWT_ACCESS_SECRET],
        issuer: JWT_ISSUER,
        audience: JWT_AUDIENCE,
        expiresIn,
      },
    );
    await request(app.getHttpServer())
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(401);
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
