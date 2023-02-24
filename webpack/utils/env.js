import path from 'path';
import dotenv from 'dotenv';
import { getPublicIPAddress } from './node-utils'

dotenv.config();

export const mode = process.env.NODE_ENV ?? 'production';
export const isProd = mode === 'production';
export const isDev = !isProd;
export const isDevServer = process.env.WEBPACK_IS_DEV_SERVER === 'true';
export const isProfiling = process.env.IS_PROFILING === 'true';

export const rootDir = path.join(__dirname, '..', '..');
export const webpackDir = path.join(__dirname, '..');
export const buildDir = isDev ? path.join(rootDir, 'dist') : path.join(rootDir, 'build');

export const HTML_TITLE = 'React Typescript Boilerplate';
export const ENTRY_FILE_NAME = 'index.tsx';

export const HOST = getPublicIPAddress();
export const PORT = process.env.PORT;
export const BASE_API_URL = process.env.BASE_API_URL;
export const FULL_API_URL = process.env.FULL_API_URL;
export const DEV_DOMAIN = process.env.DEV_DOMAIN;