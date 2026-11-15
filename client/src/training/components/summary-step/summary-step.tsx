import { Stack } from '@mui/material';

import { CompareRow } from '@/shared/components/compare-row/compare-row';
import { SelectionList } from '@/shared/components/selection-list/selection-list';
import type { Selection } from '@/shared/components/selection-list/types';
import { StepHeader } from '@/shared/components/step-header/step-header';
import { SUMMARY_TITLE } from '@/shared/constants';
import { useObjectUrl } from '@/shared/hooks/use-object-url';
import { toCompareImage } from '@/shared/utils/to-compare-image';

type TrainingSummaryStepProps = {
  firstImage: File | null;
  secondImage: File | null;
  selections: readonly Selection[];
  onRemoveSelection: (id: string) => void;
};

export const TrainingSummaryStep = ({
  firstImage,
  secondImage,
  selections,
  onRemoveSelection,
}: TrainingSummaryStepProps) => {
  const firstSrc = useObjectUrl(firstImage);
  const secondSrc = useObjectUrl(secondImage);

  // The last remaining selection can't be removed, so there is never a way to
  // cancel all of them.
  const canRemove = selections.length > 1;

  return (
    <Stack spacing={3}>
      <StepHeader title={SUMMARY_TITLE} />
      <CompareRow
        imageA={toCompareImage(firstImage, firstSrc)}
        imageB={toCompareImage(secondImage, secondSrc)}
      />
      <SelectionList
        selections={selections}
        onRemove={canRemove ? onRemoveSelection : undefined}
      />
    </Stack>
  );
};
