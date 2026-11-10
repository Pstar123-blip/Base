import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module.js';
import { LoggingModule } from './common/logging.module.js';
import { validateEnv } from './config.js';
import { DatabaseModule } from './database/database.module.js';
import { SessionsModule } from './sessions/sessions.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }),
    LoggingModule,
    DatabaseModule,
    AuthModule,
    SessionsModule,
  ],
})
export class AppModule {}
