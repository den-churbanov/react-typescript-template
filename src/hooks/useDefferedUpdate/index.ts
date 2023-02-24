import { useCallback, useRef, useState } from 'react';
import { usePreviousValue, useUnmount } from '@/hooks';
import { ITaskCallback, StateEqualityChecker, AsyncTask } from './types';
import {
  Task,
  logCancelUpdate,
  logScheduleInfo,
  defaultStateEqualityChecker
} from './common';

/**
 * @description Позволяет отправлять отложенные запросы к серверу.
 * Если состояние не изменилось, запрос не будет отправлен.
 * Если состояние изменилось, старый запрос отменяется и планируется следующий с новыми данными.
 *
 * @param state - состояние, которое будет синхронизировано (по умолчанию Record<string | number, any>)
 * @param isStateEqual - функция, которая сравнивает текущее состояние и предыдущее
 * @param defaultDelay - задержка в отправке запросов, 20 секунд по умолчанию
 * */
export const useDeferredUpdate = <T = Record<string | number, any>>(
  state: T,
  isStateEqual: StateEqualityChecker<T> = defaultStateEqualityChecker,
  defaultDelay: number = 20000
) => {
  const { current: tasks } = useRef(new Map<string | number, AsyncTask>());
  const { current: changes } = useRef(new Map<string | number, boolean>());

  const [haveUnsavedChanges, setHaveUnsavedChanges] = useState(false);
  const [immediatelyUpdating, setImmediatelyUpdating] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const referredState = useRef(state);
  const prevState = usePreviousValue(state);

  referredState.current = state; // закидываем стейт в ref, чтобы не добавлять зависимость в scheduleUpdate

  const scheduleUpdate = useCallback((callback: ITaskCallback, key: string | number, delay: number = defaultDelay) => {
    if (!key) return;
    const haveChanges = !isStateEqual(prevState, referredState.current, key);

    changes.set(key, haveChanges);
    setHaveUnsavedChanges(Array.from(changes.values()).some(change => change));

    if (!haveChanges) return;

    cancelUpdate(key);

    const realCallback = async () => {
      if (isStateEqual(prevState, referredState.current, key)) {
        tasks.delete(key);
        return logScheduleInfo(`Update with key ${key} prevented because state not changed`);
      }
      setIsLoading(true);
      callback()
        .then(() => {
          changes.set(key, false);
          setHaveUnsavedChanges(Array.from(changes.values()).some(change => change));
          logScheduleInfo(`Task with key ${key} has been completed`);
        })
        .catch((e) => {
          console.log(e)
          tasks.delete(key);
          logScheduleInfo(`Update with key ${key} don't performed because the request failed`);
          scheduleUpdate(callback, key, delay);
        })
        .finally(() => setIsLoading(false));
    }

    const task = new Task(realCallback, delay);
    tasks.set(key, task);

    logScheduleInfo(`Update with key ${key} was scheduled`);
  }, [])

  const cancelUpdate = useCallback((key: string | number) => {
    if (tasks.has(key)) {
      const stopped = tasks.get(key).stop();
      tasks.delete(key);
      logCancelUpdate(key, stopped);
    }
  }, [])

  const updateImmediatelyAll = useCallback(async () => {
    setImmediatelyUpdating(true);
    for (const task of tasks.values()) {
      await task.startImmediately();
    }
    tasks.clear();
    setImmediatelyUpdating(false);
  }, [])

  useUnmount(() => {
    for (const task of tasks.values()) {
      task.stop();
    }
    tasks.clear();
  })

  return {
    scheduleUpdate,
    cancelUpdate,
    updateImmediatelyAll,
    haveUnsavedChanges,
    isLoading,
    immediatelyUpdating
  }
}
export type { EmitOnHaveUnsavedChanges } from './types';