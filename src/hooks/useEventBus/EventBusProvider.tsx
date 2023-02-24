import React, { createContext, useContext } from 'react';
import { BusEvent, EventBus } from '@/hooks';

type WithEventBusReturn<Events extends BusEvent> = {
  EventBusProvider: React.FC,
  useEventBus: () => EventBus<Events>
}

export const createEventBus = <Events extends BusEvent>(): WithEventBusReturn<Events> => {

  const bus = new EventBus<Events>();

  const BusContext = createContext(bus);

  const useEventBus = () => {
    const context = useContext(BusContext);
    if (!context) throw new Error('Hook useEventBus must be called inside EventBusProvider');
    return context;
  }

  const EventBusProvider: React.FC = ({ children }) => {
    return (
      <BusContext.Provider value={bus}>
        {children}
      </BusContext.Provider>
    );
  }

  return {
    EventBusProvider,
    useEventBus
  }
}
