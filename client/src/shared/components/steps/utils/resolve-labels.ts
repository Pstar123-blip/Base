import { DEFAULT_STEPS_LABELS } from '../consts';
import { type StepsLabels } from '../types';

/**
 * Fills in the defaults for any label not provided. Unlike a plain spread, an
 * explicit `undefined` (e.g. `{ next: undefined }`) also falls back to the
 * default instead of rendering nothing.
 */
export const resolveLabels = (labels: Partial<StepsLabels> = {}) => {
  const provided = Object.fromEntries(
    Object.entries(labels).filter(([, value]) => value !== undefined),
  ) as Partial<StepsLabels>;

  return { ...DEFAULT_STEPS_LABELS, ...provided };
};
