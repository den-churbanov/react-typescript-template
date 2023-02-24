import { useEffect } from 'react';
import type { DependencyList } from 'react';

export const useAsyncEffect = (effect: () => Promise<void>, deps: DependencyList = []) => {
  useEffect(() => {
    async function execute() {
      await effect();
    }

    execute();
  }, deps);
}