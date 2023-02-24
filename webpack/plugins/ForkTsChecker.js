import path from 'path';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import { isDev, rootDir } from '../utils/env';

const config = {
  async: isDev,
  typescript: {
    configFile: path.join(rootDir, 'tsconfig.json'),
  },
  eslint: {enabled: true, files: '../src/**/*.{ts,tsx,js,jsx}'},
};

/**
 * @description ускоряет typechecking
 * @see https://www.npmjs.com/package/fork-ts-checker-webpack-plugin
 * */
export const forkTsCheckerWebpackPlugin = new ForkTsCheckerWebpackPlugin(config);
