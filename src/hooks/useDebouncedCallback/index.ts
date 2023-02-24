import { useRef } from 'react';
import { useMemoizedCallback } from '@/hooks';

type noop = (...args: any[]) => any;

export const useDebouncedCallback = <T extends noop>(callback: T, timeout: number) => {
  const timeoutRef = useRef(null);

  return useMemoizedCallback((...args: Parameters<T>): void => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => callback(...args), timeout);
  })
}