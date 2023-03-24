import { useDebugValue, useEffect, useState } from 'react';

type Config<T> = {
  instant?: T[];
  delayed?: T[];
};

const useDelayedValue = <T>(value: T, delay: number, { instant, delayed }: Config<T> = {}) => {
  const [_value, _setValue] = useState(value);
  useEffect(() => {
    if (instant?.includes(value) || (delayed && !delayed.includes(value))) {
      _setValue(value);
    } else {
      // we can't clean up this otherwise it would be a debounce
      // probably not worth an isMounted check
      setTimeout(_setValue, delay, value);
    }
  }, [value, delay, instant, delayed]);
  if (process.env.NODE_ENV === 'development') {
    // this env var should never change within the context of a build/session, so the order should be fine
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useDebugValue(_value);
  }
  return _value;
};

export default useDelayedValue;
