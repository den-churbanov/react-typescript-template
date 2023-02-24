import { babelLoader } from './loaderRuleItems';

/**
 * Using @svgr/webpack for handling svg files in react components
 * @see https://react-svgr.com/docs/webpack/
 */
export const svgReactComponentRule = {
  test: /\.icon\.svg$/,
  issuer: /\.[jt]sx?$/,
  use: [
    babelLoader,
    {
      loader: '@svgr/webpack',
      options: {
        babel: false,
        svgoConfig: {
          icon: true,
          memo: true,
          plugins: [
            {
              name: 'removeViewBox',
              active: false
            },
            {
              name: 'removeAttrs',
              params: {
                attrs: '(stroke|fill)',
              }
            }
          ]
        },
      },
    }
  ],
};

/**
 * Using file-loader for handling svg files
 * @see https://webpack.js.org/guides/asset-modules/
 */
export const svgRule = {
  test: /\.svg$/,
  exclude: [
    /\.icon\.svg$/
  ],
  type: 'asset/resource',
}

export const svgRules = [svgReactComponentRule, svgRule];