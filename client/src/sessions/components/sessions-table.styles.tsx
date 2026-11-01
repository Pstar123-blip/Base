import { LinearProgress, Paper, Table } from '@mui/material';
import { styled } from '@mui/material/styles';

import { TABLE_MIN_WIDTH_PX } from '../consts';

export const TablePanel = styled(Paper)({ overflow: 'hidden' });

export const WideTable = styled(Table)({
  minWidth: TABLE_MIN_WIDTH_PX,
  '& th, & td': { whiteSpace: 'nowrap' },
});

// Reserves the bar's height so the table doesn't jump while refetching.
export const FetchIndicator = styled(LinearProgress)({ height: 2 });
