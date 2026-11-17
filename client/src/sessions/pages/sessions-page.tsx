import { Box, Stack, Typography } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { useState } from 'react';

import { useDeleteSession } from '@/api/generated/api';
import { ImageLightbox } from '@/shared/components/image-gallery/image-lightbox/image-lightbox';
import { ConfirmationDialog } from '@/shared/ui/confirmation-dialog';
import { ErrorState, LoadingState } from '@/shared/ui/states';

import { SessionsTable } from '../components/sessions-table';
import { StaleDataNotice } from '../components/stale-data-notice';
import { useSessionsTable } from '../hooks/use-sessions-table';
import type { Session, SessionAction, ViewedImage } from '../types';
import { SESSION_ACTIONS } from './sessions-page.consts';

export const SessionsPage = () => {
  const table = useSessionsTable();
  // The session stays set while the dialog fades out so its text doesn't blank.
  const [pendingSession, setPendingSession] = useState<Session | null>(null);
  const [pendingAction, setPendingAction] = useState<SessionAction>('delete');
  const [dialogOpen, setDialogOpen] = useState(false);
  const currentAction = SESSION_ACTIONS[pendingAction];
  // Held here, not in the row, so polling can't unmount the lightbox. The
  // image stays set while closing so the close transition still shows it.
  const [viewedImage, setViewedImage] = useState<ViewedImage | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const openImage = (image: ViewedImage) => {
    setViewedImage(image);
    setLightboxOpen(true);
  };

  const closeImage = () => setLightboxOpen(false);

  const closeDialog = () => setDialogOpen(false);

  const askAction = (action: SessionAction) => (session: Session) => {
    setPendingSession(session);
    setPendingAction(action);
    setDialogOpen(true);
  };

  const reportDone = () => {
    enqueueSnackbar(currentAction.successMessage, { variant: 'success' });
    table.refetch();
  };

  const removal = useDeleteSession({
    mutation: {
      onSuccess: reportDone,
      onSettled: closeDialog,
    },
  });

  const confirmAction = () => {
    if (pendingSession) {
      removal.mutate({
        type: pendingSession.type,
        sessionId: pendingSession.id,
        params: { should_delete: currentAction.shouldDelete },
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
            onDelete={askAction('delete')}
            onCancel={askAction('cancel')}
            onOpenImage={openImage}
          />
        )}
      </Box>
      <ConfirmationDialog
        open={dialogOpen}
        busy={removal.isPending}
        title={currentAction.title}
        description={currentAction.getDescription(pendingSession?.id ?? '')}
        onCancel={closeDialog}
        onConfirm={confirmAction}
      />
      {viewedImage && (
        <ImageLightbox
          open={lightboxOpen}
          image={viewedImage}
          imageId={viewedImage.src}
          index={0}
          total={1}
          onClose={closeImage}
          onNext={closeImage}
          onPrevious={closeImage}
        />
      )}
    </Stack>
  );
};
