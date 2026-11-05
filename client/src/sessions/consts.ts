import {
  type SessionSearchValuesDto,
  SessionStatus,
  SessionType,
} from '@/api/generated/model';

export const SEARCH_DEBOUNCE_MS = 300;
export const REFETCH_INTERVAL_MS = 5000;
export const SEARCH_MAX_LENGTH = 200;
export const FILTER_INPUT_SIZE = 8;
export const ALL_TYPES = 'all';
export const ALL_STATUSES = 'all';
export const DISPLAY_TIME_OFFSET_MS = 2 * 60 * 60 * 1000;

export const SESSIONS_PATH = '/sessions';
export const getResultsPath = (id: string) => `${SESSIONS_PATH}/${id}/results`;

export const TABLE_FONT_SIZE = '1rem';
export const IMAGE_SIZE_PX = 40;
export const IMAGE_PREVIEW_SIZE_PX = 320;
export const ZOOM_MIN = 1;
export const ZOOM_MAX = 8;
export const PRIMARY_BUTTON = 0;
export const FILE_NAME_PATTERN = /\.[a-z0-9]+$/i;
export const HTTP_PROTOCOLS = ['http:', 'https:'];
export const DOWNLOAD_ERROR_MESSAGE = 'Unable to download the image';
export const TYPE_TAG_FONT_WEIGHT = 600;
export const VIEWER_FOOTER_MAX_WIDTH = '90vw';
export const VIEWER_TRANSITION = 'transform 0.08s ease-out';
export const TYPE_TAG_FILL_ALPHA = 0.16;
export const TYPE_TAG_BORDER_ALPHA = 0.4;
export const UNKNOWN_TYPE_COLOR = '#757575';
export const UNKNOWN_TYPE_LABEL = 'Unknown';
export const ZOOM_WHEEL_SENSITIVITY = 0.002;
export const DOWNLOAD_REVOKE_DELAY_MS = 1000;
export const TABLE_CELL_PADDING_PX = 8;
export const VIEWER_BACKDROP_COLOR = 'rgba(0, 0, 0, 0.92)';
export const VIEWER_FOOTER_COLOR = 'rgba(30, 30, 30, 0.9)';
export const VIEWER_FOOTER_RADIUS_PX = 2;
export const DRAG_THRESHOLD_PX = 4;
export const ORIGIN = { x: 0, y: 0 };

export const SESSION_TYPES = Object.values(SessionType);
export const SESSION_STATUSES = Object.values(SessionStatus);

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

export const SEARCH_FIELD_LABELS: Record<SessionSearchField, string> = {
  session_id: 'ID',
  session_owner: 'Owner',
};

export const SEARCH_FIELDS = Object.keys(
  SEARCH_FIELD_LABELS,
) as SessionSearchField[];

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
}

export const SESSION_COLUMNS: SessionColumn[] = [
  { id: 'id', label: 'ID' },
  { id: 'type', label: 'Type' },
  { id: 'owner', label: 'Owner' },
  { id: 'imageA', label: 'Image A' },
  { id: 'imageB', label: 'Image B' },
  { id: 'createdAt', label: 'Created' },
  { id: 'updatedAt', label: 'Last update' },
  { id: 'progress', label: 'Progress' },
  { id: 'status', label: 'Status' },
  { id: 'results', label: 'Results' },
  { id: 'options', label: '' },
];

// Which columns have a filter input in the row under the header.
export type ColumnFilter =
  | { kind: 'text'; field: SessionSearchField }
  | { kind: 'type' }
  | { kind: 'status' };

export const COLUMN_FILTERS: Partial<Record<SessionColumnId, ColumnFilter>> = {
  id: { kind: 'text', field: 'session_id' },
  type: { kind: 'type' },
  owner: { kind: 'text', field: 'session_owner' },
  status: { kind: 'status' },
};
