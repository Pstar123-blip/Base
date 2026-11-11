import { ImagePicker } from '@/shared/components/image-picker/image-picker';
import { StepHeader } from '@/shared/components/step-header/step-header';

import {
  FIRST_IMAGE_PICKER,
  SECOND_IMAGE_PICKER,
  UPLOAD_SUBTITLE,
  UPLOAD_TITLE,
} from './consts';
import { PickersGrid, UploadStepRoot } from './upload-step.styles';

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
    <PickersGrid>
      <ImagePicker
        {...FIRST_IMAGE_PICKER}
        value={firstImage}
        onChange={onFirstImageChange}
      />
      <ImagePicker
        {...SECOND_IMAGE_PICKER}
        value={secondImage}
        onChange={onSecondImageChange}
      />
    </PickersGrid>
  </UploadStepRoot>
);
