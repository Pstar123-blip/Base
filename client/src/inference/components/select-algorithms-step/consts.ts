import { type ChoiceOption } from '@/shared/components/choice-group/types';

export const SELECT_ALGORITHMS_TITLE = 'Select required algorithms';

/** In theme spacing units. */
export const CHOICES_MAX_WIDTH = 150;

export const ALGORITHMS = {
  a: 'a',
  b: 'b',
  c: 'c',
  d: 'd',
  e: 'e',
} as const;

export type Algorithm = (typeof ALGORITHMS)[keyof typeof ALGORITHMS];

export const ALGORITHM_OPTIONS: readonly ChoiceOption<Algorithm>[] = [
  { value: ALGORITHMS.a, label: 'A' },
  { value: ALGORITHMS.b, label: 'B' },
  { value: ALGORITHMS.c, label: 'C' },
  { value: ALGORITHMS.d, label: 'D' },
  { value: ALGORITHMS.e, label: 'E' },
];
