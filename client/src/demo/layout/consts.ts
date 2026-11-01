import DashboardIcon from '@mui/icons-material/Dashboard';
import ListAltIcon from '@mui/icons-material/ListAlt';
import type { ReactNode } from 'react';
import { createElement } from 'react';

interface SidebarEntry {
  label: string;
  to: string;
  icon: ReactNode;
}

export const SIDEBAR_ENTRIES: SidebarEntry[] = [
  { label: 'Dashboard', to: '/', icon: createElement(DashboardIcon) },
  { label: 'Sessions', to: '/sessions', icon: createElement(ListAltIcon) },
];
