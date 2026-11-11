import { useState } from 'react';

import { ImagePickersStep } from '@/shared/components/image-pickers-step/image-pickers-step';
import { PageLayout } from '@/shared/components/page-layout/page-layout';
import { Steps } from '@/shared/components/steps/steps';
import type { StepItem } from '@/shared/components/steps/types';
import { SESSION_TYPE_LABELS } from '@/shared/session-type-constants';

import { SelectTypeStep } from '../components/select-type-step/select-type-step';
import {
  FIRST_IMAGE_PICKER,
  INFERENCE_STEPS,
  SECOND_IMAGE_PICKER,
  UPLOAD_SUBTITLE,
  UPLOAD_TITLE,
} from '../consts';

export const InferencePage = () => {
  // Held here, not in the step, so the files survive moving between steps.
  const [firstImage, setFirstImage] = useState<File | null>(null);
  const [secondImage, setSecondImage] = useState<File | null>(null);

  // Not wired to the API yet.
  const finish = () => {};

  const steps: StepItem[] = [
    {
      ...INFERENCE_STEPS.upload,
      content: (
        <ImagePickersStep
          title={UPLOAD_TITLE}
          subtitle={UPLOAD_SUBTITLE}
          pickers={[
            {
              ...FIRST_IMAGE_PICKER,
              value: firstImage,
              onChange: setFirstImage,
            },
            {
              ...SECOND_IMAGE_PICKER,
              value: secondImage,
              onChange: setSecondImage,
            },
          ]}
        />
      ),
      isComplete: !!firstImage && !!secondImage,
    },
    {
      ...INFERENCE_STEPS.selectType,
      content: <SelectTypeStep />,
      // Empty for now: derive from its state once it has content.
      isComplete: true,
    },
  ];

  return (
    <PageLayout title={SESSION_TYPE_LABELS.inference}>
      <Steps steps={steps} onFinish={finish} />
    </PageLayout>
  );
};
