import { memoize } from 'proxy-memoize';

export type InputType<Input extends { eq?: any } | null | undefined> = Input extends { eq?: infer T | null }
  ? T
  : never;

export type FilterInput<FI> = {
  and?: Array<FI | null> | null;
  or?: Array<FI | null> | null;
  not?: FI | null;
};

export type FilterInputType<FI extends FilterInput<FI>> = {
  [K in keyof FI]: FI[K] extends { eq?: any } | null | undefined ? InputType<FI[K]> : never;
};

const _countFilters = <FI extends FilterInput<FI>>(filter: FI): number => {
  const keysToIgnore = ['and', 'or', 'not'];
  const normalKeys = Object.keys(filter).filter((key) => !keysToIgnore.includes(key));
  const andFilters = filter.and?.reduce<number>((acc, filter) => acc + (filter ? _countFilters(filter) : 0), 0) ?? 0;
  const orFilters = filter.or?.reduce<number>((acc, filter) => acc + (filter ? _countFilters(filter) : 0), 0) ?? 0;
  const notFilters = filter.not ? _countFilters(filter.not) : 0;
  const total = normalKeys.length + andFilters + orFilters + notFilters;
  return total;
};

export const countFilters = memoize(_countFilters, { size: 2 });
