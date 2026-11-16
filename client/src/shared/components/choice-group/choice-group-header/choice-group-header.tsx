import { Button } from '@mui/material';
import { type ReactNode } from 'react';

import {
  CountPill,
  GroupLabel,
  Header,
  HeaderActions,
} from './choice-group-header.styles';
import { CLEAR_ALL_LABEL, SELECT_ALL_LABEL } from './consts';

export type BulkSelection = {
  selectedCount: number;
  total: number;
  allSelected: boolean;
  disabled: boolean;
  onToggleAll: () => void;
};

type ChoiceGroupHeaderProps = {
  label?: ReactNode;
  labelId: string;
  /** Selected count and "select all" button; omit for single selection. */
  bulkSelection?: BulkSelection;
};

export const ChoiceGroupHeader = ({
  label,
  labelId,
  bulkSelection,
}: ChoiceGroupHeaderProps) => {
  if (label == null && bulkSelection == null) {
    return null;
  }

  return (
    <Header>
      {label != null && (
        // Keep the label's color steady while focus moves between options.
        <GroupLabel id={labelId} focused={false}>
          {label}
        </GroupLabel>
      )}
      {bulkSelection != null && (
        <HeaderActions>
          <CountPill aria-live="polite">
            {bulkSelection.selectedCount}/{bulkSelection.total}
          </CountPill>
          <Button
            size="small"
            onClick={bulkSelection.onToggleAll}
            disabled={bulkSelection.disabled}
          >
            {bulkSelection.allSelected ? CLEAR_ALL_LABEL : SELECT_ALL_LABEL}
          </Button>
        </HeaderActions>
      )}
    </Header>
  );
};
