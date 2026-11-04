import { keepPreviousData } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import {
  useCountSessions,
  useCountSessionsByType,
  useGroupSessions,
  useGroupSessionsByType,
} from '@/api/generated/api';
import {
  type GroupSessionsParams,
  type SessionSearchValuesDto,
  type SessionStatus,
  SessionType,
} from '@/api/generated/model';
import { DEFAULT_TABLE_PAGE_SIZE } from '@/shared/constants';

import {
  DEFAULT_SEARCH_FIELD,
  REFETCH_INTERVAL_MS,
  SEARCH_DEBOUNCE_MS,
  type SessionSearchField,
} from '../consts';
import { mapSessions } from '../utils/map-session';
import { useDebouncedValue } from './use-debounced-value';

// Filtering, sorting and paging all happen on the server, so only the
// current page is ever fetched no matter how many sessions exist.
export const useSessionsTable = () => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_TABLE_PAGE_SIZE);
  const [search, setSearch] = useState('');
  const [searchField, setSearchField] =
    useState<SessionSearchField>(DEFAULT_SEARCH_FIELD);
  const [type, setType] = useState<SessionType | undefined>();
  const [status, setStatus] = useState<SessionStatus | undefined>();

  const debouncedSearch = useDebouncedValue(search.trim(), SEARCH_DEBOUNCE_MS);

  const searchValues: SessionSearchValuesDto = {
    ...(debouncedSearch && { [searchField]: debouncedSearch }),
    ...(status && { status }),
  };
  const params: GroupSessionsParams = {
    first_session_index: page * pageSize,
    number_of_sessions: pageSize,
  };
  const queryOptions = {
    placeholderData: keepPreviousData,
    refetchInterval: REFETCH_INTERVAL_MS,
  };
  const groupOptions = { ...queryOptions, select: mapSessions };
  // The type lives in the route, so each variant is its own endpoint; only
  // the one matching the current filter is enabled.
  const allTypesQuery = useGroupSessions(
    { search_values: searchValues },
    params,
    { query: { ...groupOptions, enabled: !type } },
  );
  const typeQuery = useGroupSessionsByType(
    type ?? SessionType.training,
    { search_values: searchValues },
    params,
    { query: { ...groupOptions, enabled: Boolean(type) } },
  );
  const query = type ? typeQuery : allTypesQuery;

  const allTypesCount = useCountSessions(searchValues, {
    query: { ...queryOptions, enabled: !type },
  });
  const typeCount = useCountSessionsByType(
    type ?? SessionType.training,
    searchValues,
    { query: { ...queryOptions, enabled: Boolean(type) } },
  );
  const total = (type ? typeCount : allTypesCount).data;

  const clampPage = () => {
    if (total !== undefined && page > 0 && page * pageSize >= total) {
      setPage(Math.max(0, Math.ceil(total / pageSize) - 1));
    }
  };

  // E.g. after deleting the last row of the last page.
  useEffect(clampPage, [total, page, pageSize]);

  const changeSearch = (value: string) => {
    setSearch(value);
    setPage(0);
  };

  const changeSearchField = (value: SessionSearchField) => {
    setSearchField(value);
    setPage(0);
  };

  const changeType = (value: SessionType | undefined) => {
    setType(value);
    setPage(0);
  };

  const changeStatus = (value: SessionStatus | undefined) => {
    setStatus(value);
    setPage(0);
  };

  const changePageSize = (value: number) => {
    setPageSize(value);
    setPage(0);
  };

  return {
    query,
    total,
    page,
    pageSize,
    search,
    searchField,
    type,
    status,
    setPage,
    changeSearch,
    changeSearchField,
    changeType,
    changeStatus,
    changePageSize,
  };
};
