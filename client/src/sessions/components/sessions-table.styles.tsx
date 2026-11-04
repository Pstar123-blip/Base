import { LinearProgress, Paper, Table } from '@mui/material';
import { styled } from '@mui/material/styles';

import { TABLE_FONT_SIZE } from '../consts';

export const TablePanel = styled(Paper)({ overflow: 'hidden' });

export const FitTable = styled(Table)({
  width: '100%',
  '& th, & td': { paddingInline: 8, fontSize: TABLE_FONT_SIZE },
  '& .MuiChip-root': { fontSize: TABLE_FONT_SIZE },
});

// Reserves the bar's height so the table doesn't jump while refetching.
export const FetchIndicator = styled(LinearProgress)({ height: 2 });
