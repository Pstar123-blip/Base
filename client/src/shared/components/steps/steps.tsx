import { Step, StepButton, Typography } from '@mui/material';

import { useStepNavigation } from './hooks/use-step-navigation';
import { StepIndicator } from './step-indicator/step-indicator';
import {
  StepPanel,
  StepsConnector,
  StepsRoot,
  StepsStepper,
} from './steps.styles';
import { StepsActions } from './steps-actions/steps-actions';
import { type StepItem, type StepsLabels } from './types';
import { resolveLabels } from './utils/resolve-labels';

export type StepsProps = {
  steps: readonly StepItem[];
  /** Controlled active step index. Omit to let the component manage it. */
  activeStep?: number;
  /** Initial step when uncontrolled. Defaults to `0`. */
  defaultActiveStep?: number;
  /**
   * Called with the new index whenever the active step changes: when the user
   * navigates, or when the requested step is pulled back because an earlier
   * step became incomplete.
   */
  onStepChange?: (index: number) => void;
  /**
   * Called when the user clicks the finish button on the last step. Not
   * guarded against repeated clicks: set `isFinishing` while handling it.
   */
  onFinish: () => void;
  /**
   * Shows a loading state on the finish button and locks navigation, e.g.
   * while submitting. Also what prevents `onFinish` from firing twice.
   */
  isFinishing?: boolean;
  labels?: Partial<StepsLabels>;
};

export const Steps = ({
  steps,
  activeStep,
  defaultActiveStep,
  onStepChange,
  onFinish,
  isFinishing = false,
  labels,
}: StepsProps) => {
  const navigation = useStepNavigation({
    steps,
    activeStep,
    defaultActiveStep,
    onStepChange,
  });
  const { activeIndex, currentStep } = navigation;

  if (!currentStep) {
    return null;
  }

  const resolvedLabels = resolveLabels(labels);

  const renderStep = (step: StepItem, index: number) => {
    const isReachable = navigation.isReachable(index);

    return (
      <Step key={step.id} completed={step.isComplete} disabled={!isReachable}>
        {/* Only the button is locked while finishing, so the step styling
            keeps reflecting reachability. */}
        <StepButton
          disabled={isFinishing || !isReachable}
          onClick={() => navigation.goTo(index)}
          icon={
            <StepIndicator
              status={navigation.getStatus(step, index)}
              completed={step.isComplete}
              index={index}
            />
          }
          optional={
            step.optional && (
              <Typography variant="caption" color="text.secondary">
                {resolvedLabels.optional}
              </Typography>
            )
          }
        >
          {step.label}
        </StepButton>
      </Step>
    );
  };

  return (
    <StepsRoot>
      <StepsStepper
        nonLinear
        activeStep={activeIndex}
        connector={<StepsConnector />}
      >
        {steps.map(renderStep)}
      </StepsStepper>
      {/* Keyed so the enter animation replays on every step change. */}
      <StepPanel key={currentStep.id}>{currentStep.content}</StepPanel>
      <StepsActions
        isFirstStep={navigation.isFirstStep}
        isLastStep={navigation.isLastStep}
        canProceed={navigation.canProceed}
        isFinishing={isFinishing}
        labels={resolvedLabels}
        onBack={navigation.goBack}
        onNext={navigation.goNext}
        onFinish={onFinish}
      />
    </StepsRoot>
  );
};
