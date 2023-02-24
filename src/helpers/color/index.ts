import { isNumber, roundDecimal } from '@/helpers';

const RGBA_REGEXP = /^rgba?\(((25[0-5]|2[0-4]\d|1\d{1,2}|\d\d?)\s*,\s*?){2}(25[0-5]|2[0-4]\d|1\d{1,2}|\d\d?)\s*,?\s*([01]\.?\d*?)?\)$/;
const HEX_REGEXP = /^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

const RGBA_PARSE_ERROR_MSG = (value: string) =>
  `Разбиение цвета ${value} на RGBA состовляющие невозможно. Верный формат - rgba([0-255], [0-255], [0-255], [0-1]?)`;

const HEX_FORMAT_ERROR = (value: string) =>
  `Разбиение цвета ${value} на HEX состовляющие невозможно. Верный формат - #RRGGBBAA или #RGBA`;

export const parseRGBAString = (rgbaString: string): number[] => {
  if (!RGBA_REGEXP.test(rgbaString))
    throw new Error(RGBA_PARSE_ERROR_MSG(rgbaString));

  let values = rgbaString
    .replaceAll(/^rgba?\(/g, '')
    .replaceAll(')', '')
    .split(',');

  const invalidValue = values.find(value => !isNumber(value));

  if (invalidValue) throw new Error(RGBA_PARSE_ERROR_MSG(invalidValue));

  const rgbValues = values
    .map(value => parseInt(value))
    .map(value => Math.min(value, 255))
    .map(value => Math.max(value, 0));

  let alpha = rgbValues.length === 3 ? 1 : rgbValues.pop();

  if (alpha !== 1) {
    alpha = Math.min(alpha, 1);
    alpha = Math.max(alpha, 0);
    rgbValues.push(alpha);
  }

  return rgbValues;
}

/**
 * @param args множество массивов составляющих [r, g, b, a] или строку формата rgba?(r, g, b, a?)
 * */
export const mixRGBAColors = (...args: (number[] | string)[]): number[] => {
  const parsed = args.map(value => typeof value === 'string' ? parseRGBAString(value) : value);

  let base = [0, 0, 0, 0];
  let mix: number[];
  let added: number[];

  while (added = parsed.shift()) {
    if (typeof added[3] === 'undefined') {
      added[3] = 1;
    }
    const [br, bg, bb, baseAlpha] = base;
    const [ar, ag, ab, addAlpha] = added;

    if (baseAlpha && addAlpha) {
      mix = [0, 0, 0, 0];

      // alpha channel
      mix[3] = 1 - (1 - addAlpha) * (1 - baseAlpha);

      // red channel
      mix[0] = Math.round((ar * addAlpha / mix[3]) + (br * baseAlpha * (1 - addAlpha) / mix[3]));

      // green channel
      mix[1] = Math.round((ag * addAlpha / mix[3]) + (bg * baseAlpha * (1 - addAlpha) / mix[3]));

      // blue channel
      mix[2] = Math.round((ab * addAlpha / mix[3]) + (bb * baseAlpha * (1 - addAlpha) / mix[3]));
    } else if (added) {
      mix = added;
    } else {
      mix = base;
    }
    base = mix;
  }

  return mix;
}

/**
 * @param rgba - массив [r, g, b, a] или строку формата rgba?(r, g, b, a?)
 * */
export const parseRGBAtoHEX = (rgba: number[] | string): string => {
  let values = typeof rgba === 'string' ? parseRGBAString(rgba) : rgba;
  let alpha = values.length === 3 ? 1 : values.pop();

  values = values
    .map(value => Math.round(value))
    .map(value => Math.min(value, 255))
    .map(value => Math.max(value, 0))

  if (alpha != undefined && alpha !== 1) {
    alpha = Math.min(alpha, 1);
    alpha = Math.max(alpha, 0);
    values.push(alpha);
  }

  return '#' + values.map(c => c.toString(16).padStart(2, '0')).join('');
}

export const hasAlphaChannel = (a: number) => a !== 1 && a != undefined && !Number.isNaN(a);

export const stringifyRGBA = ([r, g, b, a]: number[]): string => {
  const prefix = 'rgb' + (hasAlphaChannel(a) ? 'a' : '');
  const alpha = hasAlphaChannel(a) ? `, ${a}` : '';
  return `${prefix}(${r}, ${g}, ${b}${alpha})`;
}

function parseHEXtoRGBA(hex: string, stringify?: false): number[];
function parseHEXtoRGBA(hex: string, stringify?: true): string;

function parseHEXtoRGBA(hex: string, stringify: boolean = false): number[] | string {

  if (!HEX_REGEXP.test(hex)) throw new Error(HEX_FORMAT_ERROR(hex));

  const values = hex.replace('#', '');

  const matcher = values.length < 5 ? /[0-9a-f]/g : /[0-9a-f]{2}/g;

  const [r, g, b, a] = values.match(matcher).map(n => parseInt(n, 16));

  if (stringify) return stringifyRGBA([r, g, b, a]);

  if (hasAlphaChannel(a)) return [r, g, b, a];

  return [r, g, b];
}

export const mixHEXColors = (...hexes: string[]): string => {
  const rgbs = hexes.map(hex => parseHEXtoRGBA(hex));
  const mixed = mixRGBAColors(...rgbs)
  return parseRGBAtoHEX(mixed);
}

export const computeRGBAGradientColor = (colors: (number[] | string)[], stops: number[], value: number) => {
  if (colors.length !== stops.length) throw new Error('Colors.length not equal stops.length');

  const parsed = colors.map(value => typeof value === 'string' ? parseRGBAString(value) : value);

  const idx = stops.findIndex(stop => stop === value);

  if (idx !== -1) return stringifyRGBA(parsed[idx]);

  const second = stops.findIndex(stop => stop > value), first = second - 1;

  const diff = stops[second] - stops[first];

  const w2 = roundDecimal((value - stops[first]) / diff, 3),
    w1 = roundDecimal((stops[second] - value) / diff, 3);

  const color1 = parsed[first], color2 = parsed[second];

  return stringifyRGBA([
    Math.round(color1[0] * w1 + color2[0] * w2),
    Math.round(color1[1] * w1 + color2[1] * w2),
    Math.round(color1[2] * w1 + color2[2] * w2),
    Math.round(color1[3] * w1 + color2[3] * w2)
  ]);
}