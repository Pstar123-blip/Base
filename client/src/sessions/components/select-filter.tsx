import { MenuItem } from '@mui/material';
import type { ChangeEvent } from 'react';

import { FilterInput } from './column-filter-cell.styles';
import { ALL_OPTION } from './select-filter.consts';

export const SelectFilter = <T extends string>({
  value,
  options,
  labels,
  onChange,
}: {
  value: T | undefined;
  options: readonly T[];
  labels: Record<T, string>;
  onChange: (value: T | undefined) => void;
}) => {
  const change = (event: ChangeEvent<HTMLInputElement>) =>
    onChange(
      event.target.value === ALL_OPTION ? undefined : (event.target.value as T),
    );

  return (
    <FilterInput
      select
      size="small"
      value={value ?? ALL_OPTION}
      onChange={change}
    >
      <MenuItem value={ALL_OPTION}>All</MenuItem>
      {options.map((option) => (
        <MenuItem key={option} value={option}>
          {labels[option]}
        </MenuItem>
      ))}
    </FilterInput>
  );
};
