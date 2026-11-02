import { Injectable, NotFoundException } from '@nestjs/common';

import type {
  GroupSessionsQueryDto,
  SessionDto,
  SessionSearchValuesDto,
} from './sessions.dto.js';
import { SessionsRepository } from './sessions.repository.js';

@Injectable()
export class SessionsService {
  constructor(private readonly sessions: SessionsRepository) {}

  async group(
    query: GroupSessionsQueryDto,
    searchValues?: SessionSearchValuesDto,
    type?: SessionDto['type'],
  ): Promise<SessionDto[]> {
    const items = await this.sessions.group(query, searchValues, type);
    return items.map((item) => ({
      session_id: item.id,
      type: item.type as SessionDto['type'],
      session_owner: item.owner,
      image_a_url: item.imageAUrl,
      image_b_url: item.imageBUrl,
      creation_time: item.createdAt.toISOString(),
      last_update: item.updatedAt.toISOString(),
      progress: item.progress,
      status: item.status as SessionDto['status'],
      notes: item.notes,
      logs: item.logs,
    }));
  }

  count(searchValues?: SessionSearchValuesDto, type?: SessionDto['type']) {
    return this.sessions.count(searchValues, type);
  }

  async delete(type: SessionDto['type'], id: string, shouldDelete: boolean) {
    if (shouldDelete && !(await this.sessions.delete(type, id))) {
      throw new NotFoundException();
    }
  }
}
