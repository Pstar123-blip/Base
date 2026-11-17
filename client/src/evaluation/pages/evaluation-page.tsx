import { useState } from 'react';

import { PageLayout } from '@/shared/components/page-layout/page-layout';
import { Steps } from '@/shared/components/steps/steps';
import type { StepItem } from '@/shared/components/steps/types';
import { SESSION_TYPE_LABELS } from '@/shared/session-type-constants';

import { EvaluationSummaryStep } from '../components/summary-step/summary-step';
import { UploadStep } from '../components/upload-step/upload-step';
import { EVALUATION_STEPS, EVALUATION_STEPS_LABELS } from '../consts';

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
    {
      ...EVALUATION_STEPS.summary,
      content: <EvaluationSummaryStep images={images} />,
      isComplete: true,
    },
  ];

  return (
    <PageLayout title={SESSION_TYPE_LABELS.evaluation}>
      <Steps steps={steps} onFinish={finish} labels={EVALUATION_STEPS_LABELS} />
    </PageLayout>
  );
};
