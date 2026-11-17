import { Injectable } from '@nestjs/common';

import { MOCK_STATISTICS } from './inference.constants.js';

@Injectable()
export class InferenceService {
  listStatistics(): string[] {
    return [...MOCK_STATISTICS];
  }
}
