export enum InterfaceTheme {
  dark = 'dark',
  light = 'light'
}

export type AppTheme = keyof typeof InterfaceTheme;

export interface ThemeContextProps {
  theme: AppTheme,
  toggleTheme: () => void,
}
