import { List } from '@mui/material';

import { SidebarItem } from '@/shared/ui/sidebar-item';

import { SIDEBAR_ENTRIES } from './consts';
import { SidebarDrawer } from './sidebar.styles';

const renderEntry = (entry: (typeof SIDEBAR_ENTRIES)[number]) => (
  <SidebarItem
    key={entry.to}
    icon={entry.icon}
    label={entry.label}
    to={entry.to}
  />
);

export const Sidebar = () => (
  <SidebarDrawer variant="permanent">
    <List>{SIDEBAR_ENTRIES.map(renderEntry)}</List>
  </SidebarDrawer>
);
