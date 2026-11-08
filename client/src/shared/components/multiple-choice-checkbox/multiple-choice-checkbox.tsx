import {
  Button,
  Checkbox,
  FormControl,
  FormHelperText,
  Typography,
} from '@mui/material';
import { type ReactNode, useId } from 'react';

import { CLEAR_ALL_LABEL, SELECT_ALL_LABEL } from './consts';
import {
  CountPill,
  GroupLabel,
  Header,
  HeaderActions,
  OptionsList,
  OptionText,
  OptionTile,
  OptionTitle,
} from './multiple-choice-checkbox.styles';
import { type MultipleChoiceOption, type MultipleChoiceValue } from './types';

export type MultipleChoiceCheckboxProps<TValue extends MultipleChoiceValue> = {
  options: readonly MultipleChoiceOption<TValue>[];
  value: readonly TValue[];
  onChange: (value: TValue[]) => void;
  onBlur?: () => void;
  label?: ReactNode;
  helperText?: ReactNode;
  error?: boolean;
  disabled?: boolean;
  required?: boolean;
  /** Native input name, for plain form submission. */
  name?: string;
};

/**
 * Pick any number of options from a grid of tiles. Controlled, so it plugs
 * straight into a react-hook-form `Controller` via `field.value`/`field.onChange`.
 */
export const MultipleChoiceCheckbox = <TValue extends MultipleChoiceValue>({
  options,
  value,
  onChange,
  onBlur,
  label,
  helperText,
  error = false,
  disabled = false,
  required = false,
  name,
}: MultipleChoiceCheckboxProps<TValue>) => {
  const labelId = useId();
  const selected = new Set(value);
  const selectedCount = options.filter((o) => selected.has(o.value)).length;
  const enabledValues = options.filter((o) => !o.disabled).map((o) => o.value);
  const allSelected =
    enabledValues.length > 0 && enabledValues.every((v) => selected.has(v));

  const toggle = (optionValue: TValue) =>
    onChange(
      selected.has(optionValue)
        ? value.filter((v) => v !== optionValue)
        : [...value, optionValue],
    );

  // Disabled options keep whatever state they had.
  const toggleAll = () =>
    onChange(
      allSelected
        ? value.filter((v) => !enabledValues.includes(v))
        : [...new Set([...value, ...enabledValues])],
    );

  return (
    <FormControl
      role="group"
      aria-labelledby={label ? labelId : undefined}
      error={error}
      disabled={disabled}
      required={required}
      onBlur={onBlur}
      fullWidth
    >
      <Header>
        {label && (
          <GroupLabel id={labelId} focused={false}>
            {label}
          </GroupLabel>
        )}
        <HeaderActions>
          <CountPill aria-live="polite">
            {selectedCount}/{options.length}
          </CountPill>
          <Button
            size="small"
            onClick={toggleAll}
            disabled={disabled || enabledValues.length === 0}
          >
            {allSelected ? CLEAR_ALL_LABEL : SELECT_ALL_LABEL}
          </Button>
        </HeaderActions>
      </Header>

      <OptionsList>
        {options.map((option) => {
          const checked = selected.has(option.value);
          const optionDisabled = disabled || !!option.disabled;

          return (
            <OptionTile
              key={option.value}
              checked={checked}
              disabled={optionDisabled}
              error={error}
            >
              <Checkbox
                size="small"
                disableRipple
                name={name}
                value={option.value}
                checked={checked}
                disabled={optionDisabled}
                onChange={() => toggle(option.value)}
              />
              <OptionText>
                <OptionTitle>{option.label}</OptionTitle>
                {option.description && (
                  <Typography variant="body2" color="text.secondary">
                    {option.description}
                  </Typography>
                )}
              </OptionText>
            </OptionTile>
          );
        })}
      </OptionsList>

      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};
