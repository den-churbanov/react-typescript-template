export const noopFn = Function.prototype as () => unknown;

export const noopAsyncFn = Promise.resolve as () => Promise<void>;

export const isUndefined = (value: unknown): value is undefined => typeof value === 'undefined';

export {
  cloneDeep,
  isEqual,
  throttle,
  debounce,
  isEmpty,
  uniqueId,
  isNil
} from 'lodash';

export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (Math.ceil(max) - Math.floor(min) + 1)) + min;
}

// Выбирает случайный эдемент из массива
export function choose<T>(arr: T[]): T {
  return arr[getRandomInt(0, arr.length)];
}

// Бросок монетки
export function coinToss(): boolean {
  return Math.random() > 0.5;
}