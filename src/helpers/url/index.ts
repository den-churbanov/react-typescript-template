import { leaveOnlyNumbers } from '@/helpers';

export class SearchParams implements Iterable<string> {
  private readonly queryString: string = null;
  protected readonly params: Record<string, string | number | boolean | any[]> = {};


  constructor(params: string | Record<string, string> = location.search) {
    if (typeof params === 'string') {
      this.queryString = params.startsWith('?') ? params.substring(1, params.length) : params;
      this.parseQuerystring();

    } else this.parseParams(params);
  }

  [Symbol.iterator](): Iterator<string, string, string> {
    let _nextKey: number = 0;
    const keys = Object.keys(this.params);
    const params = this.params;

    return {
      next(): IteratorResult<string, any> {
        if (_nextKey === keys.length) {
          return { done: true, value: undefined }
        }
        const result = {
          value: params[keys[_nextKey]] as any,
          done: false
        }
        _nextKey++
        return result;
      }
    }
  }

  private parseQuerystring() {
    if (!this.queryString) return;

    this.queryString.split('&').reduce((params, token) => {
      let [key, value]: any[] = token.split('=');
      value = decodeURIComponent(value).replaceAll('+', ' ');
      if (/\d,/g.test(value) && Number.isNaN(Number(value))) {
        value = value.split(',').map(Number).filter(leaveOnlyNumbers);
      }
      if (!Number.isNaN(Number(value))) {
        params[key] = Number(value);
      } else {
        params[key] = value;
      }

      return params;
    }, this.params);
  }

  private parseParams(params: Record<string, any>) {
    for (const key in params) {
      if (Array.isArray(params[key])) {
        this.params[key] = params[key];
      } else {
        this.params[key] = decodeURIComponent(params[key]).replaceAll('+', ' ');
      }
    }
  }

  has(key: string) {
    return this.params[key] !== undefined;
  }

  get(key: string): any {
    return this.params[key];
  }

  set(key: string, value: string) {
    this.params[key] = value;
  }

  delete(key: string) {
    delete this.params[key];
  }

  get length() {
    return Object.keys(this.params).length;
  }

  get paramsRecord() {
    return this.params;
  }

  toString() {
    if (!this.length) return '';

    const keys = Object.keys(this.params);
    return keys.reduce((search, key, idx) => {
      let value = this.params[key];

      if (Array.isArray(value)) {
        if (!value.length) return search;

        value = value.join(',')
      }
      if (idx !== 0) search = search.concat('&');

      search = search.concat(`${key}=${value}`);

      return search;
    }, '?')
  }
}