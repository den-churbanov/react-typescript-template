import { ChangeEventHandler, ClipboardEventHandler, KeyboardEventHandler } from 'react';
import { useMemoizedCallback } from '@/hooks/useMemoizedCallback';
import { emptyStringIfZero } from '@/helpers';

export const joinArrayToString = (value: number[]) => {
  return Array.isArray(value) ? emptyStringIfZero(value.join(',')).toString() : '';
}

const computeManyNumbersString = (value: string, maxValue: number, maxIntegerDigits: number) => {
  if (value === ',') return '';

  return value
    .replace(/[,\s]{2,}/, ",")
    .split(',')
    .map(value => Number(value) > maxValue ? value.slice(0, value.length - 1) : value.slice(0, maxIntegerDigits))
    .join(',');
}

export const useInputManyNumber = (value: number[], maxValue: number = 999) => {

  const maxIntegerDigits = String(maxValue).length;

  const onChange: ChangeEventHandler<HTMLInputElement> = useMemoizedCallback(e => {
    e.target.value = computeManyNumbersString(e.target.value, maxValue, maxIntegerDigits);
  })

  const onKeyPress: KeyboardEventHandler<HTMLInputElement> = useMemoizedCallback(e => {
    const isCopyPaste = e.ctrlKey && (e.key === 'c' || e.key === 'v' || e.key === 'a');
    const isDeleting = e.key === 'Backspace' || e.key === 'Delete';
    if (!/[0-9,]/.test(e.key) && !isCopyPaste && !isDeleting) {
      e.preventDefault();
    }
  })

  const onPaste: ClipboardEventHandler<HTMLInputElement> = useMemoizedCallback(e => {
    e.preventDefault();
    const value = e.clipboardData.getData('Text');

    e.currentTarget.value = computeManyNumbersString(value, maxValue, maxIntegerDigits);
  })

  return {
    onChange,
    onKeyPress,
    onPaste,
    defaultValue: joinArrayToString(value)
  }
}