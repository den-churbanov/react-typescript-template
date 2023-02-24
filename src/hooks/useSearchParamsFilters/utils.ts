import { isBooleanString, isNumber, leaveOnlyNumbers, parseBooleanString, isNil } from '@/helpers';

export const ignoredByDefault = (key: string) => {
  switch (key) {
    case 'page':
    case 'page_size':
      return true;
    default:
      return false;
  }
}

export const onMountObjectValidator = (prop: string, value: unknown) => {
  if (ignoredByDefault(prop)) {
    return false;
  }
  return !isNil(value);
}

export const onSetParamsValidator = (prop: string, value: unknown) => {
  if (Array.isArray(value) && value.length === 0) return false;
  return !isNil(value);
}

export const parseArray = (value: string) => {
  if (isBooleanString(value)) {
    return parseBooleanString(value);
  }
  if (isNumber(value)) {
    return Number(value);
  }
  return value;
}

export const filterArrayFilters = (value: string | number | boolean) => {
  if (typeof value === 'number') {
    return leaveOnlyNumbers(value);
  }
  return !isNil(value);
}

export const excludeDefaultParams = <T extends Record<string, any>>(params: T, defaultParams: T, key: string) => {
  return Object.is(params[key], defaultParams[key]) ||
    (Array.isArray(params[key]) && params[key].length === defaultParams[key].length)
}