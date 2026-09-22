import { Typography } from '@mui/material';
import {
  createRootRoute,
  createRoute,
  createRouter,
  type ErrorComponentProps,
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
import { RouteContainer } from './router.styled';

const NotFound = () => (
  <RouteContainer>
    <Typography variant="h4">Page not found</Typography>
    <Link to="/">Return home</Link>
  </RouteContainer>
);
const RouteError = ({ error }: ErrorComponentProps) => (
  <ErrorState
    message={error instanceof Error ? error.message : 'Something went wrong'}
  />
);

const root = createRootRoute({
  component: Root,
  notFoundComponent: NotFound,
  errorComponent: RouteError,
  pendingComponent: LoadingState,
});

const getRootRoute = () => root;

const authErrorRoute = createRoute({
  getParentRoute: getRootRoute,
  path: '/auth-error',
  component: AuthenticationError,
});

const signedOutRoute = createRoute({
  getParentRoute: getRootRoute,
  path: '/signed-out',
  component: SignedOut,
});

const redirectToHome = () => {
  throw redirect({ to: '/', replace: true });
};

const loginRoute = createRoute({
  getParentRoute: getRootRoute,
  path: '/login',
  beforeLoad: redirectToHome,
});

const SigningIn = () => (
  <RouteContainer>
    <Typography variant="h4">Welcome</Typography>
    <Typography>Signing you in to your workspace…</Typography>
    <LoadingState />
  </RouteContainer>
);

const requireSession = async () => {
  try {
    await ensureSession();
  } catch {
    throw redirect({ to: '/auth-error', replace: true });
  }
};

const protectedRoute = createRoute({
  getParentRoute: getRootRoute,
  id: 'authenticated',
  beforeLoad: requireSession,
  pendingComponent: SigningIn,
  pendingMs: 0,
  component: Layout,
});

const getProtectedRoute = () => protectedRoute;

const index = createRoute({
  getParentRoute: getProtectedRoute,
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
