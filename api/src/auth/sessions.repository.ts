import { Injectable } from '@nestjs/common';
import { and, eq, gt } from 'drizzle-orm';

import { Database } from '../database/database.module.js';
import { sessions } from '../database/schema.js';

@Injectable()
export class SessionsRepository {
  constructor(private readonly database: Database) {}

  async create(session: typeof sessions.$inferInsert) {
    await this.database.db.insert(sessions).values(session);
  }

  async consume(id: string, tokenHash: string): Promise<boolean> {
    const consumed = await this.database.db
      .delete(sessions)
      .where(
        and(
          eq(sessions.id, id),
          eq(sessions.tokenHash, tokenHash),
          gt(sessions.expiresAt, new Date()),
        ),
      )
      .returning({ id: sessions.id });

    return consumed.length > 0;
  }

  async deleteByTokenHash(tokenHash: string) {
    await this.database.db
      .delete(sessions)
      .where(eq(sessions.tokenHash, tokenHash));
  }
}
