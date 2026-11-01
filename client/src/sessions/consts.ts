import {
  type SessionSearchField,
  type SessionSortField,
  type SessionStatus,
  type SessionType,
} from '@/api/generated/model';

export const SEARCH_DEBOUNCE_MS = 300;
export const SEARCH_MAX_LENGTH = 200;
export const ALL_TYPES = 'all';

export const SESSIONS_PATH = '/sessions';
export const getResultsPath = (id: string) => `${SESSIONS_PATH}/${id}/results`;

export const IMAGE_SIZE_PX = 40;
export const TABLE_MIN_WIDTH_PX = 960;
export const ID_MAX_WIDTH_PX = 96;
export const TYPE_TAG_FILL_ALPHA = 0.16;
export const TYPE_TAG_BORDER_ALPHA = 0.4;

export const SESSION_TYPE_LABELS: Record<SessionType, string> = {
  training: 'Training',
  inference: 'Inference',
  evaluation: 'Evaluation',
  calibration: 'Calibration',
};

// Each type's signature color.
export const SESSION_TYPE_COLORS: Record<SessionType, string> = {
  training: '#7c4dff',
  inference: '#0288d1',
  evaluation: '#2e7d32',
  calibration: '#ed6c02',
};

export const SESSION_STATUS_LABELS: Record<SessionStatus, string> = {
  pending: 'Pending',
  in_progress: 'In progress',
  running: 'Running',
  completed: 'Completed',
  failed: 'Failed',
  canceled: 'Canceled',
};

export const SESSION_STATUS_COLORS: Record<
  SessionStatus,
  'default' | 'info' | 'primary' | 'success' | 'error' | 'warning'
> = {
  pending: 'default',
  in_progress: 'info',
  running: 'primary',
  completed: 'success',
  failed: 'error',
  canceled: 'warning',
};

export const SEARCH_FIELD_LABELS: Record<SessionSearchField, string> = {
  id: 'ID',
  type: 'Type',
  owner: 'Owner',
  status: 'Status',
};

export type SessionColumnId =
  | 'id'
  | 'type'
  | 'owner'
  | 'imageA'
  | 'imageB'
  | 'createdAt'
  | 'updatedAt'
  | 'progress'
  | 'status'
  | 'results'
  | 'options';

interface SessionColumn {
  id: SessionColumnId;
  label: string;
  // Present when the server can sort by this column.
  sortBy?: SessionSortField;
}

export const SESSION_COLUMNS: SessionColumn[] = [
  { id: 'id', label: 'ID', sortBy: 'id' },
  { id: 'type', label: 'Type', sortBy: 'type' },
  { id: 'owner', label: 'Owner', sortBy: 'owner' },
  { id: 'imageA', label: 'Image A' },
  { id: 'imageB', label: 'Image B' },
  { id: 'createdAt', label: 'Created', sortBy: 'createdAt' },
  { id: 'updatedAt', label: 'Last update', sortBy: 'updatedAt' },
  { id: 'progress', label: 'Progress', sortBy: 'progress' },
  { id: 'status', label: 'Status', sortBy: 'status' },
  { id: 'results', label: 'Results' },
  { id: 'options', label: '' },
];
