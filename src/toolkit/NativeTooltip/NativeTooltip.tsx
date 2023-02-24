import React, { createElement, ReactNode, useRef } from 'react';
import { renderToString } from 'react-dom/server';
import { css, getRelativeCoordinates, isUndefined } from '@/helpers';
import { useOnMount, useUnmount } from '@/hooks';
import './NativeTooltip.scss';

type TooltipTemplateProps = {
  title?: string,
  text?: ReactNode | string[] | ReactNode[],
  position?: NativeTooltipPosition,
  arrowEnabled?: boolean
}

interface Coords {
  x: number,
  y: number
}

export type NativeTooltipPosition = 'top' | 'left' | 'bottom' | 'right';

const TooltipTemplate = (props: TooltipTemplateProps) => {
  const { text, title, arrowEnabled, position = 'bottom' } = props;

  const isArray = Array.isArray(text);

  return (
    <div className="native_tooltip" data-position={position} data-arrow-enabled={arrowEnabled}>
      <div className="native_tooltip__content">
        {
          title &&
          <div className="native_tooltip__row">
            <div className="native_tooltip__title">{title}</div>
          </div>
        }
        {
          isArray &&
          text.map(node => (
              <div className="native_tooltip__row">
                <div className="native_tooltip__description">{node}</div>
              </div>
            )
          )
        }
        {
          !isArray && text &&
          <div className="native_tooltip__row">
            <div className="native_tooltip__description">{text}</div>
          </div>
        }
      </div>
    </div>
  );
}

interface NativeTooltipOptions {
  root?: HTMLElement,
  relative?: boolean,
  arrowEnabled?: boolean
}

export class NativeTooltip {
  private readonly anchor: HTMLElement;
  private readonly root: HTMLElement;

  private static SHIFT = 14;

  private active: boolean = false;
  private readonly relative: boolean = true;
  private readonly anchorCreated: boolean = false;
  private readonly arrowEnabled: boolean = true;
  private prevTarget: EventTarget | HTMLElement | Coords = null;

  constructor(options: NativeTooltipOptions = {}) {
    this.root = options.root || document.body;
    this.relative = isUndefined(options.relative) ? true : options.relative;
    this.arrowEnabled = isUndefined(options.arrowEnabled) ? true : options.arrowEnabled;
    const elements = this.root.getElementsByClassName('native_tooltip__anchor');

    if (!elements.length) {
      const anchor = document.createElement('div');
      anchor.classList.add('native_tooltip__anchor');
      this.root.appendChild(anchor);
      this.anchor = anchor;
      this.anchorCreated = true;
      return;
    }
    this.anchor = elements.item(0) as HTMLElement;
  }

  show(target: EventTarget | HTMLElement | Coords, props: TooltipTemplateProps): void {
    if (!Object.is(this.prevTarget, target) && !this.active) {
      this.prevTarget = target;
      this.hide();
      setTimeout(() => this.show(target, props))
      return;
    }

    setTimeout(() => {
      if (!props.position) props.position = 'top';

      this.clear();
      const element = createElement(TooltipTemplate, { ...props, arrowEnabled: this.arrowEnabled });
      this.anchor.insertAdjacentHTML('afterbegin', renderToString(element));

      if (this.setAnchorPosition(target, props.position)) {
        this.active = true;
        this.anchor.classList.add('native_tooltip__active');
      }
    })
  }

  private setAnchorPosition(target: EventTarget | HTMLElement | Coords, position: NativeTooltipPosition): boolean {
    const isHtmlElement = target instanceof HTMLElement || target instanceof EventTarget;

    if (isHtmlElement) {

      const { x, y, width, height } = (target as HTMLElement).getBoundingClientRect();
      const coords = this.relative ? getRelativeCoordinates({ x, y }, this.root) : { x, y };

      switch (position) {
        case 'left':
          css(this.anchor, {
            top: coords.y + height / 2 - this.anchor.offsetHeight / 2 + 'px',
            left: coords.x - this.anchor.offsetWidth - NativeTooltip.SHIFT + 'px'
          });
          break;

        case 'right':
          css(this.anchor, {
            top: coords.y + height / 2 - this.anchor.offsetHeight / 2 + 'px',
            left: coords.x + width + NativeTooltip.SHIFT + 'px'
          });
          break;

        case 'bottom':
          css(this.anchor, {
            top: coords.y + height + NativeTooltip.SHIFT + 'px',
            left: coords.x + width / 2 - this.anchor.offsetWidth / 2 + 'px'
          });
          break;

        case 'top':
          css(this.anchor, {
            top: coords.y - this.anchor.offsetHeight - NativeTooltip.SHIFT + 'px',
            left: coords.x + width / 2 - this.anchor.offsetWidth / 2 + 'px'
          });
          break;
      }
      return !(coords.x < 0 || coords.y < 0);
    }

    const coords = this.relative ? getRelativeCoordinates(target, this.root) : target;

    switch (position) {
      case 'left':
        css(this.anchor, {
          top: coords.y - this.anchor.offsetHeight / 2 + 'px',
          left: coords.x - this.anchor.offsetWidth - NativeTooltip.SHIFT + 'px'
        });
        break;

      case 'right':
        css(this.anchor, {
          top: coords.y - this.anchor.offsetHeight / 2 + 'px',
          left: coords.x + NativeTooltip.SHIFT + 'px'
        });
        break;

      case 'bottom':
        css(this.anchor, {
          top: coords.y + NativeTooltip.SHIFT + 'px',
          left: coords.x - this.anchor.offsetWidth / 2 + 'px'
        });
        break;

      case 'top':
        css(this.anchor, {
          top: coords.y - this.anchor.offsetHeight - NativeTooltip.SHIFT + 'px',
          left: coords.x - this.anchor.offsetWidth / 2 + 'px'
        });
        break;
    }

    return !(coords.x < 0 || coords.y < 0);
  }

  clear = () => this.anchor.innerHTML = '';

  hide() {
    this.active = false;
    css(this.anchor, {
      top: '0',
      left: '0',
      transform: 'none'
    });
    this.clear();
    this.anchor.classList.remove('native_tooltip__active');
  }

  get isActive() {
    return this.active;
  }

  destroy() {
    if (this.anchorCreated) this.root.removeChild(this.anchor);
  }
}


export const useNativeTooltip = (options?: NativeTooltipOptions) => {
  const tooltip = useRef<NativeTooltip>(null);

  useOnMount(() => {
    tooltip.current = new NativeTooltip(options);
  })

  useUnmount(() => tooltip.current.destroy())

  return tooltip.current;
}
