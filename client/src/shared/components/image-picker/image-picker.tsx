import { type Accept } from 'react-dropzone';

import { FileDropzone } from '@/shared/components/file-dropzone/file-dropzone';
import { RemoveButton } from '@/shared/components/remove-button/remove-button';
import { IMAGE_ACCEPT } from '@/shared/constants';
import { useObjectUrl } from '@/shared/hooks/use-object-url';

import { getRemoveLabel } from './consts';
import { ImagePickerRoot, Preview } from './image-picker.styles';

export type ImagePickerProps = {
  /** Names the dropzone, and the remove button once an image is picked. */
  label: string;
  description?: string;
  /** Defaults to the app's accepted image types. */
  accept?: Accept;
  value: File | null;
  onChange: (file: File | null) => void;
  className?: string;
};

/**
 * Picks a single image. Shows a dropzone until one is picked, then a preview
 * of it in the same footprint, with a button to remove it.
 */
export const ImagePicker = ({
  label,
  description,
  accept = IMAGE_ACCEPT,
  value,
  onChange,
  className,
}: ImagePickerProps) => {
  const src = useObjectUrl(value);

  const pick = ([file]: File[]) => onChange(file ?? null);
  const clear = () => onChange(null);

  return (
    <ImagePickerRoot className={className}>
      {/* `src` is created right after a pick, before the browser paints. */}
      {value && src ? (
        <Preview
          src={src}
          alt={value.name}
          caption={value.name}
          fit="contain"
          action={
            <RemoveButton label={getRemoveLabel(label)} onClick={clear} />
          }
        />
      ) : (
        <FileDropzone
          value={[]}
          onChange={pick}
          label={label}
          description={description}
          accept={accept}
          multiple={false}
        />
      )}
    </ImagePickerRoot>
  );
};
