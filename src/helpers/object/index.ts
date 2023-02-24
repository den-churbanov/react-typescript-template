import { isNil, isPlainObject } from 'lodash'
import { isUndefined } from '@/helpers';

/**
 * Превращает пустые строки в null по всему объекту работает только с обычными объектами
 * но не с объектами типа Date, Map, etc..
 * @param obj объект для маппинга
 * @returns объект с пустыми строками замененными на null
 */
export const mapEmptyStringsToNull = <T extends object>(obj: T): T => {
  if (Array.isArray(obj)) {
    return obj.map(mapEmptyStringsToNull) as T;
  }

  if (!isPlainObject(obj)) return obj;

  const result = {};
  for (const key of Object.keys(obj)) {
    const value = obj[key];
    if (typeof value === 'string' && value === '') {
      result[key] = null;
    } else if (isPlainObject(value) || Array.isArray(value)) {
      result[key] = mapEmptyStringsToNull(value);
    } else {
      result[key] = value;
    }
  }

  return result as T;
};

const defaultValidator = (_: string, value: unknown) => !isNil(value);

/**
 * Возвращает объект состоящий только из полей прошедших валидацию
 * @param obj объект для валидации
 * @param propsValidator функция валидатор
 * @returns новый объект
 */
export const filterObject = <T>(obj: T, propsValidator: (prop: string, value: unknown) => boolean = defaultValidator) => {
  const total = {} as unknown;

  for (const key in obj) {
    const newValue = obj[key];
    if (newValue && typeof newValue === 'object' && !Array.isArray(newValue)) {
      total[key] = filterObject(obj, propsValidator);
    } else if (propsValidator(key, newValue)) {
      total[key] = newValue;
    }
  }

  return total as T;
}

export const pickByKeys = <T extends object, K extends keyof T = keyof T>(target: T, keys: K[]) => {
  const result: any = {};
  for (const key of keys) {
    if (!isUndefined(target[key])) {
      result[key] = target[key];
    }
  }
  return result as Pick<T, K>;
}

export { isObject, isPlainObject, mapKeys, keys, defaultsDeep } from 'lodash';

