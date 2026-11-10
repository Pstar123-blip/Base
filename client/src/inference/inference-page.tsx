import { SESSION_TYPE_LABELS } from '@/sessions/consts';
import { Steps } from '@/shared/components/steps/steps';
import type { StepItem } from '@/shared/components/steps/types';

import { INFERENCE_STEP_LABELS } from './consts';
import { InferencePageRoot, InferencePageTitle } from './inference-page.styles';
import { SelectTypeStep } from './steps/select-type/select-type-step';
import { UploadStep } from './steps/upload/upload-step';

// Steps are empty for now, so they're marked complete to keep navigation open.
// Derive `isComplete` from each step's state once they have content.
const STEPS: StepItem[] = [
  {
    id: 'upload',
    label: INFERENCE_STEP_LABELS.upload,
    content: <UploadStep />,
    isComplete: true,
  },
  {
    id: 'select-type',
    label: INFERENCE_STEP_LABELS.selectType,
    content: <SelectTypeStep />,
    isComplete: true,
  },
];

export const InferencePage = () => {
  // Not wired to the API yet.
  const finish = () => {};

  return (
    <InferencePageRoot>
      <InferencePageTitle>{SESSION_TYPE_LABELS.inference}</InferencePageTitle>
      <Steps steps={STEPS} onFinish={finish} />
    </InferencePageRoot>
  );
};
