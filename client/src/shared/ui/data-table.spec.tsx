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
          { id: '1', username: 'alice' },
          { id: '2', username: 'bob' },
        ]}
        columns={[{ accessorKey: 'username', header: 'Username' }]}
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
    expect(screen.queryByText('alice')).toBeNull();
    expect(screen.getByText('bob')).toBeTruthy();
    fireEvent.click(screen.getByLabelText('username'));
    expect(screen.queryByText('bob')).toBeNull();
  });
  it('reports remote page changes without slicing the loaded page again', () => {
    const changes: unknown[] = [];
    render(
      <DataTable
        data={[{ id: '11', username: 'page-two' }]}
        columns={[{ accessorKey: 'username', header: 'Username' }]}
        getRowId={(row) => row.id}
        serverPagination={{
          state: { pageIndex: 1, pageSize: 10 },
          rowCount: 25,
          onChange: (change) => changes.push(change),
        }}
      />,
    );
    expect(screen.getByText('page-two')).toBeTruthy();
    fireEvent.click(screen.getByLabelText('Go to next page'));
    expect(changes).toHaveLength(1);
  });
});
