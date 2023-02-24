declare module '*.svg' {
  import React = require('react');
  const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}
declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.json' {
  const content: string;
  export default content;
}

declare module '*.module.css' {
  const classes: Record<string, string>;
  export default classes;
}

declare module '*.scss' {
  const content: Record<string, string>;
  export default content;
}

declare module '*.module.scss' {
  const classes: Record<string, string>;
  export default classes;
}

declare interface Array<T> {
  findLast<S extends T>(predicate: (this: void, value: T, index: number, obj: T[]) => value is S, thisArg?: any): S | undefined;

  findLast(predicate: (value: T, index: number, obj: T[]) => unknown, thisArg?: any): T | undefined;

  findLastIndex(predicate: (value: T, index: number, obj: T[]) => unknown, thisArg?: any): number;
}

// в Firefox эти свойства заменяют offsetX, offsetY
declare interface MouseEvent extends UIEvent {
  layerX: number,
  layerY: number
}
