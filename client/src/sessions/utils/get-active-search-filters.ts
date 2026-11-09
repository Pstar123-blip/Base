import { SEARCH_FIELDS } from '../consts';
import type { SessionSearchFilters } from '../types';

// The trimmed, non-blank text filters; blank ones are not sent to the server.
export const getActiveSearchFilters = (
  filters: SessionSearchFilters,
): SessionSearchFilters =>
  Object.fromEntries(
    SEARCH_FIELDS.map(
      (field) => [field, filters[field]?.trim()] as const,
    ).filter(([, value]) => value),
  );
