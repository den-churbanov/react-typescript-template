import {
  DependencyList,
  MutableRefObject,
  useEffect,
  useState
} from 'react';
import { isArray } from 'lodash';

const checkIsOverflowed = (element: Element): boolean => {
  if (element instanceof HTMLElement) {
    return element.scrollWidth > element.offsetWidth ||
      element.scrollHeight > element.offsetHeight ||
      element?.children && Array.from(element.children).some(child => checkIsOverflowed(child));
  }
  return false;
}

function useCheckOverflow(ref: MutableRefObject<Element>, deps?: DependencyList): boolean;

function useCheckOverflow(elements: MutableRefObject<Element>[], deps?: DependencyList): boolean[];

function useCheckOverflow(ref: MutableRefObject<Element> | MutableRefObject<Element>[], deps: DependencyList = []) {
  const [isOverflowed, setIsOverflowed] = useState<boolean | boolean[]>(false);

  useEffect(() => {
    if (ref) {
      if (isArray(ref)) {
        setIsOverflowed(ref.map(({ current }) => checkIsOverflowed(current)));
      } else {
        setIsOverflowed(checkIsOverflowed(ref.current));
      }
    }
  }, isArray(ref) ? [ref, ...deps] : [ref?.current, ...deps])

  return isOverflowed;
}

export { useCheckOverflow }