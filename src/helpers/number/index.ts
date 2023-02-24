import { isString } from '@/helpers';

export const isNumber = (value: unknown): value is number => isString(value) ? !Number.isNaN(Number(value)) : typeof value === 'number';

export const numberOrZero = (value: unknown) => {
  const tryNum = Number(value);
  if (Number.isNaN(tryNum) || value === null) {
    return 0;
  }
  return tryNum;
}

export const tryNumber = <T>(value: T) => {
  const tryNum = Number(value);
  return Number.isNaN(tryNum) || value === null ? value : tryNum;
}

export const leaveOnlyNumbers = (value: unknown) => !Number.isNaN(value);

// Сумматор который гарантирует отсутствие NaN
export const sumNaNSafe = (a: unknown, b: unknown): number => {
  return numberOrZero(a) + numberOrZero(b);
}

export const roundDecimal = (value: number, decimals: number = 2): number => {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
}

export const positiveOrZero = (value: unknown) => {
  const tryNum = Number(value);
  if (Number.isNaN(tryNum) || value === null || tryNum < 0) {
    return 0;
  }
  return tryNum;
}