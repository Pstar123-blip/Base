import { Checkbox, Radio } from '@mui/material';

import { type ChoiceOption, type ChoiceValue } from '../types';
import {
  OptionDescription,
  OptionText,
  OptionTile,
  OptionTitle,
} from './choice-tile.styles';

type ChoiceTileProps<TValue extends ChoiceValue> = {
  option: ChoiceOption<TValue>;
  /** Checkbox when true, radio otherwise. */
  multiple: boolean;
  name?: string;
  checked: boolean;
  disabled: boolean;
  error: boolean;
  onToggle: (value: TValue) => void;
};

export const ChoiceTile = <TValue extends ChoiceValue>({
  option,
  multiple,
  name,
  checked,
  disabled,
  error,
  onToggle,
}: ChoiceTileProps<TValue>) => {
  const Control = multiple ? Checkbox : Radio;

  return (
    <OptionTile checked={checked} disabled={disabled} error={error}>
      <Control
        size="small"
        disableRipple
        name={name}
        value={option.value}
        checked={checked}
        disabled={disabled}
        onChange={() => onToggle(option.value)}
      />
      <OptionText>
        <OptionTitle>{option.label}</OptionTitle>
        {option.description != null && (
          <OptionDescription>{option.description}</OptionDescription>
        )}
      </OptionText>
    </OptionTile>
  );
};
