import 'reflect-metadata';

import { writeFile } from 'node:fs/promises';

import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
process.env.DATABASE_URL ??= 'postgres://unused:unused@localhost/unused';
process.env.JWT_ACCESS_SECRET ??= 'openapi-generation-only-access-secret';
process.env.JWT_REFRESH_SECRET ??= 'openapi-generation-only-refresh-secret';
process.env.CLIENT_ORIGIN ??= 'http://localhost:5173';
const { AppModule } = await import('./app.module.js');
const { setup } = await import('./setup.js');
const app = await NestFactory.create<NestExpressApplication>(AppModule, {
  logger: false,
});
await writeFile('openapi.json', JSON.stringify(setup(app), null, 2) + '\n');
await app.close();
