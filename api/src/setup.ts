import { randomUUID } from 'node:crypto';

import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import type { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';

import { requestContext } from './common/logger.js';
import { ENV_KEYS } from './envKeys.constants.js';

export function setup(app: NestExpressApplication) {
  app.setGlobalPrefix('api');
  app.use(helmet());
  app.use(cookieParser());
  app.use((req: Request, res: Response, next: NextFunction) => {
    const requestId = randomUUID();
    const start = Date.now();
    res.setHeader('x-request-id', requestId);
    res.once('finish', () => {
      if (!res.locals.httpLoggerAttached) {
        new Logger('http').log({
          message: 'HTTP request completed',
          requestId,
          method: req.method,
          path: req.path,
          statusCode: res.statusCode,
          durationMs: Date.now() - start,
        });
      }
    });
    requestContext.run({ requestId }, next);
  });
  app.enableCors({
    origin: app.get(ConfigService).getOrThrow<string>(ENV_KEYS.CLIENT_ORIGIN),
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.enableShutdownHooks();
  return SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('Starter API')
      .setVersion('1.0')
      .addBearerAuth()
      .build(),
    { operationIdFactory: (_controller, method) => method },
  );
}
