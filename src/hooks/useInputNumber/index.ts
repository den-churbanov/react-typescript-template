import React, { ChangeEventHandler, ClipboardEventHandler, KeyboardEventHandler } from 'react';
import { computeIntegerValue, computeFloatValue } from './utils';
import { useMemoizedCallback } from '@/hooks';
import { emptyStringIfZero } from '@/helpers';


export const useInputNumber = (
  value: number,
  maxValue: number = 999,
  digitsAfterDot: number = 2,
  type: 'integer' | 'float' = 'integer',
  onChangeInput?: React.ChangeEventHandler<HTMLInputElement>
) => {

  const maxIntegerDigits = String(maxValue).length;

  const onChange: ChangeEventHandler<HTMLInputElement> = useMemoizedCallback(e => {
    if (type === 'integer') {
      e.target.value = computeIntegerValue(e.target.value, maxValue, maxIntegerDigits);
    }

    if (type === 'float') {
      e.target.value = computeFloatValue(e.target.value, maxValue, maxIntegerDigits, digitsAfterDot);
    }
    if (onChangeInput) {
      onChangeInput(e);
    }
  })

  const onKeyPress: KeyboardEventHandler<HTMLInputElement> = useMemoizedCallback(e => {
    const value = (e.target as HTMLInputElement).value;
    const isCopyPaste = e.ctrlKey && (e.key === 'c' || e.key === 'v' || e.key === 'a');
    const isDeleting = e.key === 'Backspace' || e.key === 'Delete';
    const isDotAllowed = e.key == '.' && type === 'float' && !value.includes('.');
    if (!/\d/.test(e.key) && !isDotAllowed && !isDeleting && !isCopyPaste) e.preventDefault();
  })

  const onPaste: ClipboardEventHandler<HTMLInputElement> = useMemoizedCallback(e => {
    e.preventDefault();
    const value = e.clipboardData.getData('Text');
    if (type === 'integer' && value) {
      e.currentTarget.value = computeIntegerValue(value, maxValue, maxIntegerDigits)
    }

    if (type === 'float' && value) {
      e.currentTarget.value = computeFloatValue(value, maxValue, maxIntegerDigits, digitsAfterDot);
    }
  })

  return {
    onChange,
    onKeyPress,
    onPaste,
    defaultValue: emptyStringIfZero(value)
  }
}