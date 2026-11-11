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
import { EvaluationPage } from '@/evaluation/pages/evaluation-page';
import { InferencePage } from '@/inference/pages/inference-page';
import { SESSIONS_PATH } from '@/sessions/consts';
import { SessionsPage } from '@/sessions/pages/sessions-page';
import { SESSION_TYPE_PATHS } from '@/shared/session-type-constants';
import { ErrorState } from '@/shared/ui/states';
import { TrainingPage } from '@/training/pages/training-page';

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
const sessions = createRoute({
  getParentRoute: () => layoutRoute,
  path: SESSIONS_PATH,
  component: SessionsPage,
});
const training = createRoute({
  getParentRoute: () => layoutRoute,
  path: SESSION_TYPE_PATHS.training,
  component: TrainingPage,
});
const inference = createRoute({
  getParentRoute: () => layoutRoute,
  path: SESSION_TYPE_PATHS.inference,
  component: InferencePage,
});
const evaluation = createRoute({
  getParentRoute: () => layoutRoute,
  path: SESSION_TYPE_PATHS.evaluation,
  component: EvaluationPage,
});

export const createAppRouter = () =>
  createRouter({
    routeTree: root.addChildren([
      unauthorizedRoute,
      layoutRoute.addChildren([
        index,
        sessions,
        training,
        inference,
        evaluation,
      ]),
    ]),
    defaultPreload: false,
  });

export const router = createAppRouter();
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
