import { type StepItem, type StepStatus } from '../types';

/** Optional steps never block progress, even when incomplete. */
export const canProceedFrom = (step: StepItem) =>
  step.isComplete || !!step.optional;

/**
 * The furthest index the user may reach: every step up to and including the
 * first one that blocks progress. `-1` when there are no steps.
 */
export const getLastReachableIndex = (steps: readonly StepItem[]) => {
  const blockingIndex = steps.findIndex((step) => !canProceedFrom(step));

  return blockingIndex === -1 ? steps.length - 1 : blockingIndex;
};

export const getStepStatus = ({
  step,
  index,
  activeIndex,
  lastReachableIndex,
}: {
  step: StepItem;
  index: number;
  activeIndex: number;
  lastReachableIndex: number;
}): StepStatus => {
  if (index > lastReachableIndex) {
    return 'locked';
  }

  if (index === activeIndex) {
    return 'active';
  }

  return step.isComplete ? 'completed' : 'upcoming';
};
