import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';

import { type StepStatus } from '../types';
import { IndicatorCircle } from './step-indicator.styles';

export type StepIndicatorProps = {
  status: StepStatus;
  completed: boolean;
  index: number;
};

const renderContent = ({ status, completed, index }: StepIndicatorProps) => {
  if (status === 'locked') {
    return <LockRoundedIcon />;
  }

  if (completed) {
    return <CheckRoundedIcon />;
  }

  return index + 1;
};

export const StepIndicator = (props: StepIndicatorProps) => {
  return (
    <IndicatorCircle status={props.status} aria-hidden>
      {renderContent(props)}
    </IndicatorCircle>
  );
};
