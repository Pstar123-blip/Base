import { useState } from 'react';

import { type StepItem } from '../types';
import {
  canProceedFrom,
  getLastReachableIndex,
  getStepStatus,
} from '../utils/step-navigation';

type UseStepNavigationOptions = {
  steps: readonly StepItem[];
  /** Controlled active index. Omit to keep the state internal. */
  activeStep?: number;
  defaultActiveStep?: number;
  onStepChange?: (index: number) => void;
};

export const useStepNavigation = ({
  steps,
  activeStep,
  defaultActiveStep = 0,
  onStepChange,
}: UseStepNavigationOptions) => {
  const [uncontrolledStep, setUncontrolledStep] = useState(defaultActiveStep);
  const isControlled = activeStep !== undefined;

  const lastReachableIndex = getLastReachableIndex(steps);
  // Never show a step whose predecessors are incomplete, even if requested.
  const activeIndex = Math.min(
    Math.max(activeStep ?? uncontrolledStep, 0),
    lastReachableIndex,
  );
  const currentStep = steps[activeIndex];

  const isReachable = (index: number) =>
    index >= 0 && index <= lastReachableIndex;

  const goTo = (index: number) => {
    if (index === activeIndex || !isReachable(index)) {
      return;
    }

    if (!isControlled) {
      setUncontrolledStep(index);
    }

    onStepChange?.(index);
  };

  const getStatus = (step: StepItem, index: number) =>
    getStepStatus({ step, index, activeIndex, lastReachableIndex });

  return {
    activeIndex,
    currentStep,
    isFirstStep: activeIndex === 0,
    isLastStep: activeIndex === steps.length - 1,
    canProceed: !!currentStep && canProceedFrom(currentStep),
    isReachable,
    getStatus,
    goTo,
    goBack: () => goTo(activeIndex - 1),
    goNext: () => goTo(activeIndex + 1),
  };
};
