import {
  Alert,
  AppBar,
  Box,
  Button,
  Container,
  Paper,
  Snackbar,
  Stack,
  TextField,
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
import { useForm } from 'react-hook-form';

import { getMeQueryOptions } from '@/api/generated/api';
import type { UserDto } from '@/api/generated/model';
import { http, logout, refreshSession } from '@/api/http';
import { ConfirmationDialog } from '@/components/confirmation-dialog';
import { DataTable } from '@/components/data-table';
import { ErrorState, LoadingState } from '@/components/states';
import {
  AUTH_ENDPOINTS,
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
} from '@/lib/auth.constants';
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
function Login() {
  const [registerMode, setRegisterMode] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<{ email: string; password: string }>();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const submit = handleSubmit(async (credentials) => {
    try {
      const { data } = await http.post<{ accessToken: string }>(
        registerMode ? AUTH_ENDPOINTS.register : AUTH_ENDPOINTS.login,
        credentials,
      );
      useSession.getState().setToken(data.accessToken);
      await queryClient.cancelQueries();
      queryClient.clear();
      await navigate({ to: '/' });
    } catch {
      setError('Unable to sign in. Check your details and try again.');
    }
  });
  return (
    <Container maxWidth="xs" sx={{ py: 10 }}>
      <Paper sx={{ p: 4 }}>
        <Stack component="form" onSubmit={submit} spacing={3}>
          <Typography variant="h4">
            {registerMode ? 'Create account' : 'Welcome back'}
          </Typography>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Email"
            type="email"
            autoComplete="email"
            error={!!errors.email}
            helperText={errors.email?.message}
            {...register('email', { required: 'Email is required' })}
          />
          <TextField
            label="Password"
            type="password"
            autoComplete={registerMode ? 'new-password' : 'current-password'}
            error={!!errors.password}
            helperText={errors.password?.message}
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: MIN_PASSWORD_LENGTH,
                message: `Use at least ${MIN_PASSWORD_LENGTH} characters`,
              },
              maxLength: MAX_PASSWORD_LENGTH,
            })}
          />
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {registerMode ? 'Create account' : 'Sign in'}
          </Button>
          <Button onClick={() => setRegisterMode(!registerMode)}>
            {registerMode ? 'Already have an account?' : 'Create an account'}
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
const loginRoute = createRoute({
  getParentRoute: () => root,
  path: '/login',
  component: Login,
});
function Layout() {
  const [confirm, setConfirm] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const token = useSession((state) => state.accessToken);
  const navigate = useNavigate();
  useEffect(() => {
    if (!token) void navigate({ to: '/login' });
  }, [token, navigate]);
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
              await navigate({ to: '/login' });
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
    if (!useSession.getState().accessToken) {
      try {
        await refreshSession();
      } catch {
        throw redirect({ to: '/login' });
      }
    }
  },
  component: Layout,
});
function Dashboard() {
  const me = useQuery(getMeQueryOptions());
  if (me.isPending) return <LoadingState />;
  if (me.isError)
    return (
      <ErrorState
        message="Unable to load your account"
        retry={() => void me.refetch()}
      />
    );
  const columns = [
    { accessorKey: 'email', header: 'Email' },
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
    protectedRoute.addChildren([index]),
  ]),
  defaultPreload: 'intent',
});
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
