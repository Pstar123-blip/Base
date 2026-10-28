import { randomUUID } from 'node:crypto';

import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';

import { requestContext } from './common/request-context.js';
import { ENV_KEYS } from './envKeys.constants.js';

export const setup = (app: NestExpressApplication) => {
  app.setGlobalPrefix('api');
  app.use(helmet());
  app.use((req: Request, res: Response, next: NextFunction) => {
    const suppliedId = req.get('x-request-id');
    const requestId =
      suppliedId && /^[a-zA-Z0-9_-]{1,128}$/.test(suppliedId)
        ? suppliedId
        : randomUUID();
    res.setHeader('x-request-id', requestId);
    requestContext.run({ requestId }, () => {
      const start = performance.now();
      res.once('finish', () => {
        const statusCode = res.statusCode;
        new Logger('http').log({
          message: 'HTTP request completed',
          level:
            statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info',
          'http.request.id': requestId,
          method: req.method,
          path: req.path,
          statusCode,
          durationMs: performance.now() - start,
        });
      });
      next();
    });
  });
  app.enableCors({
    origin: app.get(ConfigService).getOrThrow<string>(ENV_KEYS.CLIENT_ORIGIN),
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
      .setTitle('API')
      .setVersion('1.0')
      .addBearerAuth()
      .build(),
    { operationIdFactory: (_controller, method) => method },
  );
};
