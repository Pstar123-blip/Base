export const SESSION_TYPES = [
  'training',
  'inference',
  'evaluation',
  'calibration',
] as const;

export const SESSION_STATUSES = [
  'pending',
  'in_progress',
  'running',
  'completed',
  'failed',
  'canceled',
] as const;

export const SESSION_SEARCH_FIELDS = ['id', 'type', 'owner', 'status'] as const;

export const SESSION_SORT_FIELDS = [
  'id',
  'type',
  'owner',
  'createdAt',
  'updatedAt',
  'progress',
  'status',
] as const;

export const SORT_DIRECTIONS = ['asc', 'desc'] as const;

export const MAX_PROGRESS = 100;
export const MAX_OWNER_LENGTH = 254;
export const MAX_SEARCH_LENGTH = 200;
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;
