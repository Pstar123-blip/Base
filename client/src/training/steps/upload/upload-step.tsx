import { Tooltip } from '@mui/material';
import { type DropzoneOptions } from 'react-dropzone';

import { DeleteIcon } from '@/assets/icons/delete-icon';
import { FileDropzone } from '@/shared/components/file-dropzone/file-dropzone';
import { useObjectUrl } from '@/shared/hooks/use-object-url';

import {
  DroppedImageTile,
  RemoveButton,
  SlotsGrid,
  UploadHeader,
  UploadStepRoot,
  UploadSubtitle,
  UploadTitle,
} from './upload-step.styles';

type ImageSlotProps = {
  label: string;
  description: string;
  accept: DropzoneOptions['accept'];
  file: File | null;
  onChange: (file: File | null) => void;
};

const ImageSlot = ({
  label,
  description,
  accept,
  file,
  onChange,
}: ImageSlotProps) => {
  const src = useObjectUrl(file);

  // `src` is created right after a drop, before the browser paints.
  if (!file || !src) {
    return (
      <FileDropzone
        value={[]}
        onChange={([dropped]) => onChange(dropped ?? null)}
        label={label}
        description={description}
        accept={accept}
        multiple={false}
      />
    );
  }

  const removeLabel = `Remove ${label.toLowerCase()}`;

  return (
    <DroppedImageTile
      src={src}
      alt={file.name}
      caption={file.name}
      fit="contain"
      action={
        <Tooltip title={removeLabel}>
          <RemoveButton aria-label={removeLabel} onClick={() => onChange(null)}>
            <DeleteIcon />
          </RemoveButton>
        </Tooltip>
      }
    />
  );
};

type UploadStepProps = {
  firstImage: File | null;
  secondImage: File | null;
  onFirstImageChange: (file: File | null) => void;
  onSecondImageChange: (file: File | null) => void;
};

export const UploadStep = ({
  firstImage,
  secondImage,
  onFirstImageChange,
  onSecondImageChange,
}: UploadStepProps) => (
  <UploadStepRoot>
    <UploadHeader>
      <UploadTitle variant="h5">Upload files</UploadTitle>
      <UploadSubtitle variant="body2">
        Add a JPEG and a PNG to continue.
      </UploadSubtitle>
    </UploadHeader>
    <SlotsGrid>
      <ImageSlot
        label="First image"
        description="JPEG only"
        accept={{ 'image/jpeg': ['.jpg', '.jpeg'] }}
        file={firstImage}
        onChange={onFirstImageChange}
      />
      <ImageSlot
        label="Second image"
        description="PNG only"
        accept={{ 'image/png': ['.png'] }}
        file={secondImage}
        onChange={onSecondImageChange}
      />
    </SlotsGrid>
  </UploadStepRoot>
);
