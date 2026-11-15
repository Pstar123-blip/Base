import { Chip, Stack } from '@mui/material';
import { styled, type Theme } from '@mui/material/styles';

const selectionChipStyles = ({ theme }: { theme: Theme }) => ({
  fontSize: theme.typography.body1.fontSize,
});
export const SelectionChip = styled(Chip)(selectionChipStyles);

const chipsStyles = ({ theme }: { theme: Theme }) => ({
  flexWrap: 'wrap' as const,
  justifyContent: 'center',
  gap: theme.spacing(1),
});
export const Chips = styled(Stack)(chipsStyles);

export const Section = styled(Stack)({
  alignItems: 'center',
  textAlign: 'center',
});
