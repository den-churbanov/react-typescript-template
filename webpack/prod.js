import TerserJSPlugin from 'terser-webpack-plugin';
import CSSMinimizerPlugin from 'css-minimizer-webpack-plugin';

import * as plugins from './plugins';

export default {
  optimization: {
    minimize: true,
    minimizer: [
      new TerserJSPlugin({
        parallel: true
      }),
      new CSSMinimizerPlugin({
        parallel: true
      })
    ],
  },
  plugins: [plugins.cleanWebpackPlugin, plugins.miniCssExtractPlugin],
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
}