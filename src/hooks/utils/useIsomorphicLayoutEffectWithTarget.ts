import { isBrowser } from './isBrowser';
import { useEffectWithTarget } from './useEffectWithTarget';
import { useLayoutEffectWithTarget } from './useLayoutEffectWithTarget';

export const useIsomorphicLayoutEffectWithTarget = isBrowser ? useLayoutEffectWithTarget : useEffectWithTarget;

