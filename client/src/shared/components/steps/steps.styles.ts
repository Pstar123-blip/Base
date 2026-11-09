import {
  Box,
  StepConnector,
  stepConnectorClasses,
  stepLabelClasses,
  Stepper,
} from '@mui/material';
import {
  type CSSObject,
  keyframes,
  styled,
  type Theme,
} from '@mui/material/styles';
import { visuallyHidden } from '@mui/utils';

import { CONNECTOR_THICKNESS_PX, STEP_ENTER_DURATION_MS } from './consts';

const stepEnter = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: none; }
`;

const stepsRootStyles = ({ theme }: { theme: Theme }): CSSObject => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(4),
});
export const StepsRoot = styled(Box)(stepsRootStyles);

const stepsStepperStyles = ({ theme }: { theme: Theme }): CSSObject => {
  const { palette } = theme.vars ?? theme;
  const label = `& .${stepLabelClasses.label}`;

  return {
    [label]: { transition: theme.transitions.create(['color', 'font-weight']) },
    [`${label}.${stepLabelClasses.active}`]: {
      color: palette.primary.main,
      fontWeight: theme.typography.fontWeightBold,
    },
    [`${label}.${stepLabelClasses.disabled}`]: { color: palette.text.disabled },
    // Too narrow for labels: show indicators only; the panel heading names
    // the current step. Hidden visually only, so it still names each button.
    [theme.breakpoints.down('sm')]: {
      [`& .${stepLabelClasses.labelContainer}`]: visuallyHidden,
      [`& .${stepLabelClasses.iconContainer}`]: { paddingRight: 0 },
    },
  };
};

export const StepsStepper = styled(Stepper)(stepsStepperStyles);

const stepsConnectorStyles = ({ theme }: { theme: Theme }): CSSObject => {
  const { palette } = theme.vars ?? theme;

  return {
    marginInline: theme.spacing(1),
    [`& .${stepConnectorClasses.line}`]: {
      height: CONNECTOR_THICKNESS_PX,
      border: 0,
      borderRadius: theme.shape.borderRadius,
      backgroundColor: palette.divider,
      transition: theme.transitions.create('background-color'),
    },
    // Lit along the path the user is allowed to travel.
    [`&:not(.${stepConnectorClasses.disabled}) .${stepConnectorClasses.line}`]:
      {
        backgroundImage: `linear-gradient(90deg, ${palette.primary.main}, ${palette.secondary.main})`,
      },
  };
};

export const StepsConnector = styled(StepConnector)(stepsConnectorStyles);

const stepPanelStyles = ({ theme }: { theme: Theme }): CSSObject => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  minHeight: theme.spacing(16),
  animation: `${stepEnter} ${STEP_ENTER_DURATION_MS}ms ${theme.transitions.easing.easeOut}`,
  '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
});
export const StepPanel = styled(Box)(stepPanelStyles);
