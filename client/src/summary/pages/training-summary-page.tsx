import { Stack, Typography } from '@mui/material';

import { CompareRow } from '../components/compare-row';
import { SelectionList } from '../components/selection-list';
import { SUMMARY_TITLE } from '../consts';
import type { CompareImage, Selection } from '../types';

export const TrainingSummaryPage = () => {
  // TODO: get the compared images from the store.
  const imageA: CompareImage | undefined = undefined;
  const imageB: CompareImage | undefined = undefined;

  // TODO: get the selections from the store.
  const selections: Selection[] = [];

  // TODO: dispatch the removal to the store.
  const removeSelection = (id: string) => {
    void id;
  };

  // The last remaining selection can't be removed, so there is never a way to
  // cancel all of them.
  const canRemove = selections.length > 1;

  return (
    <Stack spacing={3}>
      <Typography variant="h4" component="h1">
        {SUMMARY_TITLE}
      </Typography>
      <CompareRow imageA={imageA} imageB={imageB} />
      <SelectionList
        selections={selections}
        onRemove={canRemove ? removeSelection : undefined}
      />
    </Stack>
  );
};
