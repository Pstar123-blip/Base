import { useState } from 'react';

import { Steps } from '@/shared/components/steps/steps';
import type { StepItem } from '@/shared/components/steps/types';
import { SESSION_TYPE_LABELS } from '@/shared/session-types/consts';

import { UploadStep } from '../components/upload-step/upload-step';
import { EVALUATION_STEPS } from '../consts';
import {
  EvaluationPageRoot,
  EvaluationPageTitle,
} from './evaluation-page.styles';

export const EvaluationPage = () => {
  // Held here, not in the step, so the files survive moving between steps.
  const [images, setImages] = useState<File[]>([]);

  // Not wired to the API yet.
  const finish = () => {};

  const steps: StepItem[] = [
    {
      ...EVALUATION_STEPS.upload,
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
