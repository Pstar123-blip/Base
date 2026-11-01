import { styled } from '@mui/material/styles';

import { ID_MAX_WIDTH_PX } from '../consts';

export const IdText = styled('span')({
  display: 'inline-block',
  maxWidth: ID_MAX_WIDTH_PX,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  verticalAlign: 'bottom',
});
