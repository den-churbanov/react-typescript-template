import { aliasItems, externalItems } from './config';
import entry from './entry';
import optimization from './optimization';
import { infrastructureLogging, stats } from './logging';
import * as plugins from './plugins';
import * as rules from './rules';
import { isDevServer, mode, buildDir } from './utils/env';
import { arrayFilterEmpty, filename } from './utils/helpers';

export default {
  context: __dirname,
  target: isDevServer ? 'web' : ['web', 'es5'],
  mode,
  entry,
  output: {
    path: buildDir,
    publicPath: '/',
    filename
  },
  module: {
    rules: arrayFilterEmpty([
      rules.javascriptRule,
      rules.typescriptRule,
      // rules.htmlRule, // для html в src
      rules.imagesRule,
      rules.fontsRule,
      rules.cssRule,
      ...rules.sassRules,
      ...rules.svgRules,
    ]),
  },
  plugins: arrayFilterEmpty([
    plugins.htmlWebpackPlugin,
    plugins.providePlugin,
    plugins.definePlugin,
    plugins.forkTsCheckerWebpackPlugin,
    plugins.esLintPlugin,
    plugins.copyPlugin,
    plugins.progressPlugin,
  ]),
  resolve: {
    alias: aliasItems,
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    modules: ["node_modules"],
  },
  optimization,
  externals: externalItems,
  infrastructureLogging,
  stats,
};
