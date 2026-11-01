import { TextField } from '@mui/material';
import { styled } from '@mui/material/styles';

export const ToolbarRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

export const SearchInput = styled(TextField)({ flex: '1 1 280px' });

export const SelectInput = styled(TextField)(({ theme }) => ({
  minWidth: theme.spacing(20),
}));
