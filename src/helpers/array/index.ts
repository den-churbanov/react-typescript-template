import { numberOrZero } from "@/helpers";

/**
 * @param array - массив любых значений
 * @return Возращает массив чисел (нули для невалидных значений)
 */
export const numbersArray = (array: unknown[]) => array.map(numberOrZero);

/**
 * Проверяет есть ли в массиве дубликаты
 */
export const hasDuplicates = <T>(arr: T[]) => {
  return new Set(arr).size !== arr?.length;
}

/**
 * Суммирует элементы массива
 */
export const sumElements = (arr: number[]) => {
  return arr.reduce((previousValue: number, currentValue: number) => previousValue + numberOrZero(currentValue), 0);
}

export const splitArrayAt2Dimension = <T>(array: T[], limit: number, reverse: boolean = false): T[][] => {
  const total: T[][] = [];
  let subDimension: T[] = [];
  for (const [idx, item] of array.entries()) {
    if (idx % limit === 0) {
      subDimension = [];
      total.push(subDimension);
    }
    subDimension.push(item);
  }
  return reverse ? total.reverse() : total;
}

export const arrDiff = <T extends unknown>(arr1: T[], arr2: T[]): T[] => {
  const values = new Set(arr1);
  const diff: T[] = [];

  for (const item of arr2) {
    if (!values.has(item)) {
      diff.push(item);
    }
  }

  return diff;
}

export const uniqueValues = <T extends unknown>(array: T[]) => Array.from(new Set(array));