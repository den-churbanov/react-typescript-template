import { Reset } from '@/hooks';

export type SearchParamsFiltersProps<T extends Record<string, any>> = {
  defaultParams?: Partial<T>,
  ignoredForReset?: ((keyof T) | string)[];
  resets?: Reset[];
}

export type UpdateParamsMapper<T> = (currentParams: Partial<T>, defaultParams: Partial<T>) => Partial<T>;

export type SearchParamsFiltersReturn<T extends Record<string, any>> = {
  params: Partial<T>;
  debounced: Partial<T>;
  setParams: (arg: T) => void;
  onParamChange: (param: string, value: unknown) => void;
  getSearchString: () => string,
  reset: () => void;
  onMountObjectValidator: (prop: string, value: unknown) => boolean;
  paramsDirty: boolean;
  updateParams: (mapper: UpdateParamsMapper<T>) => void;
  resets?: Reset[],
}