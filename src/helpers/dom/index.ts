//#region getTargetWithAttribute
import { isNumber } from "@/helpers";
import { isBooleanString, parseBooleanString } from "@/helpers/boolean";

enum BubbleDirection {
  UP,
  DOWN,
}

type ExtractTargetCallback = (
  element: HTMLElement | EventTarget,
  attributeName: string,
  attributeValue?: string,
  maxDepth?: number,
  bubbleDirection?: keyof typeof BubbleDirection
) => HTMLElement | null;

export const getTargetWithAttribute: ExtractTargetCallback = (
  element,
  attributeName,
  attributeValue,
  maxDepth = 10,
  bubbleDirection = 'UP'
) => {
  let target = element as HTMLElement,
    depth = 0;

  const nextTarget = () => {
    if (bubbleDirection === 'UP') {
      target = target.parentElement;
    } else {
      target = target.children[0] as HTMLElement;
    }
    depth++;
  }

  while (depth < maxDepth) {
    if (!target || !target.hasAttribute) {
      return null;
    }

    if (target.hasAttribute(attributeName)) {
      if (attributeValue && target.getAttribute(attributeName) !== attributeValue) {
        nextTarget();
        continue;
      }
      return target;
    }
    nextTarget();
  }
  return null;
}
//#endregion getTargetWithAttribute

export const getTargetAttribute = <T extends number | string | boolean = string>(
  element: HTMLElement | EventTarget,
  attributeName: string,
  maxDepth: number = 10,
  bubbleDirection: keyof typeof BubbleDirection = 'UP'
): T => {
  let target = element as HTMLElement,
    depth = 0;

  const nextTarget = () => {
    if (bubbleDirection === 'UP') {
      target = target.parentElement;
    } else {
      target = target.children[0] as HTMLElement;
    }
    depth++;
  }

  while (depth < maxDepth) {
    if (!target || !target.hasAttribute) {
      return null;
    }

    if (!target.hasAttribute(attributeName)) {
      nextTarget();
      continue;
    }
    const value = target.getAttribute(attributeName);

    if (isNumber(value)) {
      return Number(value) as T;
    }
    if (isBooleanString(value)) {
      return parseBooleanString(value) as T;
    }
    return value as T;
  }
  return null;
}

export const css = (el: HTMLElement, styles: Partial<CSSStyleDeclaration>) => Object.assign(el.style, styles);

export const AppContainer = document.querySelector('#container');

/**
 * Создает html из строки
 */
export function htmlToElements(html: string): HTMLElement {
  const template = document.createElement('template');
  template.innerHTML = html;
  return template.content.childNodes[0] as HTMLElement;
}