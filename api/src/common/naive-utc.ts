// Serializes a Date as a naive ISO-8601 string in UTC (no timezone designator),
// e.g. "2026-11-09T12:00:00.000".
export const toNaiveUtc = (date: Date): string =>
  date.toISOString().replace(/Z$/, '');
