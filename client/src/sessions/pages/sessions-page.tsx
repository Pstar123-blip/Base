import { Box, Stack, Typography } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { useState } from 'react';

import { useDeleteSession } from '@/api/generated/api';
import { ConfirmationDialog } from '@/shared/ui/confirmation-dialog';
import { ErrorState, LoadingState } from '@/shared/ui/states';

import { ImageViewer } from '../components/image-viewer';
import { SessionsTable } from '../components/sessions-table';
import { StaleDataNotice } from '../components/stale-data-notice';
import { useSessionsTable } from '../hooks/use-sessions-table';
import type { Session, ViewedImage } from '../types';

export const SessionsPage = () => {
  const table = useSessionsTable();
  // The session stays set while the dialog fades out so its text doesn't blank.
  const [pendingDelete, setPendingDelete] = useState<Session | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  // Held here, not in the row, so polling can't unmount the viewer.
  const [viewedImage, setViewedImage] = useState<ViewedImage | null>(null);

  const closeDialog = () => setDeleteOpen(false);

  const askDelete = (session: Session) => {
    setPendingDelete(session);
    setDeleteOpen(true);
  };

  const reportDeleted = () => {
    enqueueSnackbar('Session deleted', { variant: 'success' });
    table.refetch();
  };

  const deletion = useDeleteSession({
    mutation: {
      onSuccess: reportDeleted,
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

  const { sessions, total, isPending, isError } = table;

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4">Sessions</Typography>
        <Typography color="text.secondary">
          Browse, search and manage all sessions.
        </Typography>
      </Box>
      <Box>
        {isPending && !isError && <LoadingState />}
        {table.isRefetchError && (
          <StaleDataNotice updatedAt={table.dataUpdatedAt} />
        )}
        {isError && (
          <ErrorState message="Unable to load sessions" retry={table.refetch} />
        )}
        {sessions && total !== undefined && (
          <SessionsTable
            sessions={sessions}
            total={total}
            filters={table.filters}
            page={table.page}
            pageSize={table.pageSize}
            onFilterChange={table.changeFilters}
            onPageChange={table.setPage}
            onPageSizeChange={table.changePageSize}
            onDelete={askDelete}
            onOpenImage={setViewedImage}
          />
        )}
      </Box>
      <ConfirmationDialog
        open={deleteOpen}
        busy={deletion.isPending}
        title="Delete session?"
        description={`Session ${pendingDelete?.id ?? ''} will be permanently deleted.`}
        onCancel={closeDialog}
        onConfirm={confirmDelete}
      />
      {viewedImage && (
        <ImageViewer
          src={viewedImage.src}
          alt={viewedImage.alt}
          onClose={() => setViewedImage(null)}
        />
      )}
    </Stack>
  );
};
