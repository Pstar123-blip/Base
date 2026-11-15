import { Typography } from '@mui/material';

import { SELECTIONS_TITLE } from './consts';
import { Chips, Section, SelectionChip } from './selection-list.styles';
import type { Selection } from './types';

export type SelectionListProps = {
  selections: readonly Selection[];
  /** Omit to make the selections read-only. */
  onRemove?: (id: string) => void;
};

export const SelectionList = ({ selections, onRemove }: SelectionListProps) => {
  if (!selections.length) {
    return null;
  }

  const renderChip = ({ id, label }: Selection) => (
    <SelectionChip
      key={id}
      label={label}
      onDelete={onRemove && (() => onRemove(id))}
    />
  );

  return (
    <Section spacing={1}>
      <Typography variant="h6" component="h2">
        {SELECTIONS_TITLE}
      </Typography>
      <Chips direction="row">{selections.map(renderChip)}</Chips>
    </Section>
  );
};
