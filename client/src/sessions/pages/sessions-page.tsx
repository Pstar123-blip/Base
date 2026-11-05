import { Box, Stack, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { useState } from 'react';

import { useDeleteSession } from '@/api/generated/api';
import { ConfirmationDialog } from '@/shared/ui/confirmation-dialog';
import { ErrorState, LoadingState } from '@/shared/ui/states';

import { SessionsTable } from '../components/sessions-table';
import { SESSIONS_QUERY_PATH_SUFFIXES } from '../consts';
import { useSessionsTable } from '../hooks/use-sessions-table';
import type { Session } from '../utils/map-session';

export const SessionsPage = () => {
  const table = useSessionsTable();
  const queryClient = useQueryClient();
  const [pendingDelete, setPendingDelete] = useState<Session | null>(null);

  const closeDialog = () => setPendingDelete(null);
  // Every type variant of the group and count endpoints has its own query
  // key: [method, path, ...].
  const refreshSessions = () =>
    queryClient.invalidateQueries({
      predicate: ({ queryKey: [, path] }) =>
        typeof path === 'string' &&
        SESSIONS_QUERY_PATH_SUFFIXES.some((suffix) => path.endsWith(suffix)),
    });

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
      deletion.mutate({
        type: pendingDelete.type,
        sessionId: pendingDelete.id,
        params: { should_delete: true },
      });
    }
  };

  const retry = () => void table.query.refetch();

  const { data, isPending, isError } = table.query;
  const { total } = table;

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4">Sessions</Typography>
        <Typography color="text.secondary">
          Browse, search and manage all sessions.
        </Typography>
      </Box>
      <Box>
        {isPending && <LoadingState />}
        {isError && (
          <ErrorState message="Unable to load sessions" retry={retry} />
        )}
        {data && total !== undefined && (
          <SessionsTable
            sessions={data}
            total={total}
            filters={table.filters}
            page={table.page}
            pageSize={table.pageSize}
            onFilterChange={table.changeFilters}
            onPageChange={table.setPage}
            onPageSizeChange={table.changePageSize}
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
