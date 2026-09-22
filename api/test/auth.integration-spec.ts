import 'reflect-metadata';

import { randomUUID } from 'node:crypto';

import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import request from 'supertest';

import { ENV_KEYS } from '../src/envKeys.constants.js';

describe('PostgreSQL authentication lifecycle', () => {
  let app: NestExpressApplication;
  let database: import('../src/database/database.module.js').Database;
  const username = randomUUID();
  const origin = 'http://localhost:5173';
  beforeAll(async () => {
    process.env[ENV_KEYS.DATABASE_URL] =
      process.env[ENV_KEYS.TEST_DATABASE_URL];
    process.env[ENV_KEYS.CLIENT_ORIGIN] = origin;
    process.env[ENV_KEYS.JWT_ACCESS_SECRET] = 'a'.repeat(32);
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
    const adfsPath = '../dist/auth/adfs.service.js';
    const { AdfsService } = (await import(
      adfsPath
    )) as typeof import('../src/auth/adfs.service.js');
    jest.spyOn(app.get(AdfsService), 'getUser').mockResolvedValue({ username });
    setup(app);
    database = app.get(Database);
    await migrate(database.db, { migrationsFolder: 'drizzle' });
    await app.init();
  });
  afterAll(async () => {
    if (database) {
      await database.pool.query('DELETE FROM users WHERE username = $1', [
        username,
      ]);
    }

    await app?.close();
  });
  it('provisions, authenticates and blocks soft-deleted accounts', async () => {
    const agent = request.agent(app.getHttpServer());
    const initialLogin = await agent
      .post('/api/auth/login')
      .set('Origin', origin)
      .send({ adfsToken: 'integration-adfs-token' })
      .expect(200);
    expect(initialLogin.headers['set-cookie']).toBeUndefined();
    expect(Object.keys(initialLogin.body).sort()).toEqual([
      'accessToken',
      'user',
    ]);
    const profile = await agent
      .get('/api/auth/me')
      .set('Authorization', 'Bearer ' + initialLogin.body.accessToken)
      .expect(200);
    expect(profile.body.username).toBe(username);
    expect(Object.keys(profile.body).sort()).toEqual(['id', 'username']);
    const stored = await database.pool.query(
      'SELECT created_at, updated_at, deleted_at FROM users WHERE username = $1',
      [username],
    );
    expect(stored.rows[0].deleted_at).toBeNull();
    await agent
      .post('/api/auth/login')
      .set('Origin', origin)
      .send({ adfsToken: '   ' })
      .expect(400);
    await agent
      .get('/api/auth/me')
      .set('Authorization', 'Bearer tampered')
      .expect(401);
    const login = await agent
      .post('/api/auth/login')
      .set('Origin', origin)
      .send({ adfsToken: 'integration-adfs-token' })
      .expect(200);
    expect(login.body.user).toEqual(initialLogin.body.user);
    await database.pool.query(
      'UPDATE users SET deleted_at = now(), updated_at = now() WHERE id = $1',
      [login.body.user.id],
    );
    await agent
      .get('/api/auth/me')
      .set('Authorization', 'Bearer ' + login.body.accessToken)
      .expect(401);
    await agent
      .post('/api/auth/login')
      .set('Origin', origin)
      .send({ adfsToken: 'integration-adfs-token' })
      .expect(401);
  });
});
