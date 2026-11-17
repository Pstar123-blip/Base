import { type ChoiceGroupProps, type ChoiceValue } from '../types';

/** The current selection as a list, whichever mode the group is in. */
export const getSelectedValues = <TValue extends ChoiceValue>(
  props: ChoiceGroupProps<TValue>,
): readonly TValue[] => {
  // `ChoiceGroupProps` is a union discriminated by `multiple`: only
  // `multiple: false` is single mode, so `true` or omitted both narrow
  // `props.value` to an array here.
  if (props.multiple !== false) {
    return props.value;
  }

  return props.value == null ? [] : [props.value];
};

export const toggleValue = <TValue extends ChoiceValue>(
  values: readonly TValue[],
  value: TValue,
): TValue[] =>
  values.includes(value)
    ? values.filter((v) => v !== value)
    : [...values, value];

/**
 * "Clear all" removes every enabled value; "select all" adds them. Values of
 * disabled options are left as they were either way.
 */
export const toggleAllValues = <TValue extends ChoiceValue>(
  values: readonly TValue[],
  enabledValues: readonly TValue[],
  allSelected: boolean,
): TValue[] => {
  if (!allSelected) {
    return [...new Set([...values, ...enabledValues])];
  }

  const enabled = new Set(enabledValues);

  return values.filter((v) => !enabled.has(v));
};
