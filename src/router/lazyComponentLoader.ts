import { ComponentType, lazy } from 'react';

type LazyFactory<T> = () => Promise<{ default: T }>;

const componentLoader = <T extends ComponentType<any>>(
  lazyFactory: LazyFactory<T>,
  attemptsLeft: number = 3,
  interval: number = 1500,
) =>
  new Promise<{ default: T }>((resolve, reject) => {
    lazyFactory()
      .then(resolve)
      .catch((error) => {
        setTimeout(() => {
          if (attemptsLeft === 0) window.location.reload();
          componentLoader(lazyFactory, attemptsLeft - 1, interval).then(resolve, reject);
        }, interval);
      });
  });

export const safeLazyLoader = <T extends ComponentType<any>>(lazyFactory: LazyFactory<T>) =>
  lazy(() => componentLoader(lazyFactory));