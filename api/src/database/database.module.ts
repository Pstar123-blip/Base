import {
  Global,
  Injectable,
  Module,
  type OnModuleDestroy,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import { users } from '../auth/users.schema.js';
import { ENV_KEYS } from '../envKeys.constants.js';

@Injectable()
export class Database implements OnModuleDestroy {
  readonly pool: Pool;

  readonly db;

  constructor(config: ConfigService) {
    this.pool = new Pool({
      connectionString: config.getOrThrow<string>(ENV_KEYS.DATABASE_URL),
    });
    this.db = drizzle(this.pool, { schema: { users } });
  }

  async onModuleDestroy() {
    await this.pool.end();
  }
}
@Global()
@Module({ providers: [Database], exports: [Database] })
export class DatabaseModule {}
