import { useState } from 'react';
import { normalizeString } from '@/helpers';
import { DebouncedSearchOptions, SearchResult } from './types';
import { useDebouncedCallback, useMemoizedCallback, useOnChange } from '@/hooks';
import './styles.css';

const searchValueAttribute = 'data-search'
const searchValueSelector = `[${searchValueAttribute}]`;

export const useDebouncedDocumentSearch = (value: string, options: DebouncedSearchOptions = {}) => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [notFound, setNotFound] = useState(false);

  if (!options.onFound) options.onFound = (node: HTMLElement) => node.classList.add('search__result');
  if (!options.onReset) options.onReset = (node: HTMLElement) => node.classList.remove('search__result');

  const searchIntoDocument = useDebouncedCallback((value: string) => {
    if (!value) return;

    const searchText = normalizeString(value);

    const nodes = Array.from<HTMLElement>(document.querySelectorAll(searchValueSelector));
    const regExp = new RegExp(searchText.replaceAll(/[её]/g, '[её]'));

    const resultsArr: SearchResult[] = [];

    for (const node of nodes) {
      const text = normalizeString(node.getAttribute(searchValueAttribute));
      if (regExp.test(text) && !options.exact) {
        resultsArr.push({ node, text });
        options.onFound(node);
      }

      if (options.exact && value === node.getAttribute(searchValueAttribute)) {
        resultsArr.push({ node, text });
        options.onFound(node);
      }
    }

    setNotFound(resultsArr.length === 0);
    setResults(resultsArr);
  }, 2000);

  const resetSearch = useMemoizedCallback(() => {
    results.map(result => result.node).forEach(options.onReset);
    setResults([]);
    setNotFound(false);
  })

  useOnChange(() => searchIntoDocument(value), [value, options.exact]);
  useOnChange(() => resetSearch(), [value, options.exact]);

  return {
    results,
    notFound,
    resetSearch
  }
}

export * from './types';