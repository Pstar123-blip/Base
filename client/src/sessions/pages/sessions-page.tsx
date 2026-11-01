import { Box, Stack, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { useState } from 'react';

import { getListSessionsQueryKey, useDeleteSession } from '@/api/generated/api';
import type { SessionDto } from '@/api/generated/model';
import { ConfirmationDialog } from '@/shared/ui/confirmation-dialog';
import { ErrorState, LoadingState } from '@/shared/ui/states';

import { SessionsTable } from '../components/sessions-table';
import { SessionsToolbar } from '../components/sessions-toolbar';
import { useSessionsTable } from '../hooks/use-sessions-table';

export const SessionsPage = () => {
  const table = useSessionsTable();
  const queryClient = useQueryClient();
  const [pendingDelete, setPendingDelete] = useState<SessionDto | null>(null);

  const closeDialog = () => setPendingDelete(null);
  const refreshSessions = () =>
    queryClient.invalidateQueries({ queryKey: getListSessionsQueryKey() });

  const reportDeleted = () => {
    enqueueSnackbar('Session deleted', { variant: 'success' });
    void refreshSessions();
  };

  const reportDeleteError = () =>
    enqueueSnackbar('Unable to delete the session. Please try again.', {
      variant: 'error',
    });

  const deletion = useDeleteSession({
    mutation: {
      onSuccess: reportDeleted,
      onError: reportDeleteError,
      onSettled: closeDialog,
    },
  });

  const confirmDelete = () => {
    if (pendingDelete) {
      deletion.mutate({ id: pendingDelete.id });
    }
  };

  const retry = () => void table.query.refetch();

  const { data, isPending, isError, isFetching } = table.query;

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4">Sessions</Typography>
        <Typography color="text.secondary">
          Browse, search and manage all sessions.
        </Typography>
      </Box>
      <Box>
        <SessionsToolbar
          search={table.search}
          searchField={table.searchField}
          type={table.type}
          onSearchChange={table.changeSearch}
          onSearchFieldChange={table.changeSearchField}
          onTypeChange={table.changeType}
        />
        {isPending && <LoadingState />}
        {isError && (
          <ErrorState message="Unable to load sessions" retry={retry} />
        )}
        {data && (
          <SessionsTable
            sessions={data.items}
            total={data.total}
            page={table.page}
            pageSize={table.pageSize}
            sortBy={table.sortBy}
            sortDirection={table.sortDirection}
            fetching={isFetching}
            onPageChange={table.setPage}
            onPageSizeChange={table.changePageSize}
            onSort={table.toggleSort}
            onDelete={setPendingDelete}
          />
        )}
      </Box>
      <ConfirmationDialog
        open={Boolean(pendingDelete)}
        busy={deletion.isPending}
        title="Delete session?"
        description={`Session ${pendingDelete?.id ?? ''} will be permanently deleted.`}
        onCancel={closeDialog}
        onConfirm={confirmDelete}
      />
    </Stack>
  );
};
