import { useDebugValue, useEffect, useRef } from 'react';
import { shallowEqual } from 'react-redux';

export const useShallowStableValue = <T>(value: T) => {
  const cache = useRef(value);
  useEffect(() => {
    if (!shallowEqual(cache.current, value)) {
      cache.current = value;
    }
  }, [value]);

  const finalValue = shallowEqual(cache.current, value) ? cache.current : value;
  if (process.env.NODE_ENV === 'development') {
    // this env var should never change within the context of a build/session, so the order should be fine
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useDebugValue(finalValue);
  }
  return finalValue;
};
