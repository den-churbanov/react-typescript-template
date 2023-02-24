import { ProvidePlugin } from 'webpack';

/**
 * @example
 *  const config = {
 *       $: 'jquery',
 *  }
 */
const config = {};

export const providePlugin = new ProvidePlugin(config);