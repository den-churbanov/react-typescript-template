import { AppTheme } from './types';

export const isAppTheme = (value: string): value is AppTheme => value === 'dark' || value === 'light';

const isPreferDarkTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
export const defaultTheme: AppTheme = isPreferDarkTheme ? 'dark' : 'light';