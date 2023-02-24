export interface DebouncedSearchOptions extends DocumentSearchCallbacks {
  timeout?: number,
  exact?: boolean
}

export type SearchCallback = (node: HTMLElement) => void;

export interface DocumentSearchCallbacks {
  onReset?: SearchCallback,
  onFound?: SearchCallback
}

export interface SearchResult {
  node: HTMLElement,
  text: string
}