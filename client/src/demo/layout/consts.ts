import DashboardIcon from '@mui/icons-material/Dashboard';
import ListAltIcon from '@mui/icons-material/ListAlt';

import type { SidebarItemProps } from './sidebar-item';

export const SIDEBAR_WIDTH = 240;

export const SIDEBAR_ENTRIES: SidebarItemProps[] = [
  { label: 'Dashboard', to: '/', icon: DashboardIcon },
  { label: 'Sessions', to: '/sessions', icon: ListAltIcon },
];
