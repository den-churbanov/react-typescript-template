import { useEffect, useRef, DependencyList, EffectCallback } from "react";

export const useOnChange = (callback: EffectCallback, deps: DependencyList) => {
  const firstUpdate = useRef(true);

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
    } else {
      callback();
    }
  }, deps);
};
