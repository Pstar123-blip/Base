import { Stack } from '@mui/material';

import { CompareRow } from '@/shared/components/compare-row/compare-row';
import { SelectionList } from '@/shared/components/selection-list/selection-list';
import type { Selection } from '@/shared/components/selection-list/types';
import { StepHeader } from '@/shared/components/step-header/step-header';
import { SUMMARY_TITLE } from '@/shared/constants';
import { useObjectUrl } from '@/shared/hooks/use-object-url';
import { toCompareImage } from '@/shared/utils/to-compare-image';

type InferenceSummaryStepProps = {
  firstImage: File | null;
  secondImage: File | null;
  selections: readonly Selection[];
};

export const InferenceSummaryStep = ({
  firstImage,
  secondImage,
  selections,
}: InferenceSummaryStepProps) => {
  const firstSrc = useObjectUrl(firstImage);
  const secondSrc = useObjectUrl(secondImage);

  return (
    <Stack spacing={3}>
      <StepHeader title={SUMMARY_TITLE} />
      <CompareRow
        imageA={toCompareImage(firstImage, firstSrc)}
        imageB={toCompareImage(secondImage, secondSrc)}
      />
      <SelectionList selections={selections} />
    </Stack>
  );
};
