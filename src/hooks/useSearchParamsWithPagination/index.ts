import { filterObject } from "@/helpers";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  useSearchParamsFilters,
  SearchParamsFiltersReturn,
  useOnMount,
  useOnChange,
  useDebounce,
  usePagination,
  PaginationQueryParams,
  usePaginationRet,
  useMemoizedCallback
} from "@/hooks";
import { isNil } from 'lodash'

export interface Reset {
  name: string,
  dependents: string[],
}

type useSearchParamsWithPaginationProps<T extends Record<string, any>> = {
  defaultParams?: T,
  ignoredForReset?: ((keyof T) | string)[];
  // resets присваивается дефолтное значение в том месте, где используется хук useSearchParamsWithPagination.
  // Затем при использовании onParamsChange происходит проверка на resets. Если значение поля name в объекте равно вновь присвоенному значению,
  // то значение поля resets удаляется из объекта. Это позволяет не дублировать квери параметры в URL.
  resets?: Reset[],
}

export type useSearchParamsWithPaginationRet<T extends Record<string, any>> =
  {
    setParams: (arg: Partial<T>) => void;
    onParamChange: (param: string, value: unknown) => void;
  }
  & Omit<SearchParamsFiltersReturn<T>, '_setParams' | 'onMountObjectValidator'>
  & Omit<usePaginationRet<T>, 'debouncedPagination'>;

/**
 * Хук для использования query params и пагинации на странице
 * @param props пропсы
 * @param defaultParams дефолтное состояние пропсов
 * @param ignoredForReset массив ключей defaultParams которые игнорируются при использовании reset()
 * @returns объект со свойствами и методами управления query params на странице
 */

const  validator = (_: string, value: unknown) => value && !isNil(value);

export const useSearchParamsWithPagination = <T extends Record<string, any>>({
                                                                               defaultParams,
                                                                               ignoredForReset = [],
                                                                               resets,
                                                                             }: useSearchParamsWithPaginationProps<T> = {}): useSearchParamsWithPaginationRet<T> => {

  const [defaultSearchParams, setSearchParams] = useSearchParams();

  const {
    params,
    setParams: _setParams,
    reset,
    onMountObjectValidator,
    paramsDirty,
    updateParams,
    getSearchString
  } = useSearchParamsFilters({ defaultParams, ignoredForReset });

  const {
    paginationProps,
    handleChangePage,
    handleChangeRowsPerPage,
    setPaginationParams,
  } = usePagination();

  const totalParams = useMemo(() => {
    return { ...params, ...paginationProps };
  }, [params, paginationProps]);

  const debounced = useDebounce(totalParams) as T;

  useOnChange(() => {
    setSearchParams(new URLSearchParams(debounced as any), {
      replace: true,
    });
  }, [debounced]);

  useOnMount(() => {
    const toSet = { ...defaultParams } as Record<string, any>;
    for (const [key, value] of defaultSearchParams) {
      toSet[key] = value;
    }
    _setParams(filterObject(toSet, onMountObjectValidator) as T);
  });

  const onParamChange = useMemoizedCallback((param: string, value: unknown) => {
    const clone = { ...params, [param]: value };
    if (resets) {
      for (const rObj of resets) {
        if (rObj.name === param) {
          for (const resetName of rObj.dependents) {
            delete clone[resetName];
          }
        }
      }
    }
    setPaginationParams({ page: 1, page_size: paginationProps.page_size });
    _setParams(filterObject(clone, validator) as unknown as T);
  })

  const setParams = (arg: Partial<PaginationQueryParams & T>) => {
    const clone = { ...params, ...arg };
    setPaginationParams({ page: 1, page_size: paginationProps.page_size });
    _setParams(filterObject(clone) as unknown as T);
  }

  return {
    params: totalParams,
    debounced,
    getSearchString,
    setParams,
    onParamChange,
    reset,
    paramsDirty,
    setPaginationParams,
    handleChangePage,
    handleChangeRowsPerPage,
    paginationProps,
    updateParams
  }
}
