import path from 'path';
import { setupProxyMiddleware } from './devServerProxy';
import { HOST, PORT, BASE_API_URL, rootDir } from '../utils/env';

/**
 * @see https://webpack.js.org/configuration/dev-server/#devserver
 * */

export const devServer = {
  // client: {
  //   // overlay: false,
  // },
  headers: {'Access-Control-Allow-Origin': '*'},
  historyApiFallback: true,
  allowedHosts: [HOST],
  host: HOST,
  port: PORT,
  hot: true,
  static: {
    publicPath: '/',
    directory: path.join(rootDir, 'dist'),
  },
  server: {
    type: 'http',
  },
  // watchFiles: ['src/**/*', 'public/**/*'], // WARNING! c этой опцией hot reload не работает
  /**
   * @description
   * @see https://webpack.js.org/configuration/dev-server/#devserversetupmiddlewares
   * */
  setupMiddlewares: (middlewares, devServer) => {
    const proxyMiddleware = setupProxyMiddleware();
    devServer.app.use(BASE_API_URL, proxyMiddleware);
    middlewares.push({
      name: 'credentials-proxy-middleware',
      middleware: proxyMiddleware,
    });

    return middlewares;
  }
};
