import { SessionType } from '@/api/generated/model';

export const INFERENCE_PATH = `/${SessionType.inference}` as const;

export const INFERENCE_STEP_LABELS = {
  upload: 'Upload',
  selectType: 'Select type',
} as const;
