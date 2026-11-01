import { Link, TableCell, TableRow } from '@mui/material';

import type { SessionDto } from '@/api/generated/model';

import { getResultsPath } from '../consts';
import { formatDateTime } from '../utils/format';
import { ProgressCell } from './progress-cell';
import { RowOptions } from './row-options';
import { IdText } from './session-row.styles';
import { SessionImage } from './session-image';
import { StatusTag } from './status-tag';
import { TypeTag } from './type-tag';

export const SessionRow = ({
  session,
  onDelete,
}: {
  session: SessionDto;
  onDelete: (session: SessionDto) => void;
}) => {
  const deleteSession = () => onDelete(session);

  return (
    <TableRow hover>
      <TableCell>
        <IdText title={session.id}>{session.id}</IdText>
      </TableCell>
      <TableCell>
        <TypeTag type={session.type} />
      </TableCell>
      <TableCell>{session.owner}</TableCell>
      <TableCell>
        <SessionImage src={session.imageAUrl} alt="Image A" />
      </TableCell>
      <TableCell>
        <SessionImage src={session.imageBUrl} alt="Image B" />
      </TableCell>
      <TableCell>{formatDateTime(session.createdAt)}</TableCell>
      <TableCell>{formatDateTime(session.updatedAt)}</TableCell>
      <TableCell>
        <ProgressCell value={session.progress} />
      </TableCell>
      <TableCell>
        <StatusTag status={session.status} />
      </TableCell>
      <TableCell>
        <Link href={getResultsPath(session.id)}>Results</Link>
      </TableCell>
      <TableCell align="right">
        <RowOptions sessionId={session.id} onDelete={deleteSession} />
      </TableCell>
    </TableRow>
  );
};
