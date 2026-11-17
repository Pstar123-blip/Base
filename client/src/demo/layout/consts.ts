import ListAltIcon from '@mui/icons-material/ListAlt';

import { SESSIONS_PATH } from '@/sessions/consts';
import {
  SESSION_TYPE_ICONS,
  SESSION_TYPE_LABELS,
  SESSION_TYPE_PATHS,
  SESSION_TYPES,
} from '@/shared/session-type-constants';

import type { SidebarItemProps } from './sidebar-item';

export const SIDEBAR_WIDTH = 240;

// One entry per session type, then the sessions list.
export const SIDEBAR_ENTRIES: SidebarItemProps[] = [
  ...SESSION_TYPES.map((type) => ({
    label: SESSION_TYPE_LABELS[type],
    to: SESSION_TYPE_PATHS[type],
    icon: SESSION_TYPE_ICONS[type],
  })),
  { label: 'Sessions', to: SESSIONS_PATH, icon: ListAltIcon },
];
