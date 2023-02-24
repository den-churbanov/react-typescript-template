import path from 'path';
import CopyPlugin from 'copy-webpack-plugin';
import { rootDir, buildDir } from '../utils/env';

const config = {
  patterns: [
    {
      from: path.join(rootDir, 'public', 'fonts.css'),
      toType: 'file',
      to: path.join(buildDir, 'fonts.css')
    },
    {
      from: path.join(rootDir, 'public', 'fonts'),
      toType: 'dir',
      to: path.join(buildDir, 'fonts')
    },
    {
      from: path.join(rootDir, 'public', 'favicon.ico'),
      toType: 'file',
      to: path.join(buildDir, 'favicon.ico')
    }
  ]
};

/**
 * @see https://webpack.js.org/plugins/copy-webpack-plugin/
 * */
export const copyPlugin = new CopyPlugin(config);