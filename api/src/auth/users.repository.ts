import { Injectable } from '@nestjs/common';
import { and, eq, isNull } from 'drizzle-orm';

import { Database } from '../database/database.module.js';
import { users } from '../database/schema.js';

@Injectable()
export class UsersRepository {
  constructor(private readonly database: Database) {}

  async byUsername(username: string) {
    return (
      await this.database.db
        .select()
        .from(users)
        .where(and(eq(users.username, username), isNull(users.deletedAt)))
        .limit(1)
    )[0];
  }

  async byId(id: string) {
    return (
      await this.database.db
        .select()
        .from(users)
        .where(and(eq(users.id, id), isNull(users.deletedAt)))
        .limit(1)
    )[0];
  }

  async create(username: string) {
    return (
      await this.database.db
        .insert(users)
        .values({ username })
        .onConflictDoNothing()
        .returning()
    )[0];
  }
}
