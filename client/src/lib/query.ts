import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { HttpStatusCode, isAxiosError } from 'axios';
import { enqueueSnackbar } from 'notistack';

const QUERY_STALE_TIME_MS = 30_000;
const QUERY_GC_TIME_MS = 5 * 60_000;
const MAX_QUERY_RETRIES = 2;

const notify = (error: Error) => {
  enqueueSnackbar(
    isAxiosError(error) && typeof error.response?.data?.message === 'string'
      ? error.response.data.message
      : error.message,
    { variant: 'error' },
  );
};

const shouldRetryQuery = (count: number, error: Error) =>
  count < MAX_QUERY_RETRIES &&
  (!isAxiosError(error) ||
    !error.response ||
    error.response.status >= HttpStatusCode.InternalServerError);

export const queryClient = new QueryClient({
  queryCache: new QueryCache({ onError: notify }),
  mutationCache: new MutationCache({ onError: notify }),
  defaultOptions: {
    queries: {
      staleTime: QUERY_STALE_TIME_MS,
      gcTime: QUERY_GC_TIME_MS,
      refetchOnWindowFocus: false,
      retry: shouldRetryQuery,
    },
    mutations: { retry: false },
  },
});
