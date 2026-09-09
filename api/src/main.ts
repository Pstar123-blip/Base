import 'reflect-metadata';

import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module.js';
import { createAppLogger } from './common/logger.js';
import { setup } from './setup.js';
const app = await NestFactory.create<NestExpressApplication>(AppModule, {
  logger: createAppLogger(),
});
const document = setup(app);
if (app.get(ConfigService).get('NODE_ENV') !== 'production')
  SwaggerModule.setup('api/docs', app, document);
await app.listen(app.get(ConfigService).getOrThrow<number>('PORT'), '0.0.0.0');
