import { Paper, Table, TableRow } from '@mui/material';
import { styled } from '@mui/material/styles';

import { TABLE_CELL_PADDING_PX, TABLE_FONT_SIZE } from '../consts';

export const TablePanel = styled(Paper)({ overflow: 'hidden' });

export const FitTable = styled(Table)({
  width: '100%',
  '& th, & td': {
    paddingInline: TABLE_CELL_PADDING_PX,
    fontSize: TABLE_FONT_SIZE,
  },
  '& .MuiChip-root': { fontSize: TABLE_FONT_SIZE },
});

export const FilterRow = styled(TableRow)({
  '& th, & td': { verticalAlign: 'top' },
});
