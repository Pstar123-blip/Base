import { Stack } from '@mui/material';
import { styled, type Theme } from '@mui/material/styles';

import {
  COMPARE_PANEL_MAX_WIDTH,
  COMPARE_ROW_GAP,
  COMPARE_ROW_GAP_COMPACT,
  COMPARE_TILE_ASPECT_RATIO,
} from '../consts';

const rowStyles = ({ theme }: { theme: Theme }) => ({
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(COMPARE_ROW_GAP_COMPACT),
  [theme.breakpoints.up('sm')]: {
    gap: theme.spacing(COMPARE_ROW_GAP),
  },
});
export const Row = styled(Stack)(rowStyles);

const iconWrapperStyles = ({ theme }: { theme: Theme }) => ({
  display: 'flex',
  color: (theme.vars ?? theme).palette.text.secondary,
});
export const IconWrapper = styled('div')(iconWrapperStyles);

const panelStyles = ({ theme }: { theme: Theme }) => ({
  [theme.breakpoints.up('sm')]: {
    flex: 1,
  },
  minWidth: 0,
  textAlign: 'center' as const,
  width: '100%',
  maxWidth: theme.spacing(COMPARE_PANEL_MAX_WIDTH),
});
export const Panel = styled('div')(panelStyles);

export const TileFrame = styled('div')({
  aspectRatio: COMPARE_TILE_ASPECT_RATIO,
});

// The caption is a flex row so the name can shrink and ellipsize while the
// size stays visible.
export const CaptionName = styled('span')({
  display: 'block',
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const CaptionSize = styled('span')({
  display: 'block',
  whiteSpace: 'nowrap',
});
