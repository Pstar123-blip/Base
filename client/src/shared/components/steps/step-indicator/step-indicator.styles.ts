import {
  type CSSObject,
  keyframes,
  styled,
  type Theme,
} from '@mui/material/styles';

import { type StepStatus } from '../types';
import { ACTIVE_INDICATOR_SCALE, GLOW_PULSE_DURATION_MS } from './consts';

const glowPulse = keyframes`
  0%, 100% { opacity: 0.45; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.15); }
`;

const getStatusStyles = (theme: Theme): Record<StepStatus, CSSObject> => {
  const { palette } = theme.vars ?? theme;

  return {
    active: {
      color: palette.primary.contrastText,
      backgroundImage: `linear-gradient(135deg, ${palette.primary.main}, ${palette.secondary.main})`,
      borderColor: 'transparent',
      transform: `scale(${ACTIVE_INDICATOR_SCALE})`,
      boxShadow: `0 0 0 4px ${theme.alpha(palette.primary.main, 0.16)}`,
      '&::after': {
        content: '""',
        position: 'absolute',
        inset: 0,
        borderRadius: 'inherit',
        boxShadow: `0 0 18px 4px ${theme.alpha(palette.primary.main, 0.55)}`,
        pointerEvents: 'none',
        animation: `${glowPulse} ${GLOW_PULSE_DURATION_MS}ms ease-in-out infinite`,
        '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
      },
    },
    completed: {
      color: palette.primary.contrastText,
      backgroundColor: palette.primary.main,
      borderColor: palette.primary.main,
    },
    upcoming: {
      color: palette.primary.main,
      backgroundColor: palette.background.paper,
      borderColor: palette.primary.main,
    },
    locked: {
      color: palette.text.disabled,
      backgroundColor: palette.action.disabledBackground,
      borderColor: 'transparent',
    },
  };
};

type IndicatorCircleProps = { status: StepStatus };

const indicatorCircleStyles = ({
  theme,
  status,
}: IndicatorCircleProps & { theme: Theme }): CSSObject => ({
  position: 'relative',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: theme.spacing(4.5),
  height: theme.spacing(4.5),
  borderRadius: '50%',
  border: '2px solid',
  fontSize: theme.typography.body2.fontSize,
  fontWeight: theme.typography.fontWeightBold,
  transition: theme.transitions.create([
    'background-color',
    'border-color',
    'color',
    'box-shadow',
    'transform',
  ]),
  '& svg': { fontSize: theme.typography.h6.fontSize },
  ...getStatusStyles(theme)[status],
});
export const IndicatorCircle = styled('span', {
  shouldForwardProp: (prop) => prop !== 'status',
})<IndicatorCircleProps>(indicatorCircleStyles);
