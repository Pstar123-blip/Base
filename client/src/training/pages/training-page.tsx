import { useState } from 'react';

import { CompareSummaryStep } from '@/shared/components/compare-summary-step/compare-summary-step';
import { ImagePickersStep } from '@/shared/components/image-pickers-step/image-pickers-step';
import { PageLayout } from '@/shared/components/page-layout/page-layout';
import type { Selection } from '@/shared/components/selection-list/types';
import { Steps } from '@/shared/components/steps/steps';
import type { StepItem } from '@/shared/components/steps/types';
import { SESSION_TYPE_LABELS } from '@/shared/session-type-constants';

import { SelectTypeStep } from '../components/select-type-step/select-type-step';
import {
  FIRST_IMAGE_PICKER,
  REMOVE_LAST_SELECTION_REASON,
  SECOND_IMAGE_PICKER,
  TRAINING_STEPS,
  TRAINING_STEPS_LABELS,
  UPLOAD_SUBTITLE,
  UPLOAD_TITLE,
} from '../consts';

export const TrainingPage = () => {
  // Held here, not in the step, so the files survive moving between steps.
  const [firstImage, setFirstImage] = useState<File | null>(null);
  const [secondImage, setSecondImage] = useState<File | null>(null);
  const [requiredType, setRequiredType] = useState<string | null>(null);

  // TODO: derive from the select step once it has content.
  const selections: Selection[] = [];

  // TODO: dispatch the removal to the selections state.
  const removeSelection = () => {};

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
      ...TRAINING_STEPS.selectType,
      content: (
        <SelectTypeStep
          requiredType={requiredType}
          onRequiredTypeChange={setRequiredType}
        />
      ),
      isComplete: requiredType !== null,
    },
    {
      ...TRAINING_STEPS.summary,
      content: (
        <CompareSummaryStep
          firstTitle={FIRST_IMAGE_PICKER.label}
          secondTitle={SECOND_IMAGE_PICKER.label}
          firstImage={firstImage}
          secondImage={secondImage}
          selections={selections}
          onRemoveSelection={removeSelection}
          // The last remaining selection can't be removed, so there is never
          // a way to cancel all of them.
          removeDisabledReason={
            selections.length > 1 ? undefined : REMOVE_LAST_SELECTION_REASON
          }
        />
      ),
      isComplete: true,
    },
  ];

  return (
    <PageLayout title={SESSION_TYPE_LABELS.training}>
      <Steps steps={steps} onFinish={finish} labels={TRAINING_STEPS_LABELS} />
    </PageLayout>
  );
};
