import { useState } from 'react';

import { CompareSummaryStep } from '@/shared/components/compare-summary-step/compare-summary-step';
import { ImagePickersStep } from '@/shared/components/image-pickers-step/image-pickers-step';
import { PageLayout } from '@/shared/components/page-layout/page-layout';
import type { Selection } from '@/shared/components/selection-list/types';
import { Steps } from '@/shared/components/steps/steps';
import type { StepItem } from '@/shared/components/steps/types';
import { SESSION_TYPE_LABELS } from '@/shared/session-type-constants';

import { type Algorithm } from '../components/select-algorithms-step/consts';
import { SelectAlgorithmsStep } from '../components/select-algorithms-step/select-algorithms-step';
import {
  FIRST_IMAGE_PICKER,
  INFERENCE_STEPS,
  INFERENCE_STEPS_LABELS,
  SECOND_IMAGE_PICKER,
  UPLOAD_SUBTITLE,
  UPLOAD_TITLE,
} from '../consts';

export const InferencePage = () => {
  // Held here, not in the step, so the files survive moving between steps.
  const [firstImage, setFirstImage] = useState<File | null>(null);
  const [secondImage, setSecondImage] = useState<File | null>(null);
  const [algorithms, setAlgorithms] = useState<Algorithm[]>([]);

  // TODO: derive from the select step once it has content.
  const selections: Selection[] = [];

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
      ...INFERENCE_STEPS.selectAlgorithms,
      content: (
        <SelectAlgorithmsStep
          algorithms={algorithms}
          onAlgorithmsChange={setAlgorithms}
        />
      ),
      isComplete: algorithms.length > 0,
    },
    {
      ...INFERENCE_STEPS.summary,
      content: (
        <CompareSummaryStep
          firstTitle={FIRST_IMAGE_PICKER.label}
          secondTitle={SECOND_IMAGE_PICKER.label}
          firstImage={firstImage}
          secondImage={secondImage}
          selections={selections}
        />
      ),
      isComplete: true,
    },
  ];

  return (
    <PageLayout title={SESSION_TYPE_LABELS.inference}>
      <Steps steps={steps} onFinish={finish} labels={INFERENCE_STEPS_LABELS} />
    </PageLayout>
  );
};
