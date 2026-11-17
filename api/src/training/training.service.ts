import { Injectable } from '@nestjs/common';

import { MOCK_TYPES } from './training.constants.js';

@Injectable()
export class TrainingService {
  listTypes(): string[] {
    return [...MOCK_TYPES];
  }
}
