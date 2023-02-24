import { createProxyMiddleware } from 'http-proxy-middleware';
import { DEV_DOMAIN, HOST, FULL_API_URL } from '../utils/env';

var cookie;
/**
 * @description Необходим для работы с http only cookie в режиме разработки.
 * Перехватывает куки, перезаписывает домен и хост запросов.
 * @see https://www.npmjs.com/package/http-proxy-middleware
 * */
export const setupProxyMiddleware = () => createProxyMiddleware({
  target: DEV_DOMAIN,
  changeOrigin: true,
  cookieDomainRewrite: HOST,
  cookiePathRewrite: '/',
  hostRewrite: FULL_API_URL,
  logLevel: 'silent',
  onProxyReq: (proxyReq) => {
    if (cookie) {
      proxyReq.setHeader('Cookie', cookie[0]);
    }
    proxyReq.setHeader("Access-Control-Allow-Origin", `*`);
    proxyReq.setHeader(
        "Access-Control-Allow-Methods",
        "OPTIONS, GET, POST, PUT, PATCH, DELETE"
    );
    proxyReq.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  },
  onProxyRes: (proxyRes, req, res) => {
    let proxyCookie = proxyRes.headers["set-cookie"];
    if (proxyCookie) {
      cookie = proxyCookie;
    }
    res.setHeader("Access-Control-Allow-Origin", `*`);
    res.setHeader(
        "Access-Control-Allow-Methods",
        "OPTIONS, GET, POST, PUT, PATCH, DELETE"
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  },
  withCredentials: true,
  secure: false,
  followRedirects: false
});