import {
  createRootRoute,
  createRoute,
  createRouter,
  type ErrorComponentProps,
} from '@tanstack/react-router';

import { requireSession } from '@/core/auth/require-session';
import { SessionGate } from '@/core/auth/session-gate';
import { NotFoundPage } from '@/core/pages/not-found-page';
import { SigningIn } from '@/core/pages/signing-in';
import { UnauthorizedRoute } from '@/core/pages/unauthorized-route';
import { Dashboard } from '@/demo/dashboard/dashboard';
import { Layout } from '@/demo/layout/layout';
import { ErrorState } from '@/shared/ui/states';

import { Root } from './root';

const RouteError = ({ error }: ErrorComponentProps) => (
  <ErrorState
    message={error instanceof Error ? error.message : 'Something went wrong'}
  />
);

const root = createRootRoute({
  beforeLoad: requireSession,
  component: Root,
  notFoundComponent: NotFoundPage,
  errorComponent: RouteError,
  pendingComponent: SigningIn,
  pendingMs: 0,
  pendingMinMs: 0,
});

const unauthorizedRoute = createRoute({
  getParentRoute: () => root,
  path: '/unauthorized',
  component: UnauthorizedRoute,
});

// Replace these demo routes with your project pages. Root authentication applies to all of them.
const ProtectedLayout = () => (
  <SessionGate>
    <Layout />
  </SessionGate>
);

const layoutRoute = createRoute({
  getParentRoute: () => root,
  id: 'layout',
  component: ProtectedLayout,
});

const index = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/',
  component: Dashboard,
});
export const createAppRouter = () =>
  createRouter({
    routeTree: root.addChildren([
      unauthorizedRoute,
      layoutRoute.addChildren([index]),
    ]),
    defaultPreload: false,
  });

export const router = createAppRouter();
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
