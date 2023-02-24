import React from 'react';
import ReactLogo from '@/assets/icons/react-logo.icon.svg';
import css from './Demo.module.scss';
import { useTheme } from '@/toolkit/ThemeProvider';

export const Demo = () => {
  const { toggleTheme } = useTheme();
  return (
    <article className={css.container}>
      <ReactLogo className={css.logo}/>
      <h1>React Typescript Template</h1>
      <button className={css.change_theme_btn} onClick={toggleTheme}>Change Theme</button>
    </article>
  );
}