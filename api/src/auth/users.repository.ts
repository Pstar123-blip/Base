import { Injectable } from '@nestjs/common';
import { and, eq, isNull } from 'drizzle-orm';

import { Database } from '../database/database.module.js';
import { users } from '../database/schema.js';

@Injectable()
export class UsersRepository {
  constructor(private readonly database: Database) {}

  async byEmail(email: string) {
    return (
      await this.database.db
        .select()
        .from(users)
        .where(and(eq(users.email, email), isNull(users.deletedAt)))
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

  async create(email: string, passwordHash: string) {
    return (
      await this.database.db
        .insert(users)
        .values({ email, passwordHash })
        .onConflictDoNothing()
        .returning()
    )[0];
  }
}
