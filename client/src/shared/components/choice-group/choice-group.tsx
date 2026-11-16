import { FormControl, FormHelperText } from '@mui/material';
import { type FocusEvent, useId } from 'react';

import { OptionsList } from './choice-group.styles';
import { ChoiceGroupHeader } from './choice-group-header/choice-group-header';
import { ChoiceTile } from './choice-tile/choice-tile';
import { type ChoiceGroupProps, type ChoiceValue } from './types';
import {
  getSelectedValues,
  toggleAllValues,
  toggleValue,
} from './utils/selection';

/**
 * Pick options from a list of tiles: any number by default, or exactly one
 * with `multiple={false}`. Controlled, so it plugs straight into a
 * react-hook-form `Controller` via `field.value`/`field.onChange`.
 */
export const ChoiceGroup = <TValue extends ChoiceValue>(
  props: ChoiceGroupProps<TValue>,
) => {
  const {
    options,
    onBlur,
    label,
    helperText,
    error = false,
    disabled = false,
    required = false,
    name,
  } = props;
  const labelId = useId();
  // Radios only form a keyboard-navigable group when they share a name.
  const fallbackRadioName = useId();
  const isMultiple = props.multiple !== false;

  const selected = new Set(getSelectedValues(props));
  const enabledValues = options
    .filter((option) => !option.disabled)
    .map((option) => option.value);
  const selectedCount = options.filter((o) => selected.has(o.value)).length;
  const allSelected =
    enabledValues.length > 0 && enabledValues.every((v) => selected.has(v));

  const handleToggle = (value: TValue) => {
    if (isMultiple) {
      props.onChange(toggleValue(props.value, value));
    } else {
      props.onChange(value);
    }
  };

  const handleToggleAll = () => {
    if (isMultiple) {
      props.onChange(toggleAllValues(props.value, enabledValues, allSelected));
    }
  };

  // `onBlur` bubbles in React, so only report it once focus leaves the whole
  // group, not while moving between its inputs and buttons.
  const handleBlur = (event: FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      onBlur?.();
    }
  };

  return (
    <FormControl
      role={isMultiple ? 'group' : 'radiogroup'}
      aria-labelledby={label != null ? labelId : undefined}
      error={error}
      disabled={disabled}
      required={required}
      onBlur={handleBlur}
      fullWidth
    >
      <ChoiceGroupHeader
        label={label}
        labelId={labelId}
        bulkSelection={
          isMultiple
            ? {
                selectedCount,
                total: options.length,
                allSelected,
                disabled: disabled || enabledValues.length === 0,
                onToggleAll: handleToggleAll,
              }
            : undefined
        }
      />

      <OptionsList>
        {options.map((option) => (
          <ChoiceTile
            key={option.value}
            option={option}
            multiple={isMultiple}
            name={isMultiple ? name : (name ?? fallbackRadioName)}
            checked={selected.has(option.value)}
            disabled={disabled || !!option.disabled}
            error={error}
            onToggle={handleToggle}
          />
        ))}
      </OptionsList>

      {helperText != null && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};
