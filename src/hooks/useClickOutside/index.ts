import { RefObject, useEffect, useMemo, useRef } from 'react';
import { useMemoizedCallback } from '@/hooks';

type ActionFunction = (...args: any) => void;
type ClickOutsideHookType = <T>(action: ActionFunction, ref: RefObject<HTMLElement> | RefObject<HTMLElement>[]) => void;

export const useClickOutside: ClickOutsideHookType = (action, ref,) => {

  // const toast = useRef<HTMLElement>(document.querySelector(`#${Portal.toastNotification}`));
  // const message = useRef<HTMLElement>(document.querySelector(`#${Portal.messageNotification}`));
  // const selectPortal = useRef<HTMLElement>(document.querySelector(`#${Portal.selectCell}`));

  const refs = useMemo(() => {
    const realRefs = Array.isArray(ref) ? ref : [ref]
    // realRefs.push(toast, message, selectPortal);
    return realRefs;
  }, [ref]);

  const handler = useMemoizedCallback((e: MouseEvent) => {
    if (refs.some(ref => e.target === ref.current || ref.current?.contains(e.target as Node))) return;
    action();
  })

  useEffect(() => {
    document.body.addEventListener('mousedown', handler);
    return () => {
      document.body.removeEventListener('mousedown', handler);
    }
  }, [...refs])


}
