import { ListItemButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { createLink } from '@tanstack/react-router';

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  margin: theme.spacing(0.5, 1),
}));

export const SidebarItemButton = createLink(StyledListItemButton);
