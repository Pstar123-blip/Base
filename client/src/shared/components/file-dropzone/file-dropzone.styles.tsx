import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded';
import { Box, Typography } from '@mui/material';
import { keyframes, styled } from '@mui/material/styles';

import { UPLOAD_AREA_HEIGHT } from '@/shared/constants';

import {
  DOT_GRID_SPACING,
  DOT_SIZE,
  DRAG_ACTIVE_SCALE,
  DROP_AREA_GAP,
  DROP_AREA_PADDING,
  HALO_INSET,
  HALO_PULSE_DURATION,
  ICON_BADGE_HEIGHT,
  ICON_FLOAT_DISTANCE,
  ICON_FLOAT_DURATION,
  ICON_SIZE,
} from './consts';

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-${ICON_FLOAT_DISTANCE}px); }
`;

const pulse = keyframes`
  0% { transform: scale(0.9); opacity: 0.9; }
  100% { transform: scale(1.35); opacity: 0; }
`;

// The default size. A parent that needs another size overrides it with
// `styled(FileDropzone)`.
export const DropzoneRoot = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  width: '100%',
  height: UPLOAD_AREA_HEIGHT,
}));

export const IconBadge = styled(Box)(({ theme }) => {
  const { palette } = theme.vars ?? theme;

  return {
    position: 'relative',
    display: 'grid',
    placeItems: 'center',
    // Sized by the drop area's height, and the first to give way when the
    // text needs the room.
    height: ICON_BADGE_HEIGHT,
    aspectRatio: '1',
    minHeight: 0,
    flexShrink: 1,
    borderRadius: '50%',
    color: palette.primary.contrastText,
    backgroundImage: `linear-gradient(135deg, ${palette.primary.main}, ${palette.secondary.main})`,
    boxShadow: `0 12px 32px -8px ${theme.alpha(palette.primary.main, 0.55)}`,
    animation: `${float} ${ICON_FLOAT_DURATION}ms ease-in-out infinite`,
    transition: theme.transitions.create(['box-shadow', 'background-image']),

    // Soft halo behind the badge; pulses while files are dragged over.
    '&::before': {
      content: '""',
      position: 'absolute',
      inset: HALO_INSET,
      zIndex: -1,
      borderRadius: '50%',
      backgroundColor: theme.alpha(palette.primary.main, 0.16),
    },
  };
});

export const UploadIcon = styled(CloudUploadRoundedIcon)({
  width: ICON_SIZE,
  height: ICON_SIZE,
});

// Keeps the title and hint together, closer than the drop area's own gap.
export const DropText = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(0.5),
}));

export const DropTitle = styled(Typography)(({ theme }) => {
  const { palette } = theme.vars ?? theme;

  return {
    ...theme.typography.h5,
    fontWeight: theme.typography.fontWeightBold,
    letterSpacing: '-0.01em',
    color: palette.text.primary,
  };
});

export const BrowseHint = styled(Typography)(({ theme }) => {
  const { palette } = theme.vars ?? theme;

  return {
    ...theme.typography.body1,
    color: palette.text.secondary,
  };
});

export const DropDescription = styled(Typography)(({ theme }) => {
  const { palette } = theme.vars ?? theme;

  return {
    ...theme.typography.caption,
    padding: theme.spacing(0.75, 1.75),
    borderRadius: theme.spacing(2),
    fontWeight: theme.typography.fontWeightMedium,
    color: palette.text.secondary,
    backgroundColor: theme.alpha(palette.text.primary, 0.05),
  };
});

export const RejectionLine = styled(Typography)(({ theme }) => ({
  ...theme.typography.body2,
}));

export const DropArea = styled(Box)(({ theme }) => {
  const { palette } = theme.vars ?? theme;

  return {
    position: 'relative',
    isolation: 'isolate',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: DROP_AREA_GAP,
    // Takes the height the rejection alert leaves.
    flex: '1 1 0',
    minHeight: 0,
    padding: DROP_AREA_PADDING,
    textAlign: 'center',
    cursor: 'pointer',
    outline: 'none',
    overflow: 'hidden',
    border: `2px dashed ${theme.alpha(palette.primary.main, 0.35)}`,
    borderRadius: theme.spacing(3),
    backgroundColor: palette.background.paper,
    backgroundImage: [
      `radial-gradient(ellipse at top, ${theme.alpha(palette.primary.main, 0.12)}, transparent 65%)`,
      `radial-gradient(${theme.alpha(palette.text.primary, 0.09)} ${DOT_SIZE}px, transparent ${DOT_SIZE}px)`,
    ].join(', '),
    backgroundSize: `100% 100%, ${theme.spacing(DOT_GRID_SPACING)} ${theme.spacing(DOT_GRID_SPACING)}`,
    transition: theme.transitions.create([
      'border-color',
      'background-color',
      'box-shadow',
      'transform',
    ]),

    '&:hover': {
      borderColor: palette.primary.main,
      boxShadow: `0 24px 48px -24px ${theme.alpha(palette.primary.main, 0.45)}`,
    },

    '&:focus-visible': {
      borderColor: palette.primary.main,
      boxShadow: `0 0 0 4px ${theme.alpha(palette.primary.main, 0.25)}`,
    },

    '&[data-drag-active="true"]': {
      borderStyle: 'solid',
      borderColor: palette.primary.main,
      backgroundColor: theme.alpha(palette.primary.main, 0.06),
      boxShadow: `0 0 0 6px ${theme.alpha(palette.primary.main, 0.15)}`,
      transform: `scale(${DRAG_ACTIVE_SCALE})`,
      [`& ${IconBadge}`]: {
        animationPlayState: 'paused',
        boxShadow: `0 16px 40px -6px ${theme.alpha(palette.primary.main, 0.7)}`,
        '&::before': {
          animation: `${pulse} ${HALO_PULSE_DURATION}ms ease-out infinite`,
        },
      },
    },

    '&[data-drag-reject="true"]': {
      borderColor: palette.error.main,
      backgroundColor: theme.alpha(palette.error.main, 0.06),
      boxShadow: `0 0 0 6px ${theme.alpha(palette.error.main, 0.15)}`,
      [`& ${IconBadge}`]: {
        backgroundImage: `linear-gradient(135deg, ${palette.error.main}, ${palette.warning.main})`,
        boxShadow: `0 16px 40px -6px ${theme.alpha(palette.error.main, 0.6)}`,
        '&::before': {
          backgroundColor: theme.alpha(palette.error.main, 0.16),
        },
      },
    },

    '&[aria-disabled="true"]': {
      cursor: 'default',
      opacity: palette.action.disabledOpacity,
      pointerEvents: 'none',
      [`& ${IconBadge}`]: {
        animation: 'none',
      },
    },

    '@media (prefers-reduced-motion: reduce)': {
      transition: 'none',
      '&[data-drag-active="true"]': { transform: 'none' },
      [`& ${IconBadge}, & ${IconBadge}::before`]: {
        animation: 'none !important',
      },
    },
  };
});
