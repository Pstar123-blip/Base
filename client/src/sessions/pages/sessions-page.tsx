import { Box, Stack, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { useState } from 'react';

import { useDeleteSession } from '@/api/generated/api';
import { ConfirmationDialog } from '@/shared/ui/confirmation-dialog';
import { ErrorState, LoadingState } from '@/shared/ui/states';

import { SessionsTable } from '../components/sessions-table';
import { SessionsToolbar } from '../components/sessions-toolbar';
import { SESSIONS_GROUP_PATH_SUFFIX } from '../consts';
import { useSessionsTable } from '../hooks/use-sessions-table';
import type { Session } from '../utils/map-session';

export const SessionsPage = () => {
  const table = useSessionsTable();
  const queryClient = useQueryClient();
  const [pendingDelete, setPendingDelete] = useState<Session | null>(null);

  const closeDialog = () => setPendingDelete(null);
  // Every type variant of the group endpoint has its own query key.
  const refreshSessions = () =>
    queryClient.invalidateQueries({
      predicate: ({ queryKey: [path] }) =>
        typeof path === 'string' && path.endsWith(SESSIONS_GROUP_PATH_SUFFIX),
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
            fetching={isFetching}
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
