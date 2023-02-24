import path from 'path';

import { rootDir, webpackDir, ENTRY_FILE_NAME } from './utils/env';

export default {
  main: [
    path.join(rootDir, 'src', ENTRY_FILE_NAME),
    path.join(webpackDir, 'utils', 'cleanConsoleOnHMR.js'),
  ],
  shared: ['react', 'react-dom', 'lodash']
};
