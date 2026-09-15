import { Container, Typography } from '@mui/material';
import {
  createRootRoute,
  createRoute,
  createRouter,
  Link,
  redirect,
} from '@tanstack/react-router';

import { ensureSession } from '@/features/auth/auth';
import { AuthenticationError } from '@/features/auth/authentication-error';
import { SignedOut } from '@/features/auth/signed-out';
import { Dashboard } from '@/features/dashboard/dashboard';
import { ErrorState, LoadingState } from '@/shared/ui/states';

import { Layout } from './layout';
import { Root } from './root';

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

const authErrorRoute = createRoute({
  getParentRoute: () => root,
  path: '/auth-error',
  component: AuthenticationError,
});

const signedOutRoute = createRoute({
  getParentRoute: () => root,
  path: '/signed-out',
  component: SignedOut,
});

const loginRoute = createRoute({
  getParentRoute: () => root,
  path: '/login',
  beforeLoad: () => {
    throw redirect({ to: '/', replace: true });
  },
});

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
