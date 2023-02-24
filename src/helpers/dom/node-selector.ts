

interface NodeSelectorContract {
  querySelector(selector: string): HTMLElement | null;
}

export class CachedNodeSelector implements NodeSelectorContract {
  private readonly queryDriver: ParentNode;
  private cache: Map<string, HTMLElement>;
  constructor(queryDriver: ParentNode = document) {
    this.queryDriver = queryDriver;
    this.cache = new Map();
  }

  querySelector(selector: string): HTMLElement | null {
    if (this.cache.has(selector)) {
      return this.cache.get(selector);
    }
    const el = this.queryDriver.querySelector(selector) as HTMLElement;
    this.cache.set(selector, el);
    return el;
  }
}