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
  SessionStatus,
  SessionType,
} from '@/api/generated/model';
import { DEFAULT_TABLE_PAGE_SIZE } from '@/shared/constants';
import { useDebouncedValue } from '@/shared/hooks/use-debounced-value';

import type { SessionFilters, SessionSearchFilters } from '../types';
import { getActiveSearchFilters } from '../utils/get-active-search-filters';
import { mapSessions } from '../utils/map-session';
import {
  REFETCH_INTERVAL_MS,
  SEARCH_DEBOUNCE_MS,
} from './use-sessions-table.consts';

// Filtering, sorting and paging all happen on the server, so only the
// current page is ever fetched no matter how many sessions exist.
export const useSessionsTable = () => {
  const [requestedPage, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_TABLE_PAGE_SIZE);
  const [searchFilters, setSearchFilters] = useState<SessionSearchFilters>({});
  const [type, setType] = useState<SessionType>();
  const [status, setStatus] = useState<SessionStatus>();

  // Only the typed text is debounced; the type and status dropdowns apply at
  // once.
  const debouncedSearch = useDebouncedValue(searchFilters, SEARCH_DEBOUNCE_MS);

  // Go back to the first page when the filters the server sees change, not
  // while the user is still typing.
  const [applied, setApplied] = useState({ debouncedSearch, type, status });

  if (
    applied.debouncedSearch !== debouncedSearch ||
    applied.type !== type ||
    applied.status !== status
  ) {
    setApplied({ debouncedSearch, type, status });
    setPage(0);
  }

  const searchValues: SessionSearchValuesDto = {
    ...getActiveSearchFilters(debouncedSearch),
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

  // Keep the requested page in step, so a later change in the total can't
  // bring the table back to a page the user has left.
  if (page !== requestedPage) {
    setPage(page);
  }

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
    const { type: nextType, status: nextStatus, ...search } = patch;

    if ('type' in patch) {
      setType(nextType);
    }

    if ('status' in patch) {
      setStatus(nextStatus);
    }

    if (Object.keys(search).length) {
      setSearchFilters((current) => ({ ...current, ...search }));
    }
  };

  const changePageSize = (value: number) => {
    setPageSize(value);
    setPage(0);
  };

  const refetch = () => {
    void query.refetch();
    void countQuery.refetch();
  };

  return {
    sessions: query.data,
    total,
    isPending: query.isPending || countQuery.isPending,
    // A failed background refetch keeps its data, so the table stays up.
    isError:
      (query.isError && !query.data) ||
      (countQuery.isError && total === undefined),
    isRefetchError: query.isRefetchError || countQuery.isRefetchError,
    dataUpdatedAt: query.dataUpdatedAt,
    page,
    pageSize,
    filters: { ...searchFilters, type, status },
    refetch,
    setPage,
    changeFilters,
    changePageSize,
  };
};
