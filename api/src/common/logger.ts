import { ecsFormat } from '@elastic/ecs-winston-format';
import { WinstonModule } from 'nest-winston';
import { format, type LoggerOptions, transports } from 'winston';

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
        if (info.context) info['log.logger'] = info.context;
        if (info.method !== undefined)
          info['http.request.method'] = info.method;
        if (info.path !== undefined) info['url.path'] = info.path;
        if (info.statusCode !== undefined)
          info['http.response.status_code'] = info.statusCode;
        if (typeof info.durationMs === 'number')
          info['event.duration'] = info.durationMs * 1_000_000;

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
      ecsFormat({ serviceName: 'api' }),
    ),
    transports: options.transports ?? [
      new transports.Console({ stderrLevels: ['error', 'fatal'] }),
    ],
  });
}
