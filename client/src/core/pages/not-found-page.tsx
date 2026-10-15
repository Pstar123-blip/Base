import { Typography } from '@mui/material';
import { Link } from '@tanstack/react-router';

import { NotFoundContainer } from './not-found-page.styles';

export const NotFoundPage = () => (
  <NotFoundContainer>
    <Typography variant="h4">Page not found</Typography>
    <Link to="/">Return home</Link>
  </NotFoundContainer>
);
