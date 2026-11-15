import { TableCell } from '@mui/material';
import type { ChangeEvent } from 'react';

import {
  SESSION_TYPE_LABELS,
  SESSION_TYPES,
} from '@/shared/session-type-constants';
import { assertNever } from '@/shared/utils/assert-never';

import {
  COLUMN_FILTERS,
  SESSION_STATUS_LABELS,
  SESSION_STATUSES,
} from '../consts';
import type { SessionColumnId, SessionFilters } from '../types';
import {
  FILTER_INPUT_SIZE,
  SEARCH_MAX_LENGTH,
} from './column-filter-cell.consts';
import { FilterInput } from './column-filter-cell.styles';
import { SelectFilter } from './select-filter';

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

  switch (filter.kind) {
    case 'text': {
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

    case 'type':
      return (
        <TableCell>
          <SelectFilter
            value={filters.type}
            options={SESSION_TYPES}
            labels={SESSION_TYPE_LABELS}
            onChange={(type) => onChange({ type })}
          />
        </TableCell>
      );
    case 'status':
      return (
        <TableCell>
          <SelectFilter
            value={filters.status}
            options={SESSION_STATUSES}
            labels={SESSION_STATUS_LABELS}
            onChange={(status) => onChange({ status })}
          />
        </TableCell>
      );
    default:
      return assertNever(filter);
  }
};
