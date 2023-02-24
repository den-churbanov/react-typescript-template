import { isDev } from './env';

export const arrayFilterEmpty = array => array.filter(x => !!x);

export const fileNameFactory = ext => isDev ? `[name].${ext}` : `${ext}/[name].[contenthash].${ext}`;
export const chunkFilenameFactory = ext => isDev ? `[name].[id].${ext}` : `${ext}/[id].[contenthash].${ext}`;

export const filename = isDev ? '[name].[fullhash].js' : 'js/[name].[contenthash].js';