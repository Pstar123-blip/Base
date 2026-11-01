import { Injectable } from '@nestjs/common';
import { and, asc, count, desc, eq, ilike, sql } from 'drizzle-orm';

import { Database } from '../database/database.module.js';
import type { ListSessionsQueryDto } from './sessions.dto.js';
import { sessions } from './sessions.schema.js';

const escapeLike = (value: string) => value.replace(/[\\%_]/g, '\\$&');

const searchColumns = {
  id: sql`${sessions.id}::text`,
  type: sessions.type,
  owner: sessions.owner,
  status: sessions.status,
};

@Injectable()
export class SessionsRepository {
  constructor(private readonly database: Database) {}

  async list(query: ListSessionsQueryDto) {
    const search = query.search?.trim();
    const where = and(
      query.type ? eq(sessions.type, query.type) : undefined,
      search
        ? ilike(searchColumns[query.searchField], `%${escapeLike(search)}%`)
        : undefined,
    );
    const direction = query.sortDirection === 'asc' ? asc : desc;
    const { db } = this.database;

    const [items, [totals]] = await Promise.all([
      db
        .select()
        .from(sessions)
        .where(where)
        // `id` keeps pagination stable when the sorted column has ties.
        .orderBy(direction(sessions[query.sortBy]), asc(sessions.id))
        .limit(query.pageSize)
        .offset(query.page * query.pageSize),
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
