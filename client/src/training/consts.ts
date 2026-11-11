import { type ImagePickerConfig } from '@/shared/components/image-pickers-step/image-pickers-step';
import { JPEG_ACCEPT, PNG_ACCEPT } from '@/shared/constants';

export const TRAINING_STEPS = {
  upload: { id: 'upload', label: 'Upload files' },
  selectFilters: { id: 'select-filters', label: 'Select filters' },
} as const;

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
