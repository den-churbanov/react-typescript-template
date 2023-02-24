type IdleCallBack = () => unknown;

export const runIdle = (callback: IdleCallBack, timeout: number = 0): number => {
  return window.requestIdleCallback(callback, { timeout })
}