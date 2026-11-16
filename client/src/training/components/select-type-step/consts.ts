import { type ChoiceOption } from '@/shared/components/choice-group/types';

export const SELECT_TYPE_TITLE = 'Select required type';

/** In theme spacing units. */
export const CHOICES_MAX_WIDTH = 150;

export const REQUIRED_TYPES = {
  default: 'default',
  defaultTrain: 'default_train',
} as const;

export type RequiredType = (typeof REQUIRED_TYPES)[keyof typeof REQUIRED_TYPES];

export const REQUIRED_TYPE_OPTIONS: readonly ChoiceOption<RequiredType>[] = [
  { value: REQUIRED_TYPES.default, label: 'Default' },
  { value: REQUIRED_TYPES.defaultTrain, label: 'Default train' },
];
