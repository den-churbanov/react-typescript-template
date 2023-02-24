import { useRef } from 'react';
import { useOnMount } from '@/hooks';
import type { BusEvent, CallbackForType, ReturnForType, ValueForType } from './types';

/**
 * @description Для типизации передать пересечение интерфейсов <b>BusEvent</b>.
 * <br/>
 * Метод <b>useSubscription</b> принимает тип события и callback,
 * автоматически регистрирует событие при монтировании компонента и удаляет при размонтировании.
 * <br/>
 * Метод <b>emit</b> принимает тип события и value для слушателей.
 * Возращает объект с результатами выполнения всех слушателей данного события.
 * <br/>
 * Методы <b>subscribe</b> и <b>unsubscribe</b> позволяют вручную добавлять и удалять слушатели.
 * <br/>
 * <b>ВАЖНО:</b> при удалении слушателя он сравнивается по ссылке, поэтому при использовании этих методов в функциональном
 * компоненте необходимо обернуть callback в <b>useMemoizedCallback</b> для обеспечения постоянности ссылки.
 * */
class EventBus<E extends BusEvent> {
  private subscriptions = new Map<E['type'], Array<E['subscription']>>();

  emit = <T extends E['type']>(type: T, value?: ValueForType<E, T>): ReturnForType<E, T> => {
    const subscriptions = this.subscriptions.get(type);
    let result;
    if (subscriptions?.length) {
      for (const subscription of subscriptions) {
        result = subscription(value);
      }
    }
    return result as ReturnForType<E, T>;
  }

  useSubscription = <T extends E['type']>(type: T, callback: CallbackForType<E, T>) => {
    const callbackRef = useRef<CallbackForType<E, T>>();
    callbackRef.current = callback;

    useOnMount(() => {
      function subscription(value: ValueForType<E>) {
        return callbackRef.current?.(value);
      }

      return this.addSubscription(type, subscription);
    });
  }

  subscribe<T extends E['type']>(type: T, callback: CallbackForType<E, T>) {
    return this.addSubscription(type, callback);
  }

  unsubscribe<T extends E['type']>(type: T, callback: CallbackForType<E, T>) {
    this.deleteSubscription(type, callback);
  }

  private addSubscription<T extends E['type']>(type: T, callback: CallbackForType<E, T>) {
    const subscriptions = this.subscriptions.get(type);

    if (subscriptions) {
      subscriptions.push(callback);
    } else {
      this.subscriptions.set(type, [callback]);
    }

    // функция отписки - unsubscribe
    return () => this.deleteSubscription(type, callback);
  }

  private deleteSubscription<T extends E['type']>(type: T, callback: CallbackForType<E, T>) {
    const subscriptions = this.subscriptions.get(type);
    const index = subscriptions.findIndex(subscription => subscription === callback);

    subscriptions.splice(index, 1);

    if (subscriptions.length == 0) this.subscriptions.delete(type);
  }
}

export { createEventBus } from './EventBusProvider';
export { BusEvent, EventBus };
