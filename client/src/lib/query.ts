import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { HttpStatusCode, isAxiosError } from 'axios';

import { useUi } from './store';
const QUERY_STALE_TIME_MS = 30_000;
const QUERY_GC_TIME_MS = 5 * 60_000;
const MAX_QUERY_RETRIES = 2;

function notify(error: Error) {
  useUi
    .getState()
    .notify(
      isAxiosError(error) && typeof error.response?.data?.message === 'string'
        ? error.response.data.message
        : error.message,
    );
}
export const queryClient = new QueryClient({
  queryCache: new QueryCache({ onError: notify }),
  mutationCache: new MutationCache({ onError: notify }),
  defaultOptions: {
    queries: {
      staleTime: QUERY_STALE_TIME_MS,
      gcTime: QUERY_GC_TIME_MS,
      refetchOnWindowFocus: false,
      retry: (count, error) =>
        count < MAX_QUERY_RETRIES &&
        (!isAxiosError(error) ||
          !error.response ||
          error.response.status >= HttpStatusCode.InternalServerError),
    },
    mutations: { retry: false },
  },
});
