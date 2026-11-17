import { type ReactNode } from 'react';

/** Option values are compared by identity and used as React keys. */
export type ChoiceValue = string | number;

export type ChoiceOption<TValue extends ChoiceValue> = {
  value: TValue;
  label: ReactNode;
  /** Secondary text shown under the label. */
  description?: ReactNode;
  /** Disabled options keep their current state, even on "select all". */
  disabled?: boolean;
};

type BaseProps<TValue extends ChoiceValue> = {
  options: readonly ChoiceOption<TValue>[];
  onBlur?: () => void;
  label?: ReactNode;
  helperText?: ReactNode;
  error?: boolean;
  disabled?: boolean;
  required?: boolean;
  /** Native input name, for plain form submission. */
  name?: string;
};

type MultipleSelectionProps<TValue extends ChoiceValue> = {
  /** Pick any number of options (the default). */
  multiple?: true;
  value: readonly TValue[];
  onChange: (value: TValue[]) => void;
};

type SingleSelectionProps<TValue extends ChoiceValue> = {
  /** Pick exactly one option, rendered as a radio group. */
  multiple: false;
  value: TValue | null;
  onChange: (value: TValue) => void;
};

/** `value`/`onChange` types follow `multiple`. */
export type ChoiceGroupProps<TValue extends ChoiceValue> = BaseProps<TValue> &
  (MultipleSelectionProps<TValue> | SingleSelectionProps<TValue>);
