export type Subscription<T, R> = (value: T) => R;
export type CallbackForType<E extends BusEvent, T = E['type']> = Extract<E, { type: T }>['subscription'];
export type ValueForType<E extends BusEvent, T = E['type']> = Parameters<CallbackForType<E, T>>[0];
export type ReturnForType<E extends BusEvent, T = E['type']> = ReturnType<CallbackForType<E, T>>;

export type BusEvent<Type = string, T = any, R = any | void> = {
  type: Type,
  subscription: Subscription<T, R>;
}