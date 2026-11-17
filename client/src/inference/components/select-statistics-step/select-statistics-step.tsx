import { ChoiceGroup } from '@/shared/components/choice-group/choice-group';
import { StepHeader } from '@/shared/components/step-header/step-header';
import { ErrorState, LoadingState } from '@/shared/ui/states';

import { useStatisticsQuery } from '../../queries/use-statistics-query';
import { SELECT_STATISTICS_TITLE } from './consts';
import {
  ChoicesContainer,
  SelectStatisticsStepRoot,
} from './select-statistics-step.styles';

type SelectStatisticsStepProps = {
  statistics: readonly string[];
  onStatisticsChange: (statistics: string[]) => void;
};

export const SelectStatisticsStep = ({
  statistics,
  onStatisticsChange,
}: SelectStatisticsStepProps) => {
  const { data, isPending, isError, refetch } = useStatisticsQuery();

  return (
    <SelectStatisticsStepRoot>
      <StepHeader title={SELECT_STATISTICS_TITLE} />
      <ChoicesContainer>
        {isPending && <LoadingState />}
        {isError && <ErrorState retry={() => void refetch()} />}
        {data && (
          <ChoiceGroup
            options={data.map((statistic) => ({
              value: statistic,
              label: statistic,
            }))}
            value={statistics}
            onChange={onStatisticsChange}
          />
        )}
      </ChoicesContainer>
    </SelectStatisticsStepRoot>
  );
};
