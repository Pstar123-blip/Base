import { Injectable } from '@nestjs/common';
import { and, asc, count, desc, eq, ilike, type SQL, sql } from 'drizzle-orm';

import { Database } from '../database/database.module.js';
import type { GroupSessionsQueryDto } from './sessions.dto.js';
import { sessions } from './sessions.schema.js';

const escapeLike = (value: string) => value.replace(/[\\%_]/g, '\\$&');

@Injectable()
export class SessionsRepository {
  constructor(private readonly database: Database) {}

  async group(query: GroupSessionsQueryDto, type?: string) {
    const { session_id, session_owner, status } = query.search_values ?? {};

    const contains = (column: SQL, value?: string) => {
      const text = value?.trim();
      return text ? ilike(column, `%${escapeLike(text)}%`) : undefined;
    };

    const where = and(
      type ? eq(sessions.type, type) : undefined,
      contains(sql`${sessions.id}::text`, session_id),
      contains(sql`${sessions.owner}`, session_owner),
      contains(sql`${sessions.status}`, status),
    );
    const { db } = this.database;

    const [items, [totals]] = await Promise.all([
      db
        .select()
        .from(sessions)
        .where(where)
        // `id` keeps pagination stable when `updatedAt` has ties.
        .orderBy(desc(sessions.updatedAt), asc(sessions.id))
        .limit(query.number_of_sessions)
        .offset(query.first_session_index),
      db.select({ total: count() }).from(sessions).where(where),
    ]);

    return { items, total: totals?.total ?? 0 };
  }

  async delete(id: string) {
    const deleted = await this.database.db
      .delete(sessions)
      .where(eq(sessions.id, id))
      .returning({ id: sessions.id });
    return deleted.length > 0;
  }
}
