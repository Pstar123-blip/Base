import SearchIcon from '@mui/icons-material/Search';
import { InputAdornment, MenuItem } from '@mui/material';
import type { ChangeEvent } from 'react';

import { SessionStatus, SessionType } from '@/api/generated/model';

import {
  ALL_STATUSES,
  ALL_TYPES,
  SEARCH_FIELD_LABELS,
  SEARCH_MAX_LENGTH,
  SESSION_STATUS_LABELS,
  SESSION_TYPE_LABELS,
  type SessionSearchField,
} from '../consts';
import {
  SearchInput,
  SelectInput,
  ToolbarRoot,
} from './sessions-toolbar.styles';

const sessionTypes = Object.values(SessionType);
const sessionStatuses = Object.values(SessionStatus);
const searchFields = Object.keys(SEARCH_FIELD_LABELS) as SessionSearchField[];

const renderSearchField = (field: SessionSearchField) => (
  <MenuItem key={field} value={field}>
    {SEARCH_FIELD_LABELS[field]}
  </MenuItem>
);

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

export const SessionsToolbar = ({
  search,
  searchField,
  type,
  status,
  onSearchChange,
  onSearchFieldChange,
  onTypeChange,
  onStatusChange,
}: {
  search: string;
  searchField: SessionSearchField;
  type: SessionType | undefined;
  status: SessionStatus | undefined;
  onSearchChange: (value: string) => void;
  onSearchFieldChange: (value: SessionSearchField) => void;
  onTypeChange: (value: SessionType | undefined) => void;
  onStatusChange: (value: SessionStatus | undefined) => void;
}) => {
  const changeSearch = (event: ChangeEvent<HTMLInputElement>) =>
    onSearchChange(event.target.value);
  const changeSearchField = (event: ChangeEvent<HTMLInputElement>) =>
    onSearchFieldChange(event.target.value as SessionSearchField);
  const changeType = (event: ChangeEvent<HTMLInputElement>) =>
    onTypeChange(
      event.target.value === ALL_TYPES
        ? undefined
        : (event.target.value as SessionType),
    );
  const changeStatus = (event: ChangeEvent<HTMLInputElement>) =>
    onStatusChange(
      event.target.value === ALL_STATUSES
        ? undefined
        : (event.target.value as SessionStatus),
    );

  return (
    <ToolbarRoot>
      <SelectInput
        select
        size="small"
        label="Search in"
        value={searchField}
        onChange={changeSearchField}
      >
        {searchFields.map(renderSearchField)}
      </SelectInput>
      <SearchInput
        size="small"
        label="Search"
        value={search}
        onChange={changeSearch}
        slotProps={{
          htmlInput: { maxLength: SEARCH_MAX_LENGTH },
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          },
        }}
      />
      <SelectInput
        select
        size="small"
        label="Type"
        value={type ?? ALL_TYPES}
        onChange={changeType}
      >
        <MenuItem value={ALL_TYPES}>All types</MenuItem>
        {sessionTypes.map(renderType)}
      </SelectInput>
      <SelectInput
        select
        size="small"
        label="Status"
        value={status ?? ALL_STATUSES}
        onChange={changeStatus}
      >
        <MenuItem value={ALL_STATUSES}>All statuses</MenuItem>
        {sessionStatuses.map(renderStatus)}
      </SelectInput>
    </ToolbarRoot>
  );
};
