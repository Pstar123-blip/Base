import {
  createRootRoute,
  createRoute,
  createRouter,
  type ErrorComponentProps,
} from '@tanstack/react-router';

import { Dashboard } from '@/app/dashboard/dashboard';
import { requireSession } from '@/core/auth/require-session';
import { NotFoundPage } from '@/core/pages/not-found-page';
import { SigningIn } from '@/core/pages/signing-in';
import { UnauthorizedRoute } from '@/core/pages/unauthorized-route';
import { ErrorState } from '@/shared/ui/states';

import { Layout } from './layout/layout/layout';
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

// Authentication is enforced by the root; this route only supplies the layout.
const layoutRoute = createRoute({
  getParentRoute: () => root,
  id: 'layout',
  component: Layout,
});

const index = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/',
  component: Dashboard,
});
export const createAppRouter = () => createRouter({
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
