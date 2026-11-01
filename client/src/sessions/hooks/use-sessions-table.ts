import { keepPreviousData } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { useGroupSessions, useGroupSessionsByType } from '@/api/generated/api';
import { type GroupSessionsParams, SessionType } from '@/api/generated/model';
import { DEFAULT_TABLE_PAGE_SIZE } from '@/shared/constants';

import {
  DEFAULT_SEARCH_FIELD,
  REFETCH_INTERVAL_MS,
  SEARCH_DEBOUNCE_MS,
  type SessionSearchField,
} from '../consts';
import { mapSessionsPage } from '../utils/map-session';
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

  const debouncedSearch = useDebouncedValue(search.trim(), SEARCH_DEBOUNCE_MS);

  const params: GroupSessionsParams = {
    first_session_index: page * pageSize,
    number_of_sessions: pageSize,
    ...(debouncedSearch
      ? { search_values: { [searchField]: debouncedSearch } }
      : {}),
  };
  const queryOptions = {
    placeholderData: keepPreviousData,
    refetchInterval: REFETCH_INTERVAL_MS,
    select: mapSessionsPage,
  };
  // The type lives in the route, so each variant is its own endpoint; only
  // the one matching the current filter is enabled.
  const allTypesQuery = useGroupSessions(params, {
    query: { ...queryOptions, enabled: !type },
  });
  const typeQuery = useGroupSessionsByType(
    type ?? SessionType.training,
    params,
    {
      query: { ...queryOptions, enabled: Boolean(type) },
    },
  );
  const query = type ? typeQuery : allTypesQuery;

  const total = query.data?.total;

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

  const changePageSize = (value: number) => {
    setPageSize(value);
    setPage(0);
  };

  return {
    query,
    page,
    pageSize,
    search,
    searchField,
    type,
    setPage,
    changeSearch,
    changeSearchField,
    changeType,
    changePageSize,
  };
};
