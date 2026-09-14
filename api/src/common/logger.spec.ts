import { PassThrough } from 'node:stream';

import { describe, expect, it } from 'vitest';
import { transports } from 'winston';

import { createAppLogger } from './logger.js';

function capture(level = 'info') {
  const stream = new PassThrough();
  const records: Record<string, unknown>[] = [];
  stream.on('data', (chunk: Buffer) => {
    records.push(JSON.parse(chunk.toString()) as Record<string, unknown>);
  });
  const logger = createAppLogger({
    level,
    transports: [new transports.Stream({ stream })],
  });
  return { logger, records };
}

describe('ECS logging', () => {
  it('emits structured HTTP fields with a timestamp', () => {
    const { logger, records } = capture();
    logger.log(
      {
        message: 'HTTP request completed',
        method: 'GET',
        path: '/api/health',
        statusCode: 200,
        durationMs: 12,
      },
      'http',
    );
    expect(records).toEqual([
      expect.objectContaining({
        '@timestamp': expect.any(String),
        'ecs.version': expect.any(String),
        'log.level': 'info',
        'service.name': 'api',
        'log.logger': 'http',
        message: 'HTTP request completed',
        'http.request.method': 'GET',
        'url.path': '/api/health',
        'http.response.status_code': 200,
        'event.duration': 12_000_000,
      }),
    ]);
    expect(Number.isNaN(Date.parse(String(records[0]?.['@timestamp'])))).toBe(
      false,
    );

    for (const key of [
      'timestamp',
      'level',
      'service',
      'context',
      'method',
      'path',
      'statusCode',
      'durationMs',
    ]) {
      expect(records[0]).not.toHaveProperty(key);
    }
  });

  it('preserves error stacks, supports fatal, and filters debug logs', () => {
    const { logger, records } = capture();
    const error = new Error('database unavailable');
    logger.error(error, error.stack, 'database');
    logger.fatal?.('cannot start', undefined, 'bootstrap');
    logger.debug?.('filtered');
    expect(records).toHaveLength(2);
    expect(records[0]).toMatchObject({
      'log.level': 'error',
      message: error.message,
      'log.logger': 'database',
      error: {
        type: 'Error',
        message: error.message,
        stack_trace: error.stack,
      },
    });
    expect(records[1]).toMatchObject({
      'log.level': 'fatal',
      message: 'cannot start',
      'log.logger': 'bootstrap',
    });
  });

  it('formats string errors with Nest stack traces', () => {
    const { logger, records } = capture();
    logger.error(
      'request failed',
      'Error: request failed\n    at handler',
      'http',
    );
    expect(records[0]).toMatchObject({
      'log.level': 'error',
      error: {
        message: 'request failed',
        stack_trace: 'Error: request failed\n    at handler',
      },
    });
    expect(records[0]).not.toHaveProperty('stack');
  });
});
