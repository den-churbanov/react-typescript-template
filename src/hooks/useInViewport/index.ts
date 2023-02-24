import { useRef, useState } from 'react';
import type { BasicTarget } from '../utils/domTarget';
import { getTargetElement } from '../utils/domTarget';
import { useEffectWithTarget } from '../utils/useEffectWithTarget';

interface Options {
  rootMargin?: string;
  threshold?: number | number[];
  root?: BasicTarget<Element>;
}

export const useInViewport = (target: BasicTarget, options?: Options) => {
  const [visible, setVisible] = useState<boolean>();

  useEffectWithTarget(
    () => {
      const el = getTargetElement(target);
      if (!el) {
        return () => {};
      }

      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            setVisible(entry.isIntersecting);
          }
        },
        {
          ...options,
          root: getTargetElement(options?.root),
        },
      );

      observer.observe(el);

      return () => {
        observer.disconnect();
      };
    },
    [],
    target,
  );

  return visible;
}

export const useInViewportOnce = (target: BasicTarget, options?: Options) => {
  const visible = useInViewport(target, options);

  const beenVisible = useRef(visible);

  if (visible) beenVisible.current = true;

  return beenVisible.current;
}