import type {
  SessionDto,
  SessionStatus,
  SessionType,
} from '@/api/generated/model';

import { DISPLAY_TIME_OFFSET_MS } from '../consts';

// The server speaks snake_case; the client works with camelCase.
export interface Session {
  id: string;
  type: SessionType;
  owner: string;
  imageAUrl: string;
  imageBUrl: string;
  createdAt: Date;
  updatedAt: Date;
  progress: number | null;
  status: SessionStatus;
  notes: string;
  logs: string | null;
}

// Parses the server's ISO-8601 string and shifts it by the display offset.
const mapDate = (iso: string): Date =>
  new Date(new Date(iso).getTime() + DISPLAY_TIME_OFFSET_MS);

const mapSession = (dto: SessionDto): Session => ({
  id: dto.session_id,
  type: dto.type,
  owner: dto.session_owner,
  imageAUrl: dto.image_a_url,
  imageBUrl: dto.image_b_url,
  createdAt: mapDate(dto.creation_time),
  updatedAt: mapDate(dto.last_update),
  progress: dto.progress,
  status: dto.status,
  notes: dto.notes,
  logs: dto.logs,
});

export const mapSessions = (dtos: SessionDto[]): Session[] =>
  dtos.map(mapSession);
