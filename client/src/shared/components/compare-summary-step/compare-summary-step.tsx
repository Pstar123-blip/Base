import { Stack } from '@mui/material';

import { CompareRow } from '@/shared/components/compare-row/compare-row';
import type { CompareImage } from '@/shared/components/compare-row/types';
import { SelectionList } from '@/shared/components/selection-list/selection-list';
import type { Selection } from '@/shared/components/selection-list/types';
import { StepHeader } from '@/shared/components/step-header/step-header';
import { SUMMARY_TITLE } from '@/shared/constants';
import { useObjectUrl } from '@/shared/hooks/use-object-url';

type CompareSummaryStepProps = {
  firstTitle: string;
  secondTitle: string;
  firstImage: File | null;
  secondImage: File | null;
  selections: readonly Selection[];
  /** Omit to make the selections read-only. */
  onRemoveSelection?: (id: string) => void;
  /** Why removal is unavailable right now, shown on the selections. */
  removeDisabledReason?: string;
};

/** Describes a picked file for the compare row, or nothing until it has a URL. */
const toCompareImage = (
  file: File | null,
  src: string | undefined,
): CompareImage | undefined =>
  file && src
    ? { src, alt: file.name, name: file.name, size: file.size }
    : undefined;

/** The summary step of a flow that compares two images. */
export const CompareSummaryStep = ({
  firstTitle,
  secondTitle,
  firstImage,
  secondImage,
  selections,
  onRemoveSelection,
  removeDisabledReason,
}: CompareSummaryStepProps) => {
  const firstSrc = useObjectUrl(firstImage);
  const secondSrc = useObjectUrl(secondImage);

  return (
    <Stack spacing={3}>
      <StepHeader title={SUMMARY_TITLE} />
      <CompareRow
        firstTitle={firstTitle}
        secondTitle={secondTitle}
        imageA={toCompareImage(firstImage, firstSrc)}
        imageB={toCompareImage(secondImage, secondSrc)}
      />
      <SelectionList
        selections={selections}
        onRemove={onRemoveSelection}
        removeDisabledReason={removeDisabledReason}
      />
    </Stack>
  );
};
