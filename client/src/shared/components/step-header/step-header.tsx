import { StepHeaderRoot, StepSubtitle, StepTitle } from './step-header.styles';

type StepHeaderProps = {
  title: string;
  /** What the user needs to do to complete the step. */
  subtitle?: string;
};

/** A centered title and subtitle at the top of a step's content. */
export const StepHeader = ({ title, subtitle }: StepHeaderProps) => (
  <StepHeaderRoot>
    <StepTitle>{title}</StepTitle>
    {subtitle && <StepSubtitle variant="body2">{subtitle}</StepSubtitle>}
  </StepHeaderRoot>
);
