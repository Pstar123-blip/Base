import { Drawer } from '@mui/material';
import { styled } from '@mui/material/styles';

import { SIDEBAR_WIDTH } from '@/shared/constants';

export const SidebarDrawer = styled(Drawer)(({ theme }) => ({
  width: SIDEBAR_WIDTH,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: SIDEBAR_WIDTH,
    boxSizing: 'border-box',
    position: 'relative',
    border: 0,
    borderRight: `1px solid ${theme.vars.palette.divider}`,
  },
}));
