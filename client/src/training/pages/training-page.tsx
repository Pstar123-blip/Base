import { SESSION_TYPE_LABELS } from '@/sessions/consts';
import { Steps } from '@/shared/components/steps/steps';
import type { StepItem } from '@/shared/components/steps/types';

import { TRAINING_STEP_LABELS } from '../consts';
import { SelectFiltersPage } from './select-filters-page';
import { TrainingPageRoot, TrainingPageTitle } from './training-page.styles';
import { UploadPage } from './upload-page';

// Steps are empty for now, so they're marked complete to keep navigation open.
// Derive `isComplete` from each step's state once they have content.
const STEPS: StepItem[] = [
  {
    id: 'upload',
    label: TRAINING_STEP_LABELS.upload,
    content: <UploadPage />,
    isComplete: true,
  },
  {
    id: 'select-filters',
    label: TRAINING_STEP_LABELS.selectFilters,
    content: <SelectFiltersPage />,
    isComplete: true,
  },
];

export const TrainingPage = () => {
  // Not wired to the API yet.
  const finish = () => {};

  return (
    <TrainingPageRoot>
      <TrainingPageTitle>{SESSION_TYPE_LABELS.training}</TrainingPageTitle>
      <Steps steps={STEPS} onFinish={finish} />
    </TrainingPageRoot>
  );
};
