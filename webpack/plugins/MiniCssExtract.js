import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { fileNameFactory, chunkFilenameFactory } from '../utils/helpers';

const config = {
  // Options similar to the same options in webpackOptions.output
  // both options are optional
  filename: fileNameFactory('css'),
  chunkFilename: chunkFilenameFactory('css'),
  ignoreOrder: true
};

export const miniCssExtractPlugin = new MiniCssExtractPlugin(config);