import { useEffect, useRef, useState } from 'react';

const HALF_SECOND = 500;

export const useDebounce = <T>(value: T, delay = HALF_SECOND) => {
  const [current, setCurrent] = useState(value);
  const timerRef = useRef(0 as any);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setCurrent(value);
    }, delay);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [value]);

  return current;
}
