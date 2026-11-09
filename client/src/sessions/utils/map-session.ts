import type {
  SessionDto,
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
  createdAt: Date;
  updatedAt: Date;
  progress: number | null;
  status: SessionStatus;
}

// Matches a trailing timezone designator: "Z" or an offset like "+02:00".
const TIMEZONE_DESIGNATOR = /(Z|[+-]\d{2}(:?\d{2})?)$/i;

// Parses a server timestamp as a UTC instant. Naive strings (no timezone
// designator) are treated as UTC; strings that carry one are honored as is.
// Formatting the Date renders it in the viewer's local timezone.
const mapDate = (iso: string): Date =>
  new Date(TIMEZONE_DESIGNATOR.test(iso) ? iso : `${iso}Z`);

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
});

export const mapSessions = (dtos: SessionDto[]): Session[] =>
  dtos.map(mapSession);
