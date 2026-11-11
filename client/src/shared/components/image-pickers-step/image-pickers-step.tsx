import {
  ImagePicker,
  type ImagePickerProps,
} from '@/shared/components/image-picker/image-picker';
import { StepHeader } from '@/shared/components/step-header/step-header';

import { ImagePickersStepRoot, PickersGrid } from './image-pickers-step.styles';

/** A picker's static setup, without the state that drives it. */
export type ImagePickerConfig = Pick<
  ImagePickerProps,
  'label' | 'description' | 'accept'
>;

type ImagePickersStepProps = {
  title: string;
  subtitle?: string;
  /** One single-image picker each, laid out side by side when there's room. */
  pickers: ImagePickerProps[];
};

/** A step that collects a fixed set of single images, one picker per image. */
export const ImagePickersStep = ({
  title,
  subtitle,
  pickers,
}: ImagePickersStepProps) => (
  <ImagePickersStepRoot>
    <StepHeader title={title} subtitle={subtitle} />
    <PickersGrid>
      {pickers.map((picker) => (
        // Labels name the pickers, so they're unique within a step.
        <ImagePicker key={picker.label} {...picker} />
      ))}
    </PickersGrid>
  </ImagePickersStepRoot>
);
