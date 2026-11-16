import { ChoiceGroup } from '@/shared/components/choice-group/choice-group';
import { StepHeader } from '@/shared/components/step-header/step-header';

import {
  REQUIRED_TYPE_OPTIONS,
  type RequiredType,
  SELECT_TYPE_TITLE,
} from './consts';
import {
  ChoicesContainer,
  SelectTypeStepRoot,
} from './select-type-step.styles';

type SelectTypeStepProps = {
  requiredType: RequiredType | null;
  onRequiredTypeChange: (requiredType: RequiredType) => void;
};

export const SelectTypeStep = ({
  requiredType,
  onRequiredTypeChange,
}: SelectTypeStepProps) => (
  <SelectTypeStepRoot>
    <StepHeader title={SELECT_TYPE_TITLE} />
    <ChoicesContainer>
      <ChoiceGroup
        multiple={false}
        options={REQUIRED_TYPE_OPTIONS}
        value={requiredType}
        onChange={onRequiredTypeChange}
      />
    </ChoicesContainer>
  </SelectTypeStepRoot>
);
