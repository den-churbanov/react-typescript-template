import { useEffect, useRef } from 'react';

export type IProps = Record<string, any>;

export const useWhyDidComponentUpdate = (componentName: string, props: IProps) => {
  const prevProps = useRef<IProps>({});

  useEffect(() => {
    if (prevProps.current) {
      const allKeys = Object.keys({ ...prevProps.current, ...props });
      const changedProps: IProps = {};

      allKeys.forEach((key) => {
        if (!Object.is(prevProps.current[key], props[key])) {
          changedProps[key] = {
            from: prevProps.current[key],
            to: props[key],
          };
        }
      });

      if (Object.keys(changedProps).length) {
        console.info('[why-did-component-update]', componentName, changedProps);
      }
    }

    prevProps.current = props;
  });
}