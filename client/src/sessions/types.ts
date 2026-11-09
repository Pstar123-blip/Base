import type {
  SessionSearchValuesDto,
  SessionStatus,
  SessionType,
} from '@/api/generated/model';

import type { SESSION_COLUMNS } from './consts';

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

export interface ViewedImage {
  src: string;
  alt: string;
}

export type ImageOpener = (image: ViewedImage) => void;

// Status has its own dropdown, so it is not a free-text search field.
export type SessionSearchField = Exclude<
  keyof SessionSearchValuesDto,
  'status'
>;

export type SessionSearchFilters = Partial<Record<SessionSearchField, string>>;

export interface SessionFilters extends SessionSearchFilters {
  type?: SessionType;
  status?: SessionStatus;
}

export type SessionColumnId = (typeof SESSION_COLUMNS)[number]['id'];

// Which columns have a filter input in the row under the header.
export type ColumnFilter =
  | { kind: 'text'; field: SessionSearchField }
  | { kind: 'type' }
  | { kind: 'status' };
