import process from 'process';
import { isEqual } from '@/helpers';
import { AsyncTask, ITaskCallback, StateEqualityChecker } from './types';


export const defaultStateEqualityChecker: StateEqualityChecker<Record<string | number, any>> = (
  prevState,
  newState,
  key) => isEqual(prevState[key], newState[key]);

export class Task implements AsyncTask {
  private readonly callback: ITaskCallback;
  private readonly timeout: number;
  private timeoutId: any;
  private readonly runImmediately: boolean;

  constructor(callback: ITaskCallback, timeout: number, runImmediately: boolean = true) {
    this.callback = callback;
    this.timeout = timeout;
    if (runImmediately) {
      this.timeoutId = setTimeout(callback, timeout);
    }

    this.runImmediately = runImmediately;
  }

  stop() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      return true;
    }
    return false;
  }

  startAsync() {
    this.timeoutId = setTimeout(this.callback, this.timeout);
  }

  async startImmediately() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    await this.callback();
  }
}

export function logCancelUpdate(key: string | number, stopped: boolean) {
  if (process.env.NODE_ENV === 'development') {
    if (stopped) {
      console.info(`Update with key ${key} was stopped`);
    } else {
      console.info(`Update with key ${key} already fired and can't be stopped`);
    }
  }
}

export function logScheduleInfo(text: string) {
  if (process.env.NODE_ENV === 'development') {
    console.info(text);
  }
}