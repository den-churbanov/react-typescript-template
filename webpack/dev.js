import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import { devServer } from './config';

export default {
  devtool: 'cheap-module-source-map',
  plugins: [new ReactRefreshWebpackPlugin()],
  devServer,
}