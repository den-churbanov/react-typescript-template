import { isProfiling } from './utils/env';

const applyWebpackProgress = name => name === 'webpack.Progress';

/**
 * @see https://webpack.js.org/configuration/other-options/#infrastructurelogging
 * level - Фильтрует вывод в консоль (warn - только ошибки и предупреждения)
 * */
export const infrastructureLogging = {
  level: 'warn',
  debug: [applyWebpackProgress],
}

export const stats = isProfiling ? 'normal' : 'minimal';
