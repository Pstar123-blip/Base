import 'reflect-metadata';

import { randomUUID } from 'node:crypto';

import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { ENV_KEYS } from '../src/envKeys.constants.js';

describe('PostgreSQL authentication lifecycle', () => {
  let app: NestExpressApplication;
  let database: import('../src/database/database.module.js').Database;
  const email = randomUUID() + '@example.com';
  const password = 'integration-test-password';
  const origin = 'http://localhost:5173';
  beforeAll(async () => {
    process.env[ENV_KEYS.DATABASE_URL] =
      process.env[ENV_KEYS.TEST_DATABASE_URL];
    process.env[ENV_KEYS.CLIENT_ORIGIN] = origin;
    process.env[ENV_KEYS.JWT_ACCESS_SECRET] = 'a'.repeat(32);
    process.env[ENV_KEYS.JWT_REFRESH_SECRET] = 'b'.repeat(32);
    const appPath = '../dist/app.module.js',
      setupPath = '../dist/setup.js',
      dbPath = '../dist/database/database.module.js';
    const { AppModule } = (await import(
      appPath
    )) as typeof import('../src/app.module.js');
    const { setup } = (await import(
      setupPath
    )) as typeof import('../src/setup.js');
    const { Database } = (await import(
      dbPath
    )) as typeof import('../src/database/database.module.js');
    app = await NestFactory.create<NestExpressApplication>(AppModule, {
      logger: false,
    });
    setup(app);
    database = app.get(Database);
    await migrate(database.db, { migrationsFolder: 'drizzle' });
    await app.init();
  });
  afterAll(async () => {
    if (database) {
      await database.pool.query('DELETE FROM users WHERE email = $1', [email]);
    }

    await app?.close();
  });
  it('registers, authenticates, rotates once, logs out and blocks soft-deleted accounts', async () => {
    const agent = request.agent(app.getHttpServer());
    const registration = await agent
      .post('/api/auth/register')
      .set('Origin', origin)
      .send({ email, password })
      .expect(200);
    const originalCookie = registration.headers['set-cookie']?.[0];
    expect(originalCookie).toContain('HttpOnly');
    expect(originalCookie).toContain('SameSite=Strict');
    const profile = await agent
      .get('/api/auth/me')
      .set('Authorization', 'Bearer ' + registration.body.accessToken)
      .expect(200);
    expect(profile.body.email).toBe(email);
    expect(profile.body.passwordHash).toBeUndefined();
    expect(profile.body.permissions).toEqual([]);
    const stored = await database.pool.query(
      'SELECT password_hash, created_at, updated_at, deleted_at FROM users WHERE email = $1',
      [email],
    );
    expect(stored.rows[0].password_hash).not.toBe(password);
    expect(stored.rows[0].deleted_at).toBeNull();
    await agent
      .post('/api/auth/register')
      .set('Origin', origin)
      .send({ email, password })
      .expect(409);
    await agent
      .post('/api/auth/login')
      .set('Origin', origin)
      .send({ email, password: 'incorrect-password' })
      .expect(401);
    await agent
      .get('/api/auth/me')
      .set('Authorization', 'Bearer tampered')
      .expect(401);
    const rotated = await agent
      .post('/api/auth/refresh')
      .set('Origin', origin)
      .expect(200);
    await request(app.getHttpServer())
      .post('/api/auth/refresh')
      .set('Origin', origin)
      .set('Cookie', originalCookie!)
      .expect(401);
    await agent
      .get('/api/auth/me')
      .set('Authorization', 'Bearer ' + rotated.body.accessToken)
      .expect(200);
    await agent.post('/api/auth/logout').set('Origin', origin).expect(204);
    await agent.post('/api/auth/refresh').set('Origin', origin).expect(401);
    const login = await agent
      .post('/api/auth/login')
      .set('Origin', origin)
      .send({ email, password })
      .expect(200);
    await database.pool.query(
      'UPDATE users SET deleted_at = now(), updated_at = now() WHERE email = $1',
      [email],
    );
    await agent
      .get('/api/auth/me')
      .set('Authorization', 'Bearer ' + login.body.accessToken)
      .expect(401);
    await agent.post('/api/auth/refresh').set('Origin', origin).expect(401);
  });
});
