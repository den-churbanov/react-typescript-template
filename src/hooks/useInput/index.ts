import { FormEventHandler, MouseEventHandler, useState } from 'react';
import { useDebounce } from '@/hooks';

type UseInputHook = (params?: {
  initialValue?: string | number,
  debounce?: number
}) => [string, MouseEventHandler<HTMLInputElement>, string];

export const useInput: UseInputHook = (props = {}) => {
  const { initialValue = '', debounce = 500 } = props;
  const [value, setValue] = useState(String(initialValue));

  const onChange: FormEventHandler<HTMLInputElement> = e => {
    setValue((e.target as HTMLInputElement).value);
  }

  const debounced = useDebounce(value, debounce);

  return [value, onChange, debounced];
}