import {
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from '@mui/material';
import type { ChangeEvent, MouseEvent } from 'react';

import type { SessionDto, SortDirection } from '@/api/generated/model';
import type { SessionSortField } from '@/api/generated/model';
import { TABLE_PAGE_SIZE_OPTIONS } from '@/shared/constants';
import { EmptyState } from '@/shared/ui/empty-state';

import { SESSION_COLUMNS } from '../consts';
import { SessionRow } from './session-row';
import { FetchIndicator, TablePanel, WideTable } from './sessions-table.styles';

type Column = (typeof SESSION_COLUMNS)[number];

export const SessionsTable = ({
  sessions,
  total,
  page,
  pageSize,
  sortBy,
  sortDirection,
  fetching,
  onPageChange,
  onPageSizeChange,
  onSort,
  onDelete,
}: {
  sessions: SessionDto[];
  total: number;
  page: number;
  pageSize: number;
  sortBy: SessionSortField;
  sortDirection: SortDirection;
  fetching: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSort: (column: SessionSortField) => void;
  onDelete: (session: SessionDto) => void;
}) => {
  const changePage = (
    _event: MouseEvent<HTMLButtonElement> | null,
    next: number,
  ) => onPageChange(next);
  const changePageSize = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => onPageSizeChange(Number(event.target.value));

  const renderHeader = (column: Column) => {
    const { sortBy: columnSort } = column;

    return (
      <TableCell
        key={column.id}
        sortDirection={columnSort === sortBy ? sortDirection : false}
      >
        {columnSort ? (
          <TableSortLabel
            active={columnSort === sortBy}
            direction={columnSort === sortBy ? sortDirection : 'asc'}
            onClick={() => onSort(columnSort)}
          >
            {column.label}
          </TableSortLabel>
        ) : (
          column.label
        )}
      </TableCell>
    );
  };

  const renderRow = (session: SessionDto) => (
    <SessionRow key={session.id} session={session} onDelete={onDelete} />
  );

  return (
    <TablePanel>
      {fetching ? (
        <FetchIndicator />
      ) : (
        <FetchIndicator variant="determinate" value={0} />
      )}
      <TableContainer>
        <WideTable size="small">
          <TableHead>
            <TableRow>{SESSION_COLUMNS.map(renderHeader)}</TableRow>
          </TableHead>
          <TableBody>{sessions.map(renderRow)}</TableBody>
        </WideTable>
      </TableContainer>
      {!sessions.length && <EmptyState message="No sessions found" />}
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
