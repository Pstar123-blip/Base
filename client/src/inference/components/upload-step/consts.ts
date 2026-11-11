import { type ImagePickerProps } from '@/shared/components/image-picker/image-picker';
import { IMAGE_ACCEPT, IMAGE_ACCEPT_DESCRIPTION } from '@/shared/constants';

type ImagePickerConfig = Pick<
  ImagePickerProps,
  'label' | 'description' | 'accept'
>;

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

/** Narrowest a picker gets before the pickers stack, in theme spacing units. */
export const PICKER_MIN_WIDTH = 40;
