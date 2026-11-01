import type {
  SessionDto,
  SessionsPageDto,
  SessionStatus,
  SessionType,
} from '@/api/generated/model';

// The server speaks snake_case; the client works with camelCase.
export interface Session {
  id: string;
  type: SessionType;
  owner: string;
  imageAUrl: string;
  imageBUrl: string;
  createdAt: string;
  updatedAt: string;
  progress: number;
  status: SessionStatus;
  notes: string;
  logs: string | null;
}

export interface SessionsPage {
  items: Session[];
  total: number;
}

const mapSession = (dto: SessionDto): Session => ({
  id: dto.session_id,
  type: dto.type,
  owner: dto.session_owner,
  imageAUrl: dto.image_a_url,
  imageBUrl: dto.image_b_url,
  createdAt: dto.creation_time,
  updatedAt: dto.last_update,
  progress: dto.progress,
  status: dto.status,
  notes: dto.notes,
  logs: dto.logs,
});

export const mapSessionsPage = (page: SessionsPageDto): SessionsPage => ({
  total: page.total,
  items: page.items.map(mapSession),
});
