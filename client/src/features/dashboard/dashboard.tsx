import { Box, Paper, Stack, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';

import { getMeQueryOptions } from '@/api/generated/api';
import type { UserDto } from '@/api/generated/model';
import { DataTable } from '@/shared/ui/data-table';
import { ErrorState, LoadingState } from '@/shared/ui/states';

export const Dashboard = () => {
  const me = useQuery(getMeQueryOptions());

  if (me.isPending) {
    return <LoadingState />;
  }

  if (me.isError) {
    return (
      <ErrorState
        message="Unable to load your account"
        retry={() => void me.refetch()}
      />
    );
  }

  const columns = [
    { accessorKey: 'username', header: 'Username' },
    { accessorKey: 'id', header: 'User ID' },
  ];
  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4">Your workspace</Typography>
        <Typography color="text.secondary">
          A foundation for your next project.
        </Typography>
      </Box>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Account
        </Typography>
        <DataTable<UserDto>
          data={[me.data]}
          columns={columns}
          getRowId={(row) => row.id}
        />
      </Paper>
    </Stack>
  );
};
