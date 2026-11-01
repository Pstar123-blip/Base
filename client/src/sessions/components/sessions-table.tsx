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

import { SESSION_COLUMNS } from '../consts';
import type { Session } from '../utils/map-session';
import { SessionRow } from './session-row';
import { FetchIndicator, TablePanel, WideTable } from './sessions-table.styles';

type Column = (typeof SESSION_COLUMNS)[number];

export const SessionsTable = ({
  sessions,
  total,
  page,
  pageSize,
  fetching,
  onPageChange,
  onPageSizeChange,
  onDelete,
}: {
  sessions: Session[];
  total: number;
  page: number;
  pageSize: number;
  fetching: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onDelete: (session: Session) => void;
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

  const renderRow = (session: Session) => (
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
