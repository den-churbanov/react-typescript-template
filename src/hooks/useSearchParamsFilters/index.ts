import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchParamsFiltersProps, SearchParamsFiltersReturn, UpdateParamsMapper } from './types';
import {
  excludeDefaultParams,
  filterArrayFilters,
  onMountObjectValidator,
  onSetParamsValidator,
  parseArray
} from './utils';
import { useDebounce, useMemoizedCallback, useOnChange, useOnMount } from '@/hooks';
import { filterObject, isBooleanString, parseBooleanString, SearchParams } from '@/helpers';

const LIST_REGEX = /.+(List)$/;

export const useSearchParamsFilters = <T extends Record<string, any>>({
                                                                        defaultParams = {},
                                                                        ignoredForReset = [],
                                                                        resets = []
                                                                      }: SearchParamsFiltersProps<T> = {}): SearchParamsFiltersReturn<T> => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [params, setParams] = useState<Partial<T>>(defaultParams);

  const debounced = useDebounce<Partial<T>>(params);

  useOnMount(() => {
    const toSet: Record<string, any> = { ...defaultParams };

    for (const [key, value] of searchParams) {
      if (LIST_REGEX.test(key)) { // если значение является массивом
        toSet[key] = value.split(',').map(parseArray).filter(filterArrayFilters);
      } else if (isBooleanString(value)) {
        toSet[key] = parseBooleanString(value);
      } else {
        toSet[key] = value;
      }
    }
    setParams(filterObject(toSet, onMountObjectValidator) as T);
  });

  useOnChange(() => {
    setSearchParams(new URLSearchParams(filterObject(debounced, onSetParamsValidator)), {
      replace: true,
    });
  }, [debounced]);

  const onParamChange = useMemoizedCallback((key: string, value: unknown) => {
    const clone: Record<string, any> = { ...params, [key]: value };

    for (const { name, dependents } of resets) {
      if (name === key) {
        for (const resetName of dependents) {
          if (Array.isArray(clone[resetName])) {
            clone[resetName] = [];
            continue;
          }
          delete clone[resetName];
        }
      }
    }
    setParams(filterObject(clone) as T);
  });

  const reset = useMemoizedCallback(() => setParams(defaultParams));

  const updateParams = useMemoizedCallback((mapper: UpdateParamsMapper<T>) => {
    setParams(mapper(params, defaultParams));
  });

  const getSearchString = useMemoizedCallback(() => new SearchParams(params).toString());

  const paramsDirty = useMemo(() => {
    for (const key in params) {
      if (excludeDefaultParams(params, defaultParams, key)) continue;
      if (!ignoredForReset.includes(key)) {
        return true;
      }
    }
    return false;
  }, [params]);

  return {
    params,
    debounced,
    setParams,
    onParamChange,
    getSearchString,
    reset,
    paramsDirty,
    onMountObjectValidator,
    updateParams
  }
}

export type { SearchParamsFiltersReturn };
