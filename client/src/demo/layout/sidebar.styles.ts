import { Drawer } from '@mui/material';
import { styled } from '@mui/material/styles';

import { SIDEBAR_WIDTH } from './consts';

export const SidebarDrawer = styled(Drawer)(({ theme }) => ({
  width: SIDEBAR_WIDTH,
  flexShrink: 0,
  [theme.breakpoints.down('md')]: { display: 'none' },
  '& .MuiDrawer-paper': {
    width: SIDEBAR_WIDTH,
    boxSizing: 'border-box',
    position: 'sticky',
    top: 0,
    height: '100vh',
    borderRight: `1px solid ${(theme.vars ?? theme).palette.divider}`,
  },
}));

export const MobileSidebarDrawer = styled(Drawer)(({ theme }) => ({
  [theme.breakpoints.up('md')]: { display: 'none' },
  '& .MuiDrawer-paper': {
    width: SIDEBAR_WIDTH,
    boxSizing: 'border-box',
  },
}));
