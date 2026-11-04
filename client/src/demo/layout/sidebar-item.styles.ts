import { ListItemButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import type { LinkProps } from '@tanstack/react-router';
import type { ElementType } from 'react';

export const SidebarItemButton = styled(ListItemButton)<{
  component?: ElementType;
  to?: LinkProps['to'];
}>(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  margin: theme.spacing(0.5, 1),
}));
