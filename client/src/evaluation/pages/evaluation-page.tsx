import { SESSION_TYPE_LABELS } from '@/sessions/consts';
import { Steps } from '@/shared/components/steps/steps';
import type { StepItem } from '@/shared/components/steps/types';

import { EVALUATION_STEP_LABELS } from '../consts';
import {
  EvaluationPageRoot,
  EvaluationPageTitle,
} from './evaluation-page.styles';
import { UploadPage } from './upload-page';

// The step is empty for now, so it's marked complete to allow finishing.
// Derive `isComplete` from the step's state once it has content.
const STEPS: StepItem[] = [
  {
    id: 'upload',
    label: EVALUATION_STEP_LABELS.upload,
    content: <UploadPage />,
    isComplete: true,
  },
];

export const EvaluationPage = () => {
  // Not wired to the API yet.
  const finish = () => {};

  return (
    <EvaluationPageRoot>
      <EvaluationPageTitle>
        {SESSION_TYPE_LABELS.evaluation}
      </EvaluationPageTitle>
      <Steps steps={STEPS} onFinish={finish} />
    </EvaluationPageRoot>
  );
};
