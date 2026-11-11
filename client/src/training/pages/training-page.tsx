import { useState } from 'react';

import { ImagePickersStep } from '@/shared/components/image-pickers-step/image-pickers-step';
import { PageLayout } from '@/shared/components/page-layout/page-layout';
import { Steps } from '@/shared/components/steps/steps';
import type { StepItem } from '@/shared/components/steps/types';
import { SESSION_TYPE_LABELS } from '@/shared/session-type-constants';

import { SelectFiltersStep } from '../components/select-filters-step/select-filters-step';
import {
  FIRST_IMAGE_PICKER,
  SECOND_IMAGE_PICKER,
  TRAINING_STEPS,
  UPLOAD_SUBTITLE,
  UPLOAD_TITLE,
} from '../consts';

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
      ...TRAINING_STEPS.selectFilters,
      content: <SelectFiltersStep />,
      // Empty for now: derive from its state once it has content.
      isComplete: true,
    },
  ];

  return (
    <PageLayout title={SESSION_TYPE_LABELS.training}>
      <Steps steps={steps} onFinish={finish} />
    </PageLayout>
  );
};
