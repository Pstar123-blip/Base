import { type ChoiceOption } from '@/shared/components/choice-group/types';

export const SELECT_TYPE_TITLE = 'Select required type';

/** In theme spacing units. */
export const CHOICES_MAX_WIDTH = 150;

/** Always offered, ahead of the types fetched from the API. */
export const DEFAULT_TYPE_OPTION: ChoiceOption<string> = {
  value: 'default',
  label: 'Default',
};
