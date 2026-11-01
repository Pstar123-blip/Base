import SearchIcon from '@mui/icons-material/Search';
import { InputAdornment, MenuItem } from '@mui/material';
import type { ChangeEvent } from 'react';

import { SessionType } from '@/api/generated/model';

import {
  ALL_TYPES,
  SEARCH_FIELD_LABELS,
  SEARCH_MAX_LENGTH,
  SESSION_TYPE_LABELS,
  type SessionSearchField,
} from '../consts';
import {
  SearchInput,
  SelectInput,
  ToolbarRoot,
} from './sessions-toolbar.styles';

const sessionTypes = Object.values(SessionType);
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

export const SessionsToolbar = ({
  search,
  searchField,
  type,
  onSearchChange,
  onSearchFieldChange,
  onTypeChange,
}: {
  search: string;
  searchField: SessionSearchField;
  type: SessionType | undefined;
  onSearchChange: (value: string) => void;
  onSearchFieldChange: (value: SessionSearchField) => void;
  onTypeChange: (value: SessionType | undefined) => void;
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
    </ToolbarRoot>
  );
};
