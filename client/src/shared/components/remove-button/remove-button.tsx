import { Tooltip } from '@mui/material';
import { type Ref } from 'react';

import { DeleteIcon } from '@/assets/icons/delete-icon';

import { FrostedIconButton } from './remove-button.styles';

type RemoveButtonProps = {
  /** Says what gets removed; used as the tooltip and the accessible name. */
  label: string;
  onClick: () => void;
  ref?: Ref<HTMLButtonElement>;
};

/** An icon button for removing an item, meant to sit over an image. */
export const RemoveButton = ({ label, onClick, ref }: RemoveButtonProps) => (
  <Tooltip title={label}>
    <FrostedIconButton ref={ref} aria-label={label} onClick={onClick}>
      <DeleteIcon />
    </FrostedIconButton>
  </Tooltip>
);
