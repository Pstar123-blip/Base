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

export const MAX_PROGRESS = 100;
export const MAX_OWNER_LENGTH = 254;
export const MAX_SEARCH_LENGTH = 200;
export const DEFAULT_NUMBER_OF_SESSIONS = 10;
export const MAX_NUMBER_OF_SESSIONS = 100;

// Marks POST operations that only read data, so the client generates queries
// for them instead of mutations.
export const READ_ONLY_EXTENSION = 'x-query';
