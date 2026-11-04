import { Drawer } from '@mui/material';
import { styled } from '@mui/material/styles';

import { SIDEBAR_WIDTH } from './consts';

export const SidebarDrawer = styled(Drawer)(({ theme }) => ({
  width: SIDEBAR_WIDTH,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: SIDEBAR_WIDTH,
    boxSizing: 'border-box',
    position: 'relative',
    height: '100%',
    borderRight: `1px solid ${(theme.vars ?? theme).palette.divider}`,
  },
}));

export const MobileSidebarDrawer = styled(Drawer)({
  '& .MuiDrawer-paper': {
    width: SIDEBAR_WIDTH,
    boxSizing: 'border-box',
  },
});
