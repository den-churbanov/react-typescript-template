import { useMemo, useRef } from 'react';
import { isUndefined } from '@/helpers';

const shallowEqualArrays = <T>(oldArr: T[], newArr: T[]): boolean => {
  if (oldArr === newArr) return true;

  if (oldArr?.length !== newArr?.length) return false;

  for (let i = 0; i < oldArr.length; i++) {
    if (!Object.is(oldArr[i], newArr[i])) return false;
  }
  return true;
}

interface SelectOption {
  label: string,
  value: string | number
}

export type OptionsFilterFn<T extends Record<string, any>> = (data: T[], row: T, option: SelectOption) => boolean;

/**
 * @param data - массив данных
 * @param options - массив исходных options
 * @param filterFunction - функция фильтрации options, аргументы: массив данных, текущий элемент массива данных и option.
 * Вернуть true, если нужно оставить текущий option для данного элемента массива данных
 * @returns Словарь c id в качестве ключей (или индекс массива, если id неопределено) и
 * уникальные options для каждого элемента массива данных
 */
export const useUniqueOptions = <T extends Record<string, any>>(data: T[], options: SelectOption[], filterFunction: OptionsFilterFn<T>): Record<string | number, SelectOption[]> => {

  const ref = useRef<Record<string | number, SelectOption[]>>({});

  return useMemo(() => {

    const rows = data.map((row, idx) => {
      const index = isUndefined(row.id) ? idx : row.id;

      const entryOptions = options.filter(option => filterFunction(data, row, option));

      if (shallowEqualArrays(ref.current[index], entryOptions)) {

        return [index, ref.current[index]]
      }

      ref.current[index] = entryOptions;

      return [index, entryOptions]
    })

    return Object.fromEntries(rows);
  }, [data, options]);
}