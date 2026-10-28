import { ListItemIcon, ListItemText } from '@mui/material';
import { Link, useMatchRoute } from '@tanstack/react-router';
import type { ReactNode } from 'react';

import { SidebarItemButton } from './sidebar-item.styles';

interface SidebarItemProps {
  icon: ReactNode;
  label: string;
  to: string;
}

export const SidebarItem = ({ icon, label, to }: SidebarItemProps) => {
  const matchRoute = useMatchRoute();
  const selected = Boolean(matchRoute({ to, fuzzy: to !== '/' }));

  return (
    <SidebarItemButton component={Link} to={to} selected={selected}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={label} />
    </SidebarItemButton>
  );
};
