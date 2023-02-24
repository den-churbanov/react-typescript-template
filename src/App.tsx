import React from 'react';
import '@/assets/styles/index.scss';
import { Demo } from '@/pages/Demo';
import { ThemeProvider } from '@/toolkit/ThemeProvider';

export const App = () => (
  <ThemeProvider>
    <Demo/>
  </ThemeProvider>
);

