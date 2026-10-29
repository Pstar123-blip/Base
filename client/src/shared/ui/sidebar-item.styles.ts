import { ListItemButton } from '@mui/material';
import { styled } from '@mui/material/styles';

export const SidebarItemButton = styled(ListItemButton)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  margin: theme.spacing(0.5, 1),
}));
