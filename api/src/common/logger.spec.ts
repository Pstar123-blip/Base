import { PassThrough } from 'node:stream';

import { describe, expect, it } from 'vitest';
import { transports } from 'winston';

import { createAppLogger, requestContext } from './logger.js';

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

describe('Winston logging', () => {
  it('emits structured HTTP fields with a timestamp and request ID', () => {
    const { logger, records } = capture();
    requestContext.run({ requestId: 'request-1' }, () => {
      logger.log(
        { message: 'HTTP request completed', method: 'GET', statusCode: 200 },
        'http',
      );
    });
    expect(records).toEqual([
      expect.objectContaining({
        timestamp: expect.any(String),
        level: 'info',
        service: 'api',
        requestId: 'request-1',
        context: 'http',
        message: 'HTTP request completed',
        method: 'GET',
        statusCode: 200,
      }),
    ]);
    expect(Number.isNaN(Date.parse(String(records[0]?.timestamp)))).toBe(false);
  });

  it('isolates concurrent request contexts and handles logs outside requests', async () => {
    const { logger, records } = capture();
    await Promise.all(
      ['first', 'second'].map((requestId) =>
        requestContext.run({ requestId }, async () => {
          await Promise.resolve();
          logger.log(requestId);
        }),
      ),
    );
    logger.log('startup');
    expect(records.map(({ requestId }) => requestId)).toEqual([
      'first',
      'second',
      null,
    ]);
  });

  it('retains explicit request IDs for completion callbacks', () => {
    const { logger, records } = capture();
    logger.log({ message: 'completed', requestId: 'finished-request' }, 'http');
    expect(records[0]?.requestId).toBe('finished-request');
  });

  it('preserves error stacks, supports fatal, and filters debug logs', () => {
    const { logger, records } = capture();
    const error = new Error('database unavailable');
    logger.error(error, error.stack, 'database');
    logger.fatal?.('cannot start', undefined, 'bootstrap');
    logger.debug?.('filtered');
    expect(records).toHaveLength(2);
    expect(records[0]).toMatchObject({
      level: 'error',
      message: error.message,
      context: 'database',
      stack: [error.stack],
    });
    expect(records[1]).toMatchObject({
      level: 'fatal',
      message: 'cannot start',
      context: 'bootstrap',
    });
  });
});
