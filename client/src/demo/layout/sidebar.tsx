import { List, useMediaQuery, useTheme } from '@mui/material';

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

export const Sidebar = ({ open, onClose }: SidebarProps) => {
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up('md'), { noSsr: true });
  const items = <List>{SIDEBAR_ENTRIES.map(renderEntry)}</List>;

  if (desktop) {
    return <SidebarDrawer variant="permanent">{items}</SidebarDrawer>;
  }

  return (
    <MobileSidebarDrawer
      variant="temporary"
      open={open}
      onClose={onClose}
      onClick={onClose}
    >
      {items}
    </MobileSidebarDrawer>
  );
};
