import { type ImagePickerConfig } from '@/shared/components/image-pickers-step/image-pickers-step';
import { IMAGE_ACCEPT, IMAGE_ACCEPT_DESCRIPTION } from '@/shared/constants';

export const INFERENCE_STEPS = {
  upload: { id: 'upload', label: 'Upload' },
  selectType: { id: 'select-type', label: 'Select type' },
} as const;

export const UPLOAD_TITLE = 'Upload files';
export const UPLOAD_SUBTITLE = `Add two images (${IMAGE_ACCEPT_DESCRIPTION}) to continue.`;

export const FIRST_IMAGE_PICKER: ImagePickerConfig = {
  label: 'First image',
  description: IMAGE_ACCEPT_DESCRIPTION,
  accept: IMAGE_ACCEPT,
};

export const SECOND_IMAGE_PICKER: ImagePickerConfig = {
  label: 'Second image',
  description: IMAGE_ACCEPT_DESCRIPTION,
  accept: IMAGE_ACCEPT,
};
