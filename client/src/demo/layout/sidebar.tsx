import { List } from '@mui/material';

import { SIDEBAR_ENTRIES, type SidebarEntry } from './consts';
import { MobileSidebarDrawer, SidebarDrawer } from './sidebar.styles';
import { SidebarItem } from './sidebar-item';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const renderEntry = (entry: SidebarEntry) => (
  <SidebarItem
    key={entry.to}
    icon={entry.icon}
    label={entry.label}
    to={entry.to}
  />
);

export const Sidebar = ({ open, onClose }: SidebarProps) => (
  <>
    <SidebarDrawer variant="permanent">
      <List>{SIDEBAR_ENTRIES.map(renderEntry)}</List>
    </SidebarDrawer>
    <MobileSidebarDrawer
      variant="temporary"
      open={open}
      onClose={onClose}
      onClick={onClose}
      ModalProps={{ keepMounted: true }}
    >
      <List>{SIDEBAR_ENTRIES.map(renderEntry)}</List>
    </MobileSidebarDrawer>
  </>
);
