import { useState } from 'react';

import { SESSION_TYPE_LABELS } from '@/sessions/consts';
import { Steps } from '@/shared/components/steps/steps';
import type { StepItem } from '@/shared/components/steps/types';

import { EVALUATION_STEP_LABELS } from './consts';
import {
  EvaluationPageRoot,
  EvaluationPageTitle,
} from './evaluation-page.styles';
import { UploadStep } from './steps/upload/upload-step';

export const EvaluationPage = () => {
  // Held here, not in the step, so the files survive moving between steps.
  const [images, setImages] = useState<File[]>([]);

  // Not wired to the API yet.
  const finish = () => {};

  const steps: StepItem[] = [
    {
      id: 'upload',
      label: EVALUATION_STEP_LABELS.upload,
      content: <UploadStep images={images} onImagesChange={setImages} />,
      isComplete: images.length > 0,
    },
  ];

  return (
    <EvaluationPageRoot>
      <EvaluationPageTitle>
        {SESSION_TYPE_LABELS.evaluation}
      </EvaluationPageTitle>
      <Steps steps={steps} onFinish={finish} />
    </EvaluationPageRoot>
  );
};
