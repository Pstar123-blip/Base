import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import {
  getCountSessionsByTypeQueryOptions,
  getCountSessionsQueryOptions,
  getGroupSessionsByTypeQueryOptions,
  getGroupSessionsQueryOptions,
} from '@/api/generated/api';
import type {
  GroupSessionsParams,
  SessionSearchValuesDto,
} from '@/api/generated/model';
import { DEFAULT_TABLE_PAGE_SIZE } from '@/shared/constants';

import {
  REFETCH_INTERVAL_MS,
  SEARCH_DEBOUNCE_MS,
  type SessionFilters,
  type SessionSearchFilters,
} from '../consts';
import { getActiveSearchFilters } from '../utils/get-active-search-filters';
import { mapSessions } from '../utils/map-session';
import { useDebouncedValue } from './use-debounced-value';

// Filtering, sorting and paging all happen on the server, so only the
// current page is ever fetched no matter how many sessions exist.
export const useSessionsTable = () => {
  const [requestedPage, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_TABLE_PAGE_SIZE);
  const [filters, setFilters] = useState<SessionFilters>({});

  // Only the typed text is debounced; the type and status dropdowns apply at
  // once. The text is keyed as a string so unchanged values don't count as a
  // change.
  const { type, status } = filters;
  const searchKey = JSON.stringify(getActiveSearchFilters(filters));
  const debouncedSearchKey = useDebouncedValue(searchKey, SEARCH_DEBOUNCE_MS);

  // Go back to the first page when the filters the server sees change, not
  // while the user is still typing.
  const appliedKey = `${debouncedSearchKey}|${type ?? ''}|${status ?? ''}`;
  const [lastAppliedKey, setLastAppliedKey] = useState(appliedKey);

  if (lastAppliedKey !== appliedKey) {
    setLastAppliedKey(appliedKey);
    setPage(0);
  }

  const searchValues: SessionSearchValuesDto = {
    ...(JSON.parse(debouncedSearchKey) as SessionSearchFilters),
    ...(status && { status }),
  };
  const queryOptions = {
    placeholderData: keepPreviousData,
    refetchInterval: REFETCH_INTERVAL_MS,
  };

  // The type lives in the route, so each variant is its own endpoint.
  const countQuery = useQuery(
    type
      ? getCountSessionsByTypeQueryOptions(type, searchValues, {
          query: queryOptions,
        })
      : getCountSessionsQueryOptions(searchValues, { query: queryOptions }),
  );
  const total = countQuery.data;

  // E.g. after deleting the last row of the last page.
  const lastPage =
    total === undefined
      ? requestedPage
      : Math.max(0, Math.ceil(total / pageSize) - 1);
  const page = Math.min(requestedPage, lastPage);

  const params: GroupSessionsParams = {
    first_session_index: page * pageSize,
    number_of_sessions: pageSize,
  };
  const groupOptions = { ...queryOptions, select: mapSessions };
  const query = useQuery(
    type
      ? getGroupSessionsByTypeQueryOptions(
          type,
          { search_values: searchValues },
          params,
          { query: groupOptions },
        )
      : getGroupSessionsQueryOptions({ search_values: searchValues }, params, {
          query: groupOptions,
        }),
  );

  const changeFilters = (patch: SessionFilters) => {
    setFilters((current) => ({ ...current, ...patch }));
  };

  const changePageSize = (value: number) => {
    setPageSize(value);
    setPage(0);
  };

  return {
    query,
    countQuery,
    total,
    page,
    pageSize,
    filters,
    setPage,
    changeFilters,
    changePageSize,
  };
};
