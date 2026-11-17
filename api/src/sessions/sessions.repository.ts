import { Injectable } from '@nestjs/common';
import { and, asc, count, desc, eq, ilike, type SQL, sql } from 'drizzle-orm';

import { Database } from '../database/database.module.js';
import type {
  GroupSessionsQueryDto,
  SessionSearchValuesDto,
} from './sessions.dto.js';
import { sessions } from './sessions.schema.js';

const escapeLike = (value: string) => value.replace(/[\\%_]/g, '\\$&');

@Injectable()
export class SessionsRepository {
  constructor(private readonly database: Database) {}

  private where(searchValues?: SessionSearchValuesDto, type?: string) {
    const { session_id, session_owner, status } = searchValues ?? {};

    const contains = (column: SQL, value?: string) => {
      const text = value?.trim();
      return text ? ilike(column, `%${escapeLike(text)}%`) : undefined;
    };

    return and(
      type ? eq(sessions.type, type) : undefined,
      contains(sql`${sessions.id}::text`, session_id),
      contains(sql`${sessions.owner}`, session_owner),
      contains(sql`${sessions.status}`, status),
    );
  }

  group(
    query: GroupSessionsQueryDto,
    searchValues?: SessionSearchValuesDto,
    type?: string,
  ) {
    return (
      this.database.db
        .select()
        .from(sessions)
        .where(this.where(searchValues, type))
        // `id` keeps pagination stable when `updatedAt` has ties.
        .orderBy(desc(sessions.updatedAt), asc(sessions.id))
        .limit(query.number_of_sessions)
        .offset(query.first_session_index)
    );
  }

  async count(searchValues?: SessionSearchValuesDto, type?: string) {
    const [totals] = await this.database.db
      .select({ total: count() })
      .from(sessions)
      .where(this.where(searchValues, type));
    return totals?.total ?? 0;
  }

  async delete(type: string, id: string) {
    const deleted = await this.database.db
      .delete(sessions)
      .where(and(eq(sessions.id, id), eq(sessions.type, type)))
      .returning({ id: sessions.id });
    return deleted.length > 0;
  }
}
