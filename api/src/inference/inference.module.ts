import { Module } from '@nestjs/common';

import { InferenceController } from './inference.controller.js';
import { InferenceService } from './inference.service.js';

@Module({
  controllers: [InferenceController],
  providers: [InferenceService],
})
export class InferenceModule {}
