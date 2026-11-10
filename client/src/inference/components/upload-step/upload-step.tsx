import { type DropzoneOptions } from 'react-dropzone';

import { FileDropzone } from '@/shared/components/file-dropzone/file-dropzone';
import { RemoveButton } from '@/shared/components/remove-button/remove-button';
import { StepHeader } from '@/shared/components/step-header/step-header';
import { useObjectUrl } from '@/shared/hooks/use-object-url';

import {
  FIRST_IMAGE_SLOT,
  SECOND_IMAGE_SLOT,
  UPLOAD_SUBTITLE,
  UPLOAD_TITLE,
} from './consts';
import {
  DroppedImageTile,
  DropzoneSlot,
  SlotsGrid,
  UploadStepRoot,
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
      <DropzoneSlot>
        <FileDropzone
          value={[]}
          onChange={([dropped]) => onChange(dropped ?? null)}
          label={label}
          description={description}
          accept={accept}
          multiple={false}
        />
      </DropzoneSlot>
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
        <RemoveButton label={removeLabel} onClick={() => onChange(null)} />
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
    <StepHeader title={UPLOAD_TITLE} subtitle={UPLOAD_SUBTITLE} />
    <SlotsGrid>
      <ImageSlot
        {...FIRST_IMAGE_SLOT}
        file={firstImage}
        onChange={onFirstImageChange}
      />
      <ImageSlot
        {...SECOND_IMAGE_SLOT}
        file={secondImage}
        onChange={onSecondImageChange}
      />
    </SlotsGrid>
  </UploadStepRoot>
);
