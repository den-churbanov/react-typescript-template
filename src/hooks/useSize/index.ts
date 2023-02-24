import { useRafState } from '@/hooks';
import type { BasicTarget } from '../utils/domTarget';
import { getTargetElement } from '../utils/domTarget';
import { useIsomorphicLayoutEffectWithTarget } from '../utils/useIsomorphicLayoutEffectWithTarget';

type Size = { width: number; height: number };

export const useSize = (target: BasicTarget): Size | undefined => {
  const [state, setState] = useRafState<Size>();

  useIsomorphicLayoutEffectWithTarget(
    () => {
      const el = getTargetElement(target);

      if (!el) {
        return () => {};
      }

      const resizeObserver = new ResizeObserver((entries) => {
        entries.forEach((entry) => {
          const { clientWidth, clientHeight } = entry.target;
          setState({
            width: clientWidth,
            height: clientHeight,
          });
        });
      });

      resizeObserver.observe(el);
      return () => {
        resizeObserver.disconnect();
      };
    },
    [],
    target,
  );

  return state;
}