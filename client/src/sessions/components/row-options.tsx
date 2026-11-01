import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material';
import { type MouseEvent, useState } from 'react';

export const RowOptions = ({
  sessionId,
  onDelete,
}: {
  sessionId: string;
  onDelete: () => void;
}) => {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  const openMenu = (event: MouseEvent<HTMLElement>) =>
    setAnchor(event.currentTarget);
  const closeMenu = () => setAnchor(null);

  const deleteSession = () => {
    closeMenu();
    onDelete();
  };

  return (
    <>
      <IconButton
        size="small"
        aria-label={`Options for session ${sessionId}`}
        aria-haspopup="menu"
        onClick={openMenu}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={closeMenu}>
        <MenuItem onClick={deleteSession}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};
