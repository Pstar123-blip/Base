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
  SessionType,
} from '@/api/generated/model';
import { DEFAULT_TABLE_PAGE_SIZE } from '@/shared/constants';

import {
  REFETCH_INTERVAL_MS,
  SEARCH_DEBOUNCE_MS,
  type SessionFilters,
} from '../consts';
import { getActiveSearchFilters } from '../utils/get-active-search-filters';
import { mapSessions } from '../utils/map-session';
import { useDebouncedValue } from './use-debounced-value';

// Filtering, sorting and paging all happen on the server, so only the
// current page is ever fetched no matter how many sessions exist.
export const useSessionsTable = () => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_TABLE_PAGE_SIZE);
  const [filters, setFilters] = useState<SessionFilters>({});

  // The inputs follow `filters` immediately; the server sees the debounced one.
  const { type, status, ...searchFilters } = useDebouncedValue(
    filters,
    SEARCH_DEBOUNCE_MS,
  );

  const searchValues: SessionSearchValuesDto = {
    ...getActiveSearchFilters(searchFilters),
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

  const changeFilters = (patch: SessionFilters) => {
    setFilters((current) => ({ ...current, ...patch }));
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
    filters,
    setPage,
    changeFilters,
    changePageSize,
  };
};
