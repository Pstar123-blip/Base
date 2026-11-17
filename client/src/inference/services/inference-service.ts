import { request } from '@/api/http';
import { env } from '@/lib/env';

const serviceUrl = `${env.apiUrl}/inference`;

export const inferenceService = {
  fetchStatistics: (signal?: AbortSignal) =>
    request<string[]>({
      url: `${serviceUrl}/statistics`,
      method: 'GET',
      signal,
    }),
};
