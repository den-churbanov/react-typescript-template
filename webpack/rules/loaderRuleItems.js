import path, { join } from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { sassResourceItems } from '../config';
import { isProd, rootDir, webpackDir } from '../utils/env';

export const cssLoader = {
  loader: 'css-loader',
}

/**
 * Sass loader with sass-resources-loader
 */
export const sassLoaderItems = [
  {
    loader: 'sass-loader',
    options: {
      sourceMap: true,
      // Prefer `dart-sassRules`
      implementation: require('sass'),
    },
  },
  sassResourceItems.length
      ? {
        loader: 'sass-resources-loader',
        options: {
          resources: sassResourceItems,
        },
      }
      : null,
]

export const postCssLoader = {
  loader: 'postcss-loader',
  options: {
    postcssOptions: {
      config: path.join(webpackDir, 'config', 'postcss.js'),
    },
    sourceMap: true,
  },
}


/**
 * Using MiniCssExtractPlugin in production or style-loader in development
 * @see https://webpack.js.org/plugins/mini-css-extract-plugin/#root
 * @see https://webpack.js.org/loaders/style-loader/#root
 */
export const styleLoader = isProd
    ? {
      loader: MiniCssExtractPlugin.loader,
      options: {
        esModule: false,
      },
    }
    : {
      loader: 'style-loader',
      options: {
        esModule: false,
      },
    };


/**
 * @see https://webpack.js.org/loaders/sass-loader/#problems-with-url
 */
export const resolveUrlLoader = {
  loader: 'resolve-url-loader',
  options: {
    sourceMap: true,
  },
};

export const babelLoader = {
  loader: 'babel-loader',
  options: {
    configFile: join(rootDir, '/.babelrc.js'),
  },
};

export const cssModulesSupportLoaderItems = [
  styleLoader,
  {
    ...cssLoader,
    options: {
      esModule: false,
      modules: {
        exportLocalsConvention: 'asIs',
        localIdentName: isProd ? '[contenthash:base64:6]' : '[local]__[contenthash:base64:5]',
      },
    },
  },
];

export const cssLoaderItems = [styleLoader, cssLoader];