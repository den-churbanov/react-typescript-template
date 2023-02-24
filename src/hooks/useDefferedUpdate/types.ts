import { useDeferredUpdate } from './index';

export type ITaskCallback = () => Promise<any>;

export interface AsyncTask {
  startAsync(): void,

  startImmediately(): void,

  stop(): boolean
}

type ExcludeDeferredUpdateHookReturn = 'cancelUpdate' | 'scheduleUpdate' | 'immediatelyUpdating' | 'isLoading';
export type EmitOnHaveUnsavedChanges = Omit<ReturnType<typeof useDeferredUpdate>, ExcludeDeferredUpdateHookReturn>;

export type StateEqualityChecker<T> = (prevState: T, newState: T, key?: string | number) => boolean;