import { keepPreviousData } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { useListSessions } from '@/api/generated/api';
import type {
  ListSessionsParams,
  SessionSearchField,
  SessionSortField,
  SessionType,
  SortDirection,
} from '@/api/generated/model';
import { DEFAULT_TABLE_PAGE_SIZE } from '@/shared/constants';

import { SEARCH_DEBOUNCE_MS } from '../consts';
import { useDebouncedValue } from './use-debounced-value';

// Filtering, sorting and paging all happen on the server, so only the
// current page is ever fetched no matter how many sessions exist.
export const useSessionsTable = () => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_TABLE_PAGE_SIZE);
  const [search, setSearch] = useState('');
  const [searchField, setSearchField] = useState<SessionSearchField>('id');
  const [type, setType] = useState<SessionType | undefined>();
  const [sortBy, setSortBy] = useState<SessionSortField>('updatedAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const debouncedSearch = useDebouncedValue(search.trim(), SEARCH_DEBOUNCE_MS);

  const params: ListSessionsParams = {
    page,
    pageSize,
    searchField,
    sortBy,
    sortDirection,
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
    ...(type ? { type } : {}),
  };
  const query = useListSessions(params, {
    query: { placeholderData: keepPreviousData },
  });

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

  const toggleSort = (column: SessionSortField) => {
    if (column === sortBy) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }

    setPage(0);
  };

  return {
    query,
    page,
    pageSize,
    search,
    searchField,
    type,
    sortBy,
    sortDirection,
    setPage,
    changeSearch,
    changeSearchField,
    changeType,
    changePageSize,
    toggleSort,
  };
};
