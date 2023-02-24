export const computeIntegerValue = (value: string, maxValue: number, maxIntegerDigits: number) => {
  let computed = value.slice(0, maxIntegerDigits); // если целое число больше по количеству символов

  if (/0./g.test(computed)) computed.replace('0', '');

  if (Number(computed) > maxValue) {
    computed = computed.slice(0, computed.length - 1) // если целое число больше по значению
  }
  return computed;
}

export const computeFloatValue = (value: string, maxValue: number, maxIntegerDigits: number, digitsAfterDot: number) => {
  let computed = value;

  if (computed === '.') return '';

  if (/0./g.test(computed) && !/0\./g.test(computed)) {
    computed = computed.replace('0', '');
  }

  if (Number(computed) > maxValue || Number(computed) === maxValue && computed.endsWith('.')) {
    computed = computed.slice(0, computed.length - 1);
  }
  computed = computed
    .split('.')
    .map((insertion, idx) => idx === 0 ? insertion.slice(0, maxIntegerDigits) : insertion.slice(0, digitsAfterDot))
    .join('.');
  return computed;
}
