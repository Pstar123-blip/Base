import { SessionType } from '@/api/generated/model';

export const TRAINING_PATH = `/${SessionType.training}` as const;

export const TRAINING_STEP_LABELS = {
  upload: 'Upload',
  selectFilters: 'Select filters',
} as const;
