import { type StepsLabels } from '@/shared/components/steps/types';

export const EVALUATION_STEPS = {
  upload: { id: 'upload', label: 'Upload' },
  summary: { id: 'summary', label: 'Summary' },
} as const;

export const EVALUATION_STEPS_LABELS: Partial<StepsLabels> = {
  finish: 'Evaluate',
};
