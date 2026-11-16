import CancelIcon from '@mui/icons-material/Cancel';
import { Tooltip, Typography } from '@mui/material';
import { useRef } from 'react';

import { getRemoveSelectionLabel, SELECTIONS_TITLE } from './consts';
import { Chips, Section, SelectionChip } from './selection-list.styles';
import type { Selection } from './types';

export type SelectionListProps = {
  selections: readonly Selection[];
  /** Omit to make the selections read-only. */
  onRemove?: (id: string) => void;
  /**
   * When set, removal is unavailable: the chips keep their remove control but
   * it does nothing, and this explains why.
   */
  removeDisabledReason?: string;
};

export const SelectionList = ({
  selections,
  onRemove,
  removeDisabledReason,
}: SelectionListProps) => {
  // Lets focus move to a neighbouring chip when one is removed, instead of
  // being dropped on the page.
  const chips = useRef(new Map<string, HTMLDivElement>());

  if (!selections.length) {
    return null;
  }

  const remove = (id: string, index: number) => {
    const neighbour = selections[index + 1] ?? selections[index - 1];

    if (neighbour) {
      chips.current.get(neighbour.id)?.focus();
    }

    onRemove?.(id);
  };

  const registerChip = (id: string) => (node: HTMLDivElement | null) => {
    if (node) {
      chips.current.set(id, node);
    } else {
      chips.current.delete(id);
    }
  };

  const renderChip = ({ id, label }: Selection, index: number) => {
    const chip = (
      <SelectionChip
        key={id}
        ref={registerChip(id)}
        label={label}
        deleteIcon={<CancelIcon aria-label={getRemoveSelectionLabel(label)} />}
        onDelete={
          onRemove && !removeDisabledReason
            ? () => remove(id, index)
            : onRemove && (() => undefined)
        }
      />
    );

    return removeDisabledReason && onRemove ? (
      <Tooltip key={id} title={removeDisabledReason} describeChild>
        {chip}
      </Tooltip>
    ) : (
      chip
    );
  };

  return (
    <Section spacing={1}>
      <Typography variant="h6" component="h3">
        {SELECTIONS_TITLE}
      </Typography>
      <Chips direction="row">{selections.map(renderChip)}</Chips>
    </Section>
  );
};
