import { Paper } from '@mui/material';
import { styled, type Theme } from '@mui/material/styles';

const accountPanelStyles = ({ theme }: { theme: Theme }) => ({
  padding: theme.spacing(3),
});
export const AccountPanel = styled(Paper)(accountPanelStyles);
