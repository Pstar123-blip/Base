import { useEffect, useEffectEvent, useState } from 'react';

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
  const requestedIndex = activeStep ?? uncontrolledStep;

  const hasSteps = steps.length > 0;
  const lastReachableIndex = getLastReachableIndex(steps);
  // Never show a step whose predecessors are incomplete, even if requested.
  // Floored at 0 so an empty list still yields a valid (if stepless) index.
  const activeIndex = Math.max(Math.min(requestedIndex, lastReachableIndex), 0);
  const currentStep = steps.at(activeIndex);

  const isReachable = (index: number) =>
    index >= 0 && index <= lastReachableIndex;

  const changeStep = (index: number) => {
    if (!isControlled) {
      setUncontrolledStep(index);
    }

    onStepChange?.(index);
  };

  // When the requested step gets clamped (e.g. an earlier step became
  // incomplete), commit the clamped index so the stored / parent state matches
  // what is shown and doesn't jump forward again once the step is fixed.
  // Skipped while there are no steps (e.g. still loading), so the requested
  // step survives until they arrive.
  const syncClampedStep = useEffectEvent(changeStep);

  useEffect(() => {
    if (hasSteps && activeIndex !== requestedIndex) {
      syncClampedStep(activeIndex);
    }
  }, [hasSteps, activeIndex, requestedIndex]);

  const goTo = (index: number) => {
    if (index !== activeIndex && isReachable(index)) {
      changeStep(index);
    }
  };

  const getStatus = (step: StepItem, index: number) =>
    getStepStatus({ step, index, activeIndex, lastReachableIndex });

  return {
    activeIndex,
    currentStep,
    isFirstStep: activeIndex === 0,
    isLastStep: hasSteps && activeIndex === steps.length - 1,
    canProceed: !!currentStep && canProceedFrom(currentStep),
    isReachable,
    getStatus,
    goTo,
    goBack: () => goTo(activeIndex - 1),
    goNext: () => goTo(activeIndex + 1),
  };
};
