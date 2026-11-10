import { type DropzoneOptions } from 'react-dropzone';

export const IMAGE_ACCEPT: DropzoneOptions['accept'] = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
};

export const IMAGE_ACCEPT_DESCRIPTION = 'JPEG or PNG';
