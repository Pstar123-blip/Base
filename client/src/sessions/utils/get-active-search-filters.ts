import { SEARCH_FIELD_LABELS, type SessionSearchFilters } from '../consts';

const searchFields = Object.keys(SEARCH_FIELD_LABELS) as Array<
  keyof SessionSearchFilters
>;

// The trimmed, non-blank text filters; blank ones are not sent to the server.
export const getActiveSearchFilters = (filters: SessionSearchFilters) =>
  Object.fromEntries(
    searchFields
      .map((field) => [field, filters[field]?.trim()] as const)
      .filter(([, value]) => value),
  );
