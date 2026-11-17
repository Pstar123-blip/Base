import type { SvgIconComponent } from '@mui/icons-material';
import { ListItemIcon, ListItemText } from '@mui/material';
import { type LinkProps, useMatchRoute } from '@tanstack/react-router';

import { SidebarItemButton } from './sidebar-item.styles';

export interface SidebarItemProps {
  icon: SvgIconComponent;
  label: string;
  to: LinkProps['to'];
  onNavigate?: () => void;
}

export const SidebarItem = ({
  icon: Icon,
  label,
  to,
  onNavigate,
}: SidebarItemProps) => {
  const matchRoute = useMatchRoute();
  const selected = Boolean(matchRoute({ to, fuzzy: to !== '/' }));

  return (
    <SidebarItemButton to={to} selected={selected} onClick={onNavigate}>
      <ListItemIcon>
        <Icon />
      </ListItemIcon>
      <ListItemText primary={label} />
    </SidebarItemButton>
  );
};
