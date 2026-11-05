import {
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material';
import type { ChangeEvent, MouseEvent } from 'react';

import { TABLE_PAGE_SIZE_OPTIONS } from '@/shared/constants';
import { EmptyState } from '@/shared/ui/empty-state';

import { SESSION_COLUMNS, type SessionFilters } from '../consts';
import type { Session } from '../utils/map-session';
import { ColumnFilterCell } from './column-filter-cell';
import type { ImageOpener } from './session-image';
import { SessionRow } from './session-row';
import { FilterRow, FitTable, TablePanel } from './sessions-table.styles';

type Column = (typeof SESSION_COLUMNS)[number];

export const SessionsTable = ({
  sessions,
  total,
  filters,
  page,
  pageSize,
  onFilterChange,
  onPageChange,
  onPageSizeChange,
  onDelete,
  onOpenImage,
}: {
  sessions: Session[];
  total: number;
  filters: SessionFilters;
  page: number;
  pageSize: number;
  onFilterChange: (patch: SessionFilters) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onDelete: (session: Session) => void;
  onOpenImage: ImageOpener;
}) => {
  const changePage = (
    _event: MouseEvent<HTMLButtonElement> | null,
    next: number,
  ) => onPageChange(next);
  const changePageSize = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => onPageSizeChange(Number(event.target.value));

  const renderHeader = (column: Column) => (
    <TableCell key={column.id}>{column.label}</TableCell>
  );

  const renderFilterCell = (column: Column) => (
    <ColumnFilterCell
      key={column.id}
      column={column.id}
      filters={filters}
      onChange={onFilterChange}
    />
  );

  const renderRow = (session: Session) => (
    <SessionRow
      key={session.id}
      session={session}
      onDelete={onDelete}
      onOpenImage={onOpenImage}
    />
  );

  return (
    <TablePanel>
      <TableContainer>
        <FitTable size="small">
          <TableHead>
            <TableRow>{SESSION_COLUMNS.map(renderHeader)}</TableRow>
            <FilterRow>{SESSION_COLUMNS.map(renderFilterCell)}</FilterRow>
          </TableHead>
          <TableBody>{sessions.map(renderRow)}</TableBody>
        </FitTable>
      </TableContainer>
      {/* total is authoritative: an empty page with a non-zero total is a stale page mid-refetch */}
      {!sessions.length && !total && <EmptyState message="No sessions found" />}
      <TablePagination
        component="div"
        count={total}
        page={page}
        rowsPerPage={pageSize}
        onPageChange={changePage}
        onRowsPerPageChange={changePageSize}
        rowsPerPageOptions={TABLE_PAGE_SIZE_OPTIONS}
      />
    </TablePanel>
  );
};
