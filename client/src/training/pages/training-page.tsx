import { useState } from 'react';

import { Steps } from '@/shared/components/steps/steps';
import type { StepItem } from '@/shared/components/steps/types';
import { SESSION_TYPE_LABELS } from '@/shared/session-types/consts';

import { SelectFiltersStep } from '../components/select-filters-step/select-filters-step';
import { UploadStep } from '../components/upload-step/upload-step';
import { TRAINING_STEPS } from '../consts';
import { TrainingPageRoot, TrainingPageTitle } from './training-page.styles';

export const TrainingPage = () => {
  // Held here, not in the step, so the files survive moving between steps.
  const [firstImage, setFirstImage] = useState<File | null>(null);
  const [secondImage, setSecondImage] = useState<File | null>(null);

  // Not wired to the API yet.
  const finish = () => {};

  const steps: StepItem[] = [
    {
      ...TRAINING_STEPS.upload,
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
      ...TRAINING_STEPS.selectFilters,
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
