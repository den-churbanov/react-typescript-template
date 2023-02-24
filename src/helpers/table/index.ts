import { leaveOnlyNumbers } from '@/helpers';

export const normalizeDisplayValue = (value: string | number, fractionDigits: number = 1) => {
  const number = Number(value);
  if (!isFinite(number)) return 0;
  // value | 0 быстрое округление на всякий случай
  if ((number | 0) !== number) {
    return number.toFixed(fractionDigits);
  }
  return String(number);
}

export const emptyStringIfZero = (value: string | number) => Number(value) === 0 ? '' : value?.toString();

export const inputManyNumbersCellValueToArray = (value: string): number[] => {
  const mapped = value.split(',').map((value) => parseInt(value, 10));
  return mapped.filter(leaveOnlyNumbers);
}
