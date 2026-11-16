import { ChoiceGroup } from '@/shared/components/choice-group/choice-group';
import { StepHeader } from '@/shared/components/step-header/step-header';

import {
  type Algorithm,
  ALGORITHM_OPTIONS,
  SELECT_ALGORITHMS_TITLE,
} from './consts';
import {
  ChoicesContainer,
  SelectAlgorithmsStepRoot,
} from './select-algorithms-step.styles';

type SelectAlgorithmsStepProps = {
  algorithms: readonly Algorithm[];
  onAlgorithmsChange: (algorithms: Algorithm[]) => void;
};

export const SelectAlgorithmsStep = ({
  algorithms,
  onAlgorithmsChange,
}: SelectAlgorithmsStepProps) => (
  <SelectAlgorithmsStepRoot>
    <StepHeader title={SELECT_ALGORITHMS_TITLE} />
    <ChoicesContainer>
      <ChoiceGroup
        options={ALGORITHM_OPTIONS}
        value={algorithms}
        onChange={onAlgorithmsChange}
      />
    </ChoicesContainer>
  </SelectAlgorithmsStepRoot>
);
