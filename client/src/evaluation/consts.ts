import { SessionType } from '@/api/generated/model';

export const EVALUATION_PATH = `/${SessionType.evaluation}` as const;

export const EVALUATION_STEP_LABELS = {
  upload: 'Upload',
} as const;
