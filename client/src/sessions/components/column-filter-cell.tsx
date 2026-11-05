import { MenuItem, TableCell } from '@mui/material';
import type { ChangeEvent } from 'react';

import type { SessionStatus, SessionType } from '@/api/generated/model';

import {
  ALL_STATUSES,
  ALL_TYPES,
  COLUMN_FILTERS,
  FILTER_INPUT_SIZE,
  SEARCH_MAX_LENGTH,
  SESSION_STATUS_LABELS,
  SESSION_STATUSES,
  SESSION_TYPE_LABELS,
  SESSION_TYPES,
  type SessionColumnId,
  type SessionFilters,
} from '../consts';
import { FilterInput } from './column-filter-cell.styles';

const renderType = (type: SessionType) => (
  <MenuItem key={type} value={type}>
    {SESSION_TYPE_LABELS[type]}
  </MenuItem>
);

const renderStatus = (status: SessionStatus) => (
  <MenuItem key={status} value={status}>
    {SESSION_STATUS_LABELS[status]}
  </MenuItem>
);

export const ColumnFilterCell = ({
  column,
  filters,
  onChange,
}: {
  column: SessionColumnId;
  filters: SessionFilters;
  onChange: (patch: SessionFilters) => void;
}) => {
  const filter = COLUMN_FILTERS[column];

  if (!filter) {
    return <TableCell />;
  }

  if (filter.kind === 'text') {
    const { field } = filter;
    const changeText = (event: ChangeEvent<HTMLInputElement>) =>
      onChange({ [field]: event.target.value });

    return (
      <TableCell>
        <FilterInput
          size="small"
          placeholder="Filter"
          value={filters[field] ?? ''}
          onChange={changeText}
          slotProps={{
            htmlInput: {
              maxLength: SEARCH_MAX_LENGTH,
              size: FILTER_INPUT_SIZE,
            },
          }}
        />
      </TableCell>
    );
  }

  if (filter.kind === 'type') {
    const changeType = (event: ChangeEvent<HTMLInputElement>) =>
      onChange({
        type:
          event.target.value === ALL_TYPES
            ? undefined
            : (event.target.value as SessionType),
      });

    return (
      <TableCell>
        <FilterInput
          select
          size="small"
          value={filters.type ?? ALL_TYPES}
          onChange={changeType}
        >
          <MenuItem value={ALL_TYPES}>All</MenuItem>
          {SESSION_TYPES.map(renderType)}
        </FilterInput>
      </TableCell>
    );
  }

  const changeStatus = (event: ChangeEvent<HTMLInputElement>) =>
    onChange({
      status:
        event.target.value === ALL_STATUSES
          ? undefined
          : (event.target.value as SessionStatus),
    });

  return (
    <TableCell>
      <FilterInput
        select
        size="small"
        value={filters.status ?? ALL_STATUSES}
        onChange={changeStatus}
      >
        <MenuItem value={ALL_STATUSES}>All</MenuItem>
        {SESSION_STATUSES.map(renderStatus)}
      </FilterInput>
    </TableCell>
  );
};
