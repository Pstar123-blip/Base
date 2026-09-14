import {
  Alert,
  AppBar,
  Box,
  Button,
  Container,
  Paper,
  Snackbar,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import {
  createRootRoute,
  createRoute,
  createRouter,
  Link,
  Outlet,
  redirect,
  useNavigate,
} from '@tanstack/react-router';
import { useEffect, useState } from 'react';

import { getMeQueryOptions } from '@/api/generated/api';
import type { UserDto } from '@/api/generated/model';
import { logout } from '@/api/http';
import { ConfirmationDialog } from '@/components/confirmation-dialog';
import { DataTable } from '@/components/data-table';
import { ErrorState, LoadingState } from '@/components/states';
import { ensureSession } from '@/lib/auth';
import { queryClient } from '@/lib/query';
import { useSession, useUi } from '@/lib/store';

const ERROR_AUTO_HIDE_DURATION_MS = 6000;

function Root() {
  const { error, notify } = useUi();
  return (
    <>
      <Outlet />
      <Snackbar
        open={!!error}
        autoHideDuration={ERROR_AUTO_HIDE_DURATION_MS}
        onClose={() => notify(null)}
      >
        <Alert severity="error" onClose={() => notify(null)}>
          {error}
        </Alert>
      </Snackbar>
    </>
  );
}

const root = createRootRoute({
  component: Root,
  notFoundComponent: () => (
    <Container sx={{ py: 8 }}>
      <Typography variant="h4">Page not found</Typography>
      <Link to="/">Return home</Link>
    </Container>
  ),
  errorComponent: ({ error }) => (
    <ErrorState
      message={error instanceof Error ? error.message : 'Something went wrong'}
    />
  ),
  pendingComponent: LoadingState,
});

function AuthenticationError() {
  return (
    <Container maxWidth="sm" sx={{ py: 10 }}>
      <Stack spacing={3}>
        <Typography variant="h4">Unable to sign in</Typography>
        <Alert severity="error">
          We couldn’t sign you in to your workspace. Try again, or contact your
          administrator if the problem continues.
        </Alert>
        <Button component={Link} to="/" preload={false} variant="contained">
          Try again
        </Button>
      </Stack>
    </Container>
  );
}

const authErrorRoute = createRoute({
  getParentRoute: () => root,
  path: '/auth-error',
  component: AuthenticationError,
});

const signedOutRoute = createRoute({
  getParentRoute: () => root,
  path: '/signed-out',
  component: () => (
    <Container maxWidth="sm" sx={{ py: 10 }}>
      <Stack spacing={3}>
        <Typography variant="h4">You’re signed out</Typography>
        <Button component={Link} to="/" preload={false} variant="contained">
          Return home
        </Button>
      </Stack>
    </Container>
  ),
});

const loginRoute = createRoute({
  getParentRoute: () => root,
  path: '/login',
  beforeLoad: () => {
    throw redirect({ to: '/', replace: true });
  },
});

function Layout() {
  const [confirm, setConfirm] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const token = useSession((state) => state.accessToken);
  const navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      if (!signingOut) void navigate({ to: '/auth-error', replace: true });
    }
  }, [token, navigate, signingOut]);
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Project starter
          </Typography>
          <Button color="inherit" onClick={() => setConfirm(true)}>
            Sign out
          </Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ py: 4 }}>
        <Outlet />
      </Container>
      <ConfirmationDialog
        open={confirm}
        busy={signingOut}
        title="Sign out?"
        description="You can sign back in at any time."
        onCancel={() => setConfirm(false)}
        onConfirm={() => {
          setSigningOut(true);
          void logout()
            .then(async () => {
              await queryClient.cancelQueries();
              queryClient.clear();
              await navigate({ to: '/signed-out', replace: true });
            })
            .catch(() =>
              useUi.getState().notify('Sign out failed. Please try again.'),
            )
            .finally(() => setSigningOut(false));
        }}
      />
    </>
  );
}

const protectedRoute = createRoute({
  getParentRoute: () => root,
  id: 'authenticated',
  beforeLoad: async () => {
    try {
      await ensureSession();
    } catch {
      throw redirect({ to: '/auth-error', replace: true });
    }
  },
  pendingComponent: () => (
    <Container sx={{ py: 8 }}>
      <Typography variant="h4">Welcome</Typography>
      <Typography>Signing you in to your workspace…</Typography>
      <LoadingState />
    </Container>
  ),
  pendingMs: 0,
  component: Layout,
});

function Dashboard() {
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
}

const index = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/',
  component: Dashboard,
});
export const router = createRouter({
  routeTree: root.addChildren([
    loginRoute,
    authErrorRoute,
    signedOutRoute,
    protectedRoute.addChildren([index]),
  ]),
  defaultPreload: 'intent',
});
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
