import { type ReactNode } from 'react';

export type StepItem = {
  /** Stable identifier, used as the React key. */
  id: string;
  label: ReactNode;
  /** Rendered while this step is active. */
  content: ReactNode;
  /**
   * Whether the step's requirements are met. Derive it from your own state
   * (e.g. form validity) so it stays live: the user can't move past a step
   * until it is complete.
   */
  isComplete: boolean;
  /** Optional steps never block progress, even when incomplete. */
  optional?: boolean;
};

/** Visual state of a step in the stepper header. */
export type StepStatus = 'active' | 'completed' | 'upcoming' | 'locked';

export type StepsLabels = {
  back: string;
  next: string;
  finish: string;
  optional: string;
};
