import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';

import { ENV_KEYS } from '../envKeys.constants.js';
import { createLoggerOptions } from './logger.js';

@Module({
  imports: [
    WinstonModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        createLoggerOptions({
          consoleFormat: config.getOrThrow<'pretty' | 'ecs'>(
            ENV_KEYS.LOG_FORMAT,
          ),
          level: config.getOrThrow<string>(ENV_KEYS.LOG_LEVEL),
          serviceName: config.getOrThrow<string>(ENV_KEYS.LOG_SERVICE_NAME),
        }),
    }),
  ],
  exports: [WinstonModule],
})
export class LoggingModule {}
