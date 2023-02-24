import { useCallback, useMemo, useState } from 'react';
import { useMemoizedCallback } from "@/hooks";


export const useLoader = <T>(): UseLoaderReturn<T> => {
  const [loading, setLoading] = useState<T[]>([])

  const start = useMemoizedCallback((value: T) => {
    const index = loading.findIndex(item => item === value);
    if (index === -1) {
      setLoading(prev => ([...prev, value]))
    }
  })

  const stop = useMemoizedCallback((value: T, delay: number = 0) => {
    setTimeout(() => {
      if (!value) {
        setLoading([]);
        return;
      }

      const index = loading.findIndex(item => item === value);
      if (index !== -1) {

        setLoading(prevState => {
          prevState.splice(index, 1);
          return [...prevState]
        });
      }
    }, delay)
  })

  const stopAll = useMemoizedCallback((delay: number = 800) => {
    setTimeout(() => {
      setLoading([]);
    }, delay)
  })

  const isLoading = useCallback((...values: T[]) => {
    return loading.some(value => values.includes(value));
  }, [loading])

  return useMemo(() => ({ start, stop, stopAll, isLoading }), [isLoading])
}

export type UseLoaderReturn<T = any> = {
  start: (value: T) => void,
  stop: (value: T, delay?: number) => void,
  stopAll: (delay?: number) => void,
  isLoading: (...values: T[]) => boolean
}
