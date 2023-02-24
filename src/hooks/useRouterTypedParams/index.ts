import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { isNumber } from "@/helpers";


const parseParamByType = (value: string): string | number => {
  if (isNumber(value)) return Number(value);
  return value;
}
/**
 * @description приводит параметры к соответствующему типу (строки и числа)
 * */
export const useRouterTypedParams = <T extends Record<string, string | number>>(): T => {
  const params = useParams();

  const typedParams = useMemo(() => {
    const typedParams = {};
    for (const key in params) {
      typedParams[key] = parseParamByType(params[key]);
    }
    return typedParams;
  }, [params])

  return typedParams as T;
}
