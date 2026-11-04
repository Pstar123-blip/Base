import DashboardIcon from '@mui/icons-material/Dashboard';

import type { SidebarItemProps } from './sidebar-item';

export const SIDEBAR_WIDTH = 240;

export const SIDEBAR_ENTRIES: SidebarItemProps[] = [
  { label: 'Dashboard', to: '/', icon: DashboardIcon },
];
