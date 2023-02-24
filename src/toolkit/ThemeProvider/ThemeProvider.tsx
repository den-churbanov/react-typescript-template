import React, { createContext, FC, useContext, useMemo, useState } from 'react';
import '@/assets/styles/theming/index.scss';
import { AppTheme, ThemeContextProps } from './types';
import { useMemoizedCallback, useOnChange, useOnMount } from '@/hooks';
import { isAppTheme, defaultTheme } from './helpers';

export const ThemeContext = createContext<ThemeContextProps>({} as ThemeContextProps);

export const ThemeProvider: FC = ({ children }) => {
  const [theme, setTheme] = useState<AppTheme>();

  useOnMount(() => {
    const initial = localStorage.getItem('AppTheme');
    setTheme(isAppTheme(initial) ? initial : defaultTheme);
  })

  useOnChange(() => {
    const prev = theme === 'light' ? 'dark' : 'light';
    if (document.body.classList.contains(prev)) {
      document.body.classList.remove(prev);
    }
    if (theme) {
      document.body.classList.add(theme);
      localStorage.setItem('AppTheme', theme);
    }
  }, [theme]);


  const toggleTheme = useMemoizedCallback(() => {
    const realTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(realTheme);
  })

  const value = useMemo(() => ({ theme, toggleTheme }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
