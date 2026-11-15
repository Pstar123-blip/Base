import { Stack, Typography } from '@mui/material';

import { CompareRow } from '../components/compare-row';
import { SelectionList } from '../components/selection-list';
import { SUMMARY_TITLE } from '../consts';
import type { CompareImage, Selection } from '../types';

export const InferenceSummaryPage = () => {
  // TODO: get the compared images from the store.
  const imageA: CompareImage | undefined = undefined;
  const imageB: CompareImage | undefined = undefined;

  // TODO: get the selection from the store.
  const selections: Selection[] = [];

  return (
    <Stack spacing={3}>
      <Typography variant="h4" component="h1">
        {SUMMARY_TITLE}
      </Typography>
      <CompareRow imageA={imageA} imageB={imageB} />
      <SelectionList selections={selections} />
    </Stack>
  );
};
