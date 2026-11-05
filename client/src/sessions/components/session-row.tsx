import { Link, TableCell, TableRow } from '@mui/material';
import { Link as RouterLink, type LinkProps } from '@tanstack/react-router';

import { getResultsPath } from '../consts';
import { formatDateTime } from '../utils/format';
import type { Session } from '../utils/map-session';
import { ProgressCell } from './progress-cell';
import { RowOptions } from './row-options';
import { type ImageOpener, SessionImage } from './session-image';
import { IdText } from './session-row.styles';
import { StatusTag } from './status-tag';
import { TypeTag } from './type-tag';

export const SessionRow = ({
  session,
  onDelete,
  onOpenImage,
}: {
  session: Session;
  onDelete: (session: Session) => void;
  onOpenImage: ImageOpener;
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
        <SessionImage
          src={session.imageAUrl}
          alt="Image A"
          onOpen={onOpenImage}
        />
      </TableCell>
      <TableCell>
        <SessionImage
          src={session.imageBUrl}
          alt="Image B"
          onOpen={onOpenImage}
        />
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
        <Link
          component={RouterLink}
          to={getResultsPath(session.id) as LinkProps['to']}
        >
          Results
        </Link>
      </TableCell>
      <TableCell align="right">
        <RowOptions sessionId={session.id} onDelete={deleteSession} />
      </TableCell>
    </TableRow>
  );
};
