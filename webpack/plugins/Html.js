import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { rootDir, isProd, HTML_TITLE } from '../utils/env';

const config = {
  publicPath: '/',
  inject: true,
  filename: 'index.html',
  template: path.join(rootDir, 'public', 'index.html'),
  favicon: path.join(rootDir, 'public', 'favicon.ico'),
  title: HTML_TITLE,
  minify: {
    html5: true,
    collapseWhitespace: isProd,
    removeComments: isProd
  }
};

export const htmlWebpackPlugin = new HtmlWebpackPlugin(config);