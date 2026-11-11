import { type ImagePickerProps } from '@/shared/components/image-picker/image-picker';
import { JPEG_ACCEPT, PNG_ACCEPT } from '@/shared/constants';

type ImagePickerConfig = Pick<
  ImagePickerProps,
  'label' | 'description' | 'accept'
>;

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

/** Narrowest a picker gets before the pickers stack, in theme spacing units. */
export const PICKER_MIN_WIDTH = 40;
