import { isTouchEnabled } from '@/helpers';

type EventHandler = (e: MouseEvent | TouchEvent) => void;

interface ListenerConfigItem {
  elements: HTMLElement | Array<HTMLElement>,
  listeners: Array<{
    type: keyof HTMLElementEventMap,
    handler: EventHandler | EventHandler[]
  }>;
}

const mouseToTouchEventsMap: Partial<Record<keyof HTMLElementEventMap, keyof HTMLElementEventMap>> = {
  mousedown: 'touchstart',
  mousemove: 'touchmove',
  mouseup: 'touchend',
  mouseleave: 'touchcancel'
}

export class Listeners {

  private readonly config: ListenerConfigItem[] = [];

  constructor(parentContext: unknown, config: Array<ListenerConfigItem>) {
    this.config = config;
    this.checkOnTouchScreen();
    this.bindParentContext(parentContext);
    this.listen('on');
  }

  checkOnTouchScreen() {
    if (isTouchEnabled()) {
      this.config.forEach(configItem => {
        configItem.listeners = configItem.listeners
          .map(listenerItem => {
            if (listenerItem.type in mouseToTouchEventsMap) {
              listenerItem.type = mouseToTouchEventsMap[listenerItem.type];
            }
            return listenerItem;
          });
        return configItem;
      });
    }
  }

  private bindParentContext(context: unknown) {
    this.config.forEach(configItem => {
      configItem.listeners = configItem.listeners
        .map(listenerItem => {
          if (Array.isArray(listenerItem.handler)) {
            listenerItem.handler = listenerItem.handler.map(func => func.bind(context));
          } else {
            listenerItem.handler = listenerItem.handler.bind(context);
          }
          return listenerItem;
        });
      return configItem;
    });
  }

  private listen(toggle: 'on' | 'off') {
    const method = toggle === 'on' ? 'addEventListener' : 'removeEventListener';
    for (let { elements, listeners } of this.config) {
      elements = Array.isArray(elements) ? elements : [elements];
      for (const element of elements) {
        listeners.forEach(({ type, handler }) => {
          handler = Array.isArray(handler) ? handler : [handler];
          handler.forEach((handler) => {
            if (method in element) {
              element[method](type, handler, { passive: type.includes('touch') });
            }
          })
        });
      }
    }
  }

  destroyAll() {
    this.listen('off');
  }
}
