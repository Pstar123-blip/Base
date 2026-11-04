import type { SvgIconComponent } from '@mui/icons-material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import type { LinkProps } from '@tanstack/react-router';

export const SIDEBAR_WIDTH = 240;

export interface SidebarEntry {
  label: string;
  to: LinkProps['to'];
  icon: SvgIconComponent;
}

export const SIDEBAR_ENTRIES: SidebarEntry[] = [
  { label: 'Dashboard', to: '/', icon: DashboardIcon },
];
