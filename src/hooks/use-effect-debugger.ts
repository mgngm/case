import type { DependencyList, EffectCallback } from 'react';
import { useEffect, useRef } from 'react';

const usePrevious = <T>(value: T, initialValue: T) => {
  const ref = useRef(initialValue);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export const useEffectDebugger = (
  effectHook: EffectCallback,
  dependencies: DependencyList,
  dependencyNames: Array<string | undefined> = []
) => {
  const previousDeps = usePrevious(dependencies, []);

  const changedDeps = dependencies.reduce<Record<string, { before: string; after: string }>>(
    (accum, dependency, index) => {
      if (dependency !== previousDeps[index]) {
        const keyName = dependencyNames[index] || index;
        accum[keyName] = {
          before: JSON.stringify(previousDeps[index]),
          after: JSON.stringify(dependency),
        };
      }

      return accum;
    },
    {}
  );

  if (Object.keys(changedDeps).length) {
    console.log('[use-effect-debugger] ', JSON.stringify(changedDeps));
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effectHook, dependencies);
};
