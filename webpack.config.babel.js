import merge from 'webpack-merge';
import baseConfig from './webpack/base';
import devConfig from './webpack/dev';
import prodConfig from './webpack/prod';
import { isProd, mode, isProfiling, isDevServer, HOST, PORT } from './webpack/utils/env';

if (!isProfiling) console.info('Front Building Mode:', mode.toUpperCase());
if (isDevServer) console.info(`Development server started at: http://${HOST}:${PORT}`);

export default () => isProd ? merge(baseConfig, prodConfig) : merge(baseConfig, devConfig);