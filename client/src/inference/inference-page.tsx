import { useState } from 'react';

import { SESSION_TYPE_LABELS } from '@/sessions/consts';
import { Steps } from '@/shared/components/steps/steps';
import type { StepItem } from '@/shared/components/steps/types';

import { INFERENCE_STEP_LABELS } from './consts';
import { InferencePageRoot, InferencePageTitle } from './inference-page.styles';
import { SelectTypeStep } from './steps/select-type/select-type-step';
import { UploadStep } from './steps/upload/upload-step';

export const InferencePage = () => {
  // Held here, not in the step, so the files survive moving between steps.
  const [firstImage, setFirstImage] = useState<File | null>(null);
  const [secondImage, setSecondImage] = useState<File | null>(null);

  // Not wired to the API yet.
  const finish = () => {};

  const steps: StepItem[] = [
    {
      id: 'upload',
      label: INFERENCE_STEP_LABELS.upload,
      content: (
        <UploadStep
          firstImage={firstImage}
          secondImage={secondImage}
          onFirstImageChange={setFirstImage}
          onSecondImageChange={setSecondImage}
        />
      ),
      isComplete: !!firstImage && !!secondImage,
    },
    {
      id: 'select-type',
      label: INFERENCE_STEP_LABELS.selectType,
      content: <SelectTypeStep />,
      // Empty for now: derive from its state once it has content.
      isComplete: true,
    },
  ];

  return (
    <InferencePageRoot>
      <InferencePageTitle>{SESSION_TYPE_LABELS.inference}</InferencePageTitle>
      <Steps steps={steps} onFinish={finish} />
    </InferencePageRoot>
  );
};
