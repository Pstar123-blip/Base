import { useState } from 'react';

import { SESSION_TYPE_LABELS } from '@/sessions/consts';
import { Steps } from '@/shared/components/steps/steps';
import type { StepItem } from '@/shared/components/steps/types';

import { TRAINING_STEP_LABELS } from './consts';
import { SelectFiltersStep } from './steps/select-filters/select-filters-step';
import { UploadStep } from './steps/upload/upload-step';
import { TrainingPageRoot, TrainingPageTitle } from './training-page.styles';

export const TrainingPage = () => {
  // Held here, not in the step, so the files survive moving between steps.
  const [firstImage, setFirstImage] = useState<File | null>(null);
  const [secondImage, setSecondImage] = useState<File | null>(null);

  // Not wired to the API yet.
  const finish = () => {};

  const steps: StepItem[] = [
    {
      id: 'upload',
      label: TRAINING_STEP_LABELS.upload,
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
      id: 'select-filters',
      label: TRAINING_STEP_LABELS.selectFilters,
      content: <SelectFiltersStep />,
      // Empty for now: derive from its state once it has content.
      isComplete: true,
    },
  ];

  return (
    <TrainingPageRoot>
      <TrainingPageTitle>{SESSION_TYPE_LABELS.training}</TrainingPageTitle>
      <Steps steps={steps} onFinish={finish} />
    </TrainingPageRoot>
  );
};
