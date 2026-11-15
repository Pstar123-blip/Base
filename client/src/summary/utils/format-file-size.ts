import { FILE_SIZE_UNIT_STEP, FILE_SIZE_UNITS } from '../consts';

export const formatFileSize = (bytes: number) => {
  let value = bytes;
  let unitIndex = 0;

  while (
    value >= FILE_SIZE_UNIT_STEP &&
    unitIndex < FILE_SIZE_UNITS.length - 1
  ) {
    value /= FILE_SIZE_UNIT_STEP;
    unitIndex += 1;
  }

  const digits = unitIndex === 0 ? 0 : 1;
  let rounded = Number(value.toFixed(digits));

  // Rounding can reach the next unit (1023.96 KiB -> 1024.0 KiB); promote it.
  if (
    rounded >= FILE_SIZE_UNIT_STEP &&
    unitIndex < FILE_SIZE_UNITS.length - 1
  ) {
    rounded = Number((rounded / FILE_SIZE_UNIT_STEP).toFixed(1));
    unitIndex += 1;
  }

  return `${rounded.toFixed(unitIndex === 0 ? 0 : 1)} ${FILE_SIZE_UNITS[unitIndex]}`;
};
