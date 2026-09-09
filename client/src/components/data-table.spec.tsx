// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { DataTable } from './data-table';
afterEach(cleanup);
describe('DataTable', () => {
  it('filters rows, selects by stable identity, and hides columns', () => {
    render(
      <DataTable
        data={[
          { id: '1', email: 'alice@example.com' },
          { id: '2', email: 'bob@example.com' },
        ]}
        columns={[{ accessorKey: 'email', header: 'Email' }]}
        getRowId={(row) => row.id}
      />,
    );
    fireEvent.click(screen.getByLabelText('Select row 1'));
    expect(
      (screen.getByLabelText('Select row 1') as HTMLInputElement).checked,
    ).toBe(true);
    fireEvent.change(screen.getByLabelText('Filter rows'), {
      target: { value: 'bob' },
    });
    expect(screen.queryByText('alice@example.com')).toBeNull();
    expect(screen.getByText('bob@example.com')).toBeTruthy();
    fireEvent.click(screen.getByLabelText('email'));
    expect(screen.queryByText('bob@example.com')).toBeNull();
  });
  it('reports remote page changes without slicing the loaded page again', () => {
    const changes: unknown[] = [];
    render(
      <DataTable
        data={[{ id: '11', email: 'page-two@example.com' }]}
        columns={[{ accessorKey: 'email', header: 'Email' }]}
        getRowId={(row) => row.id}
        serverPagination={{
          state: { pageIndex: 1, pageSize: 10 },
          rowCount: 25,
          onChange: (change) => changes.push(change),
        }}
      />,
    );
    expect(screen.getByText('page-two@example.com')).toBeTruthy();
    fireEvent.click(screen.getByLabelText('Go to next page'));
    expect(changes).toHaveLength(1);
  });
});
