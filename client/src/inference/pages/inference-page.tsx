import { useState } from 'react';

import { PageLayout } from '@/shared/components/page-layout/page-layout';
import { Steps } from '@/shared/components/steps/steps';
import type { StepItem } from '@/shared/components/steps/types';
import { SESSION_TYPE_LABELS } from '@/shared/session-types/consts';

import { SelectTypeStep } from '../components/select-type-step/select-type-step';
import { UploadStep } from '../components/upload-step/upload-step';
import { INFERENCE_STEPS } from '../consts';

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
