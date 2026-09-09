import { describe, expect, it } from 'vitest';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
describe('health', () => {
  it('returns liveness', () => {
    expect(new AppController(new AppService()).health()).toEqual({
      status: 'ok',
    });
  });
});
