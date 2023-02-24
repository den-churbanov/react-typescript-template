/**
 * Приводит к нижнему регистру и обрезает пробелы
 */
export const normalizeString = (value: unknown) => String(value).toLowerCase().trim();

/**
 * Находит пересечение слов, иначе возвращает null
 * */
export const getWordsIntersection = (word1: string, word2: string) => {
  const intersectionStart = normalizeString(word1).indexOf(normalizeString(word2));
  if (intersectionStart === -1) {
    return null
  }
  const intersectionEnd = intersectionStart + word2.length - 1;
  return {
    before: word1.slice(0, intersectionStart),
    intersection: word1.slice(intersectionStart, intersectionEnd + 1),
    after: word1.slice(intersectionEnd + 1, word1.length),
  }
}

/**
 * Возвращает склонение числительных.
 * @param number - число которое нужно обработать.
 * @param titles - Массив из 3 заголовков для чисел 1, 2, 5.
 * @return string | null
 */
export const getDeclensionOfNumerals = (number = 0, titles: [string, string, string] = ['', '', '']) => {
  const cases = [2, 0, 1, 1, 1, 2];

  return titles[
    (4 < number % 100 && number % 100 < 20)
      ? 2
      : cases[(number % 10 < 5) ? number % 10 : 5]
    ];
}

export const isString = (value: unknown): value is string => typeof value === 'string';

export { uniqueId } from 'lodash';
