import { AsyncLocalStorage } from 'node:async_hooks';

import { WinstonModule } from 'nest-winston';
import { format, type LoggerOptions, transports } from 'winston';

export const requestContext = new AsyncLocalStorage<{ requestId: string }>();

export function createAppLogger(
  options: Pick<LoggerOptions, 'level' | 'transports'> = {},
) {
  return WinstonModule.createLogger({
    // Include Nest's fatal level, which Winston's default npm levels omit.
    levels: {
      fatal: 0,
      error: 1,
      warn: 2,
      info: 3,
      http: 4,
      verbose: 5,
      debug: 6,
      silly: 7,
    },
    level: options.level ?? 'info',
    format: format.combine(
      format.errors({ stack: true }),
      format((info) => {
        info.service = 'api';
        info.requestId ??= requestContext.getStore()?.requestId ?? null;
        return info;
      })(),
      format.timestamp(),
      format.json(),
    ),
    transports: options.transports ?? [
      new transports.Console({ stderrLevels: ['error', 'fatal'] }),
    ],
  });
}
