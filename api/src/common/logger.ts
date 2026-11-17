import { inspect } from 'node:util';

import { ecsFormat } from '@elastic/ecs-winston-format';
import { WinstonModule } from 'nest-winston';
import { format, type LoggerOptions, transports } from 'winston';

import { requestContext } from './request-context.js';

export const LOG_LEVELS = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  http: 4,
  verbose: 5,
  debug: 6,
  silly: 7,
};

export const createPrettyFormat = (colorize = Boolean(process.stdout.isTTY)) =>
  format.combine(
    ...(colorize
      ? [
          format.colorize({
            colors: {
              fatal: 'red',
              error: 'red',
              warn: 'yellow',
              info: 'green',
              http: 'cyan',
              verbose: 'cyan',
              debug: 'blue',
              silly: 'magenta',
            },
          }),
        ]
      : []),
    format.printf((info) => {
      const { message, level, error, ...metadata } = info;
      const timestamp = metadata['@timestamp'];
      const context = metadata['log.logger'] ?? 'app';
      const requestId = metadata['http.request.id'];

      for (const key of [
        '@timestamp',
        'log.logger',
        'log.level',
        'ecs.version',
        'service.name',
        'event.dataset',
        'http.request.id',
      ]) {
        delete metadata[key];
      }

      const details = Object.keys(metadata).length
        ? ` ${inspect(metadata, { colors: colorize, compact: true, breakLength: Infinity })}`
        : '';
      const stack =
        error && typeof error === 'object' && 'stack_trace' in error
          ? `\n${String(error.stack_trace)}`
          : '';
      return `${String(timestamp)} ${String(level)} [${String(context)}]${requestId ? ` [${String(requestId)}]` : ''} ${String(message)}${details}${stack}`;
    }),
  );

export const createLoggerOptions = (
  options: Pick<LoggerOptions, 'level' | 'transports'> & {
    serviceName?: string;
    consoleFormat?: 'pretty' | 'ecs';
  } = {},
) => {
  return {
    // Include Nest's fatal level, which Winston's default npm levels omit.
    levels: LOG_LEVELS,
    level: options.level ?? 'info',
    format: format.combine(
      format.errors({ stack: true }),
      format((info) => {
        const requestId = requestContext.getStore()?.requestId;

        if (requestId) {
          info['http.request.id'] = requestId;
        }

        if (info.context) {
          info['log.logger'] = info.context;
        }

        if (info.method !== undefined) {
          info['http.request.method'] = info.method;
        }

        if (info.path !== undefined) {
          info['url.path'] = info.path;
        }

        if (info.statusCode !== undefined) {
          info['http.response.status_code'] = info.statusCode;
        }

        if (typeof info.durationMs === 'number') {
          info['event.duration'] = info.durationMs * 1_000_000;
        }

        // nest-winston stores Error objects and traces separately.
        if (info.error instanceof Error) {
          info.err = info.error;
          delete info.error;
        }

        const stack = Array.isArray(info.stack)
          ? info.stack.filter(Boolean).join('\n')
          : info.stack;

        if (stack && !(info.err instanceof Error)) {
          info.error = { message: info.message, stack_trace: stack };
        }

        for (const key of [
          'context',
          'method',
          'path',
          'statusCode',
          'durationMs',
          'stack',
        ]) {
          delete info[key];
        }

        return info;
      })(),
      ecsFormat({ serviceName: options.serviceName ?? 'api' }),
    ),
    transports: options.transports ?? [
      new transports.Console({
        stderrLevels: ['error', 'fatal'],
        ...(options.consoleFormat !== 'ecs'
          ? { format: createPrettyFormat() }
          : {}),
      }),
    ],
  } satisfies LoggerOptions;
};

export const createAppLogger = (
  options: Parameters<typeof createLoggerOptions>[0] = {},
) => WinstonModule.createLogger(createLoggerOptions(options));
