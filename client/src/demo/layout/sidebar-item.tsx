import type { SvgIconComponent } from '@mui/icons-material';
import { ListItemIcon, ListItemText } from '@mui/material';
import { Link, type LinkProps, useMatchRoute } from '@tanstack/react-router';

import { SidebarItemButton } from './sidebar-item.styles';

interface SidebarItemProps {
  icon: SvgIconComponent;
  label: string;
  to: LinkProps['to'];
}

export const SidebarItem = ({ icon: Icon, label, to }: SidebarItemProps) => {
  const matchRoute = useMatchRoute();
  const selected = Boolean(matchRoute({ to, fuzzy: to !== '/' }));

  return (
    <SidebarItemButton component={Link} to={to} selected={selected}>
      <ListItemIcon>
        <Icon />
      </ListItemIcon>
      <ListItemText primary={label} />
    </SidebarItemButton>
  );
};
