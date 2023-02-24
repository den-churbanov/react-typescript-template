import { useEffect } from 'react';
import { useLatest } from '@/hooks';
import { isFunction } from '@/helpers';

export const useUnmount = (callback: () => void) => {
  if (process.env.NODE_ENV === 'development') {
    if (!isFunction(callback)) {
      console.error(`useUnmount expected parameter is a function, got ${typeof callback}`);
    }
  }

  const fnRef = useLatest(callback);

  useEffect(() => () => {
      fnRef.current();
    },
    [],
  );
};