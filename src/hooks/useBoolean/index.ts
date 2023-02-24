import { useCallback, useState } from 'react';
import { useMemoizedCallback } from '@/hooks';


type UseBooleanHook = (initialState?: boolean) => [boolean, () => void, (value: boolean) => void];

export const useBoolean: UseBooleanHook = (initialState = false) => {
  const [boolean, setBoolean] = useState(initialState);

  const toggleBoolean = useMemoizedCallback(() => setBoolean(prevState => !prevState));

  const setValue = useCallback((value: boolean) => setBoolean(value), []);

  return [boolean, toggleBoolean, setValue];
}