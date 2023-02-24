import { isProd } from '../utils/env';
import { arrayFilterEmpty } from '../utils/helpers';

/**
 * @see https://github.com/postcss/postcss
 */
module.exports = () => {
  const plugins = arrayFilterEmpty([
    'autoprefixer',
    isProd ? 'cssnano' : null,
  ]);

  return {
    plugins,
  }
}