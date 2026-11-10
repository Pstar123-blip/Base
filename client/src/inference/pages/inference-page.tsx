import { SESSION_TYPE_LABELS } from '@/sessions/consts';
import { Steps } from '@/shared/components/steps/steps';
import type { StepItem } from '@/shared/components/steps/types';

import { INFERENCE_STEP_LABELS } from '../consts';
import { InferencePageRoot, InferencePageTitle } from './inference-page.styles';
import { SelectTypePage } from './select-type-page';
import { UploadPage } from './upload-page';

// Steps are empty for now, so they're marked complete to keep navigation open.
// Derive `isComplete` from each step's state once they have content.
const STEPS: StepItem[] = [
  {
    id: 'upload',
    label: INFERENCE_STEP_LABELS.upload,
    content: <UploadPage />,
    isComplete: true,
  },
  {
    id: 'select-type',
    label: INFERENCE_STEP_LABELS.selectType,
    content: <SelectTypePage />,
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
