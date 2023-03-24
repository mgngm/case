import { useCallback, useDebugValue, useEffect, useState } from 'react';
import { debounce } from 'lodash';
import { useShallowStableValue } from 'src/hooks/use-shallow-stable-value';

type Config<T> = {
  instant?: T[];
  delayed?: T[];
};

const useDebouncedValue = <T>(value: T, delay: number, { instant, delayed }: Config<T> = {}) => {
  const [_value, setValue] = useState(value);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSetValue = useCallback(debounce(setValue, delay), [setValue, delay]);
  const stableInstant = useShallowStableValue(instant);
  const stableDelayed = useShallowStableValue(delayed);
  useEffect(() => {
    if (stableInstant?.includes(value) || (stableDelayed && !stableDelayed.includes(value))) {
      debouncedSetValue.cancel();
      setValue(value);
    } else {
      debouncedSetValue(value);
    }
  }, [value, stableInstant, stableDelayed, debouncedSetValue]);
  if (process.env.NODE_ENV === 'development') {
    // this env var should never change within the context of a build/session, so the order should be fine
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useDebugValue(_value);
  }
  return _value;
};

export default useDebouncedValue;
