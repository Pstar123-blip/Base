import { EmptyMessage } from './empty-state.styles';

export const EmptyState = ({
  message = 'No results found',
}: {
  message?: string;
}) => {
  return <EmptyMessage color="text.secondary">{message}</EmptyMessage>;
};
