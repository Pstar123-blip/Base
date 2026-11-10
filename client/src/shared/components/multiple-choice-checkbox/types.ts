import { type ReactNode } from 'react';

/** Option values are compared by identity and used as React keys. */
export type MultipleChoiceValue = string | number;

export type MultipleChoiceOption<TValue extends MultipleChoiceValue> = {
  value: TValue;
  label: ReactNode;
  /** Secondary text shown under the label. */
  description?: ReactNode;
  /** Disabled options keep their current state, even on "select all". */
  disabled?: boolean;
};
