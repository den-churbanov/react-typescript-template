import { useEffect, useRef } from 'react';
import { useDebounce } from '../useDebounce';

export const usePreviousValue = <S>(state: S, delay?: number) => {
  const reference = useRef(state);
  const debounced = useDebounce(state, delay);

  useEffect(() => {
    reference.current = debounced;
  }, [debounced]);

  return reference.current;
}
