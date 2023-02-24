import { useRef } from 'react';
import { useOnMount } from '@/hooks';

type ActionFunction = (e: KeyboardEvent) => void;
type KeyBoardActionHook = <T>(action: ActionFunction) => void;

export const useKeyDown: KeyBoardActionHook = (action) => {
  const actionRef = useRef<ActionFunction>()
  actionRef.current = action;

  useOnMount(() => {
    const handler = (e: KeyboardEvent) => actionRef.current(e);
    window.addEventListener('keydown', handler);
    return () => {
      window.removeEventListener('keydown', handler);
    }
  });
}