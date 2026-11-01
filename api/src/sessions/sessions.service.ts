import { Injectable, NotFoundException } from '@nestjs/common';

import type { GroupSessionsQueryDto, SessionDto } from './sessions.dto.js';
import { SessionsRepository } from './sessions.repository.js';

@Injectable()
export class SessionsService {
  constructor(private readonly sessions: SessionsRepository) {}

  async group(query: GroupSessionsQueryDto, type?: SessionDto['type']) {
    const { items, total } = await this.sessions.group(query, type);
    return {
      total,
      items: items.map((item): SessionDto => ({
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
      })),
    };
  }

  async delete(id: string) {
    if (!(await this.sessions.delete(id))) {
      throw new NotFoundException();
    }
  }
}
