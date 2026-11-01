import { Module } from '@nestjs/common';

import { SessionsController } from './sessions.controller.js';
import { SessionsRepository } from './sessions.repository.js';

@Module({
  controllers: [SessionsController],
  providers: [SessionsRepository],
})
export class SessionsModule {}
