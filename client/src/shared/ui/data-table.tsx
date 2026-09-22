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
} from '@mui/material';
import {
  type Cell,
  type Column,
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type Header,
  type HeaderGroup,
  type OnChangeFn,
  type PaginationState,
  type Row,
  useReactTable,
} from '@tanstack/react-table';
import { type ChangeEvent, type MouseEvent, useState } from 'react';

import { FilterField } from './data-table.styled';
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

export const DataTable = <T,>({
  data,
  columns,
  getRowId,
  serverPagination,
}: Props<T>) => {
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
  const changeFilter = (event: ChangeEvent<HTMLInputElement>) =>
    setFilter(event.target.value);
  const changePage = (
    _event: MouseEvent<HTMLButtonElement> | null,
    page: number,
  ) => table.setPageIndex(page);
  const changePageSize = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => table.setPageSize(Number(event.target.value));
  const renderCell = (cell: Cell<T, unknown>) => (
    <TableCell key={cell.id}>
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </TableCell>
  );
  const renderHeader = (header: Header<T, unknown>) => (
    <TableCell key={header.id}>
      <TableSortLabel
        active={!!header.column.getIsSorted()}
        direction={header.column.getIsSorted() === 'desc' ? 'desc' : 'asc'}
        disabled={!header.column.getCanSort()}
        onClick={header.column.getToggleSortingHandler()}
      >
        {header.isPlaceholder
          ? null
          : flexRender(header.column.columnDef.header, header.getContext())}
      </TableSortLabel>
    </TableCell>
  );
  const renderColumn = (column: Column<T, unknown>) => (
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
  );
  const renderHeaderGroup = (group: HeaderGroup<T>) => (
    <TableRow key={group.id}>
      <TableCell padding="checkbox">
        <Checkbox
          slotProps={{
            input: { 'aria-label': 'Select current page' },
          }}
          checked={table.getIsAllPageRowsSelected()}
          indeterminate={table.getIsSomePageRowsSelected()}
          onChange={table.getToggleAllPageRowsSelectedHandler()}
        />
      </TableCell>
      {group.headers.map(renderHeader)}
    </TableRow>
  );
  const renderRow = (row: Row<T>) => (
    <TableRow key={row.id} selected={row.getIsSelected()}>
      <TableCell padding="checkbox">
        <Checkbox
          slotProps={{
            input: { 'aria-label': 'Select row ' + row.id },
          }}
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
        />
      </TableCell>
      {row.getVisibleCells().map(renderCell)}
    </TableRow>
  );
  return (
    <Box>
      <FilterField
        label={serverPagination ? 'Filter current page' : 'Filter rows'}
        value={filter}
        onChange={changeFilter}
        size="small"
      />
      <Box>{table.getAllLeafColumns().map(renderColumn)}</Box>
      <TableContainer>
        <Table>
          <TableHead>
            {table.getHeaderGroups().map(renderHeaderGroup)}
          </TableHead>
          <TableBody>{table.getRowModel().rows.map(renderRow)}</TableBody>
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
        onPageChange={changePage}
        onRowsPerPageChange={changePageSize}
        rowsPerPageOptions={[10, 25, 50]}
      />
    </Box>
  );
};
