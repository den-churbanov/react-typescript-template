import React from 'react';
import { render } from 'react-dom';
import { App } from './App';
import { AppContainer } from '@/helpers';
import bootstrapImmer from './bootstrap/immer';

bootstrapImmer();

const main = () => render(
  <App />,
  AppContainer,
);


main();

