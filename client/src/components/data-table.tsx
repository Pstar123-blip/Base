import {
  Box,
  Checkbox,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
} from '@mui/material';
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type OnChangeFn,
  type PaginationState,
  useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';

import { EmptyState } from './states';
type Props<T> = {
  data: T[];
  columns: ColumnDef<T>[];
  getRowId: (row: T) => string;
  serverPagination?: {
    state: PaginationState;
    onChange: OnChangeFn<PaginationState>;
    rowCount: number;
  };
};
export function DataTable<T>({
  data,
  columns,
  getRowId,
  serverPagination,
}: Props<T>) {
  const [filter, setFilter] = useState('');
  const table = useReactTable({
    data,
    columns,
    getRowId,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onGlobalFilterChange: setFilter,
    state: {
      globalFilter: filter,
      ...(serverPagination ? { pagination: serverPagination.state } : {}),
    },
    ...(serverPagination
      ? {
          manualPagination: true,
          rowCount: serverPagination.rowCount,
          onPaginationChange: serverPagination.onChange,
        }
      : {}),
    enableRowSelection: true,
  });
  return (
    <Box>
      <TextField
        label={serverPagination ? 'Filter current page' : 'Filter rows'}
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        size="small"
        sx={{ mb: 2 }}
      />
      <Box>
        {table.getAllLeafColumns().map((column) => (
          <FormControlLabel
            key={column.id}
            control={
              <Checkbox
                checked={column.getIsVisible()}
                onChange={column.getToggleVisibilityHandler()}
              />
            }
            label={column.id}
          />
        ))}
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                <TableCell padding="checkbox">
                  <Checkbox
                    inputProps={{ 'aria-label': 'Select current page' }}
                    checked={table.getIsAllPageRowsSelected()}
                    indeterminate={table.getIsSomePageRowsSelected()}
                    onChange={table.getToggleAllPageRowsSelectedHandler()}
                  />
                </TableCell>
                {group.headers.map((header) => (
                  <TableCell key={header.id}>
                    <TableSortLabel
                      active={!!header.column.getIsSorted()}
                      direction={
                        header.column.getIsSorted() === 'desc' ? 'desc' : 'asc'
                      }
                      disabled={!header.column.getCanSort()}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} selected={row.getIsSelected()}>
                <TableCell padding="checkbox">
                  <Checkbox
                    inputProps={{ 'aria-label': 'Select row ' + row.id }}
                    checked={row.getIsSelected()}
                    onChange={row.getToggleSelectedHandler()}
                  />
                </TableCell>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {!table.getRowModel().rows.length && <EmptyState />}
      <TablePagination
        component="div"
        count={
          serverPagination?.rowCount ?? table.getFilteredRowModel().rows.length
        }
        page={table.getState().pagination.pageIndex}
        rowsPerPage={table.getState().pagination.pageSize}
        onPageChange={(_, page) => table.setPageIndex(page)}
        onRowsPerPageChange={(event) =>
          table.setPageSize(Number(event.target.value))
        }
        rowsPerPageOptions={[10, 25, 50]}
      />
    </Box>
  );
}
