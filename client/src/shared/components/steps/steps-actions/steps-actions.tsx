import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { Button } from '@mui/material';

import { type StepsLabels } from '../types';
import { ActionsBar, PrimaryActionButton } from './steps-actions.styles';

export type StepsActionsProps = {
  isFirstStep: boolean;
  isLastStep: boolean;
  canProceed: boolean;
  isFinishing: boolean;
  labels: Pick<StepsLabels, 'back' | 'next' | 'finish'>;
  onBack: () => void;
  onNext: () => void;
  onFinish: () => void;
};

export const StepsActions = ({
  isFirstStep,
  isLastStep,
  canProceed,
  isFinishing,
  labels,
  onBack,
  onNext,
  onFinish,
}: StepsActionsProps) => {
  return (
    <ActionsBar>
      <Button
        onClick={onBack}
        disabled={isFirstStep || isFinishing}
        startIcon={<ArrowBackRoundedIcon />}
      >
        {labels.back}
      </Button>
      <PrimaryActionButton
        variant="contained"
        onClick={isLastStep ? onFinish : onNext}
        disabled={!canProceed}
        loading={isLastStep && isFinishing}
        endIcon={
          isLastStep ? <CheckRoundedIcon /> : <ArrowForwardRoundedIcon />
        }
      >
        {isLastStep ? labels.finish : labels.next}
      </PrimaryActionButton>
    </ActionsBar>
  );
};
