import { TextField } from '@mui/material';
import { styled, type Theme } from '@mui/material/styles';

const filterFieldStyles = ({ theme }: { theme: Theme }) => ({
  marginBottom: theme.spacing(2),
});
export const FilterField = styled(TextField)(filterFieldStyles);
