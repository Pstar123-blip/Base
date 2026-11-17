import { useQuery } from '@tanstack/react-query';

import { inferenceService } from '../services/inference-service';

export const STATISTICS_QUERY_KEY = ['inference', 'statistics'] as const;

export const useStatisticsQuery = () =>
  useQuery({
    queryKey: STATISTICS_QUERY_KEY,
    queryFn: ({ signal }) => inferenceService.fetchStatistics(signal),
  });
