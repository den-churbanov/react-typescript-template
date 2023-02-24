import path from 'path';

import { rootDir } from '../utils/env';

/**
 * @see https://webpack.js.org/configuration/resolve/#resolvealias
 * */
export const aliasItems = {
  '@': path.join(rootDir, 'src'),
  // '@images': path.join(rootDir, '/src/images'),
  // '@styles': path.join(rootDir, '/src/styles'),
  // '@components': path.join(rootDir, '/src/components'),
};