import { type ImagePickerConfig } from '@/shared/components/image-pickers-step/image-pickers-step';
import { type StepsLabels } from '@/shared/components/steps/types';
import { JPEG_ACCEPT, PNG_ACCEPT } from '@/shared/constants';

export const TRAINING_STEPS = {
  upload: { id: 'upload', label: 'Upload' },
  selectType: { id: 'select-type', label: 'Select type' },
  summary: { id: 'summary', label: 'Summary' },
} as const;

export const TRAINING_STEPS_LABELS: Partial<StepsLabels> = {
  finish: 'Training',
};

export const UPLOAD_TITLE = 'Upload files';
export const UPLOAD_SUBTITLE = 'Add a JPEG and a PNG to continue.';

export const FIRST_IMAGE_PICKER: ImagePickerConfig = {
  label: 'First image',
  description: 'JPEG only',
  accept: JPEG_ACCEPT,
};

export const SECOND_IMAGE_PICKER: ImagePickerConfig = {
  label: 'Second image',
  description: 'PNG only',
  accept: PNG_ACCEPT,
};

export const REMOVE_LAST_SELECTION_REASON =
  'At least one selection is required.';
