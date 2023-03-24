import type { NoInfer } from '@reduxjs/toolkit/dist/tsHelpers';
import { current, isDraft } from 'immer';
import type { Truthy } from 'lodash';
import { memoize, memoizeWithArgs } from 'proxy-memoize';
import type { SortDir } from 'src/hooks/use-sort';

/**
 * Formats a number, inserting commas where appropriate.
 * @param value Number to be formatted
 * @returns formatted string
 */
export const formatCount = (value = 0): string => {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * Rounds to a specified amount of decimal places
 * @param v Val to round
 * @param dp Decimal places (0 by default)
 * @returns value rounded to specified dp
 */
export const round = (v: number, dp = 0) => {
  const m = 10 ** dp;
  return Math.round(v * m) / m;
};

/**
 * This function will generate a display string for whatever value is being passed, incl. rounding, suffixes, and divsion
 */
export const constructValueDisplayString = (value: number | string, dp = 1, formatNumber = true, prefix = '') => {
  let parsedValue = typeof value === 'string' ? parseFloat(value) : value;
  if (typeof value === 'string' && Number.isNaN(parsedValue)) {
    return value;
  }

  //Calculate the suffix required, and divide the number if necessary
  let suffix = '';
  if (formatNumber) {
    if (parsedValue >= 1000000) {
      suffix = 'm';
      parsedValue = parsedValue / 1000000;
    } else if (parsedValue >= 1000) {
      suffix = 'k';
      parsedValue = parsedValue / 1000;
    }
  }

  //Now we've got something closer to what we want to show on the screen, make sure it's rounded properly
  parsedValue = round(parsedValue, dp);

  //If it's a whole number, don't set the decimal places, otherwise, set them
  const returnValue = parsedValue % 1 != 0 ? parsedValue.toFixed(dp) : parsedValue;

  //Send it back with optional suffix attached
  return `${prefix}${returnValue}${suffix}`;
};

/**
 * Returns the percentage as an as a float or an integer, it will always return an integer if `round` is true
 * @param fraction Portion of total
 * @param total Total
 * @param shouldRound Whether to round (true by default)
 * @param dp Decimal places to round to (0 by default)
 */
export function calculatePercentage(fraction: number, total: number, shouldRound = true, dp = 0) {
  if (fraction === 0 && total === 0) {
    return 0;
  }

  if (total === 0) {
    return 0;
  }

  const percentage = (100 / total) * fraction;
  return shouldRound ? round(percentage, dp) : percentage;
}

/**
 * Formats a string with a rounded percentage based on provided value & total
 * @param value
 * @param total
 * @returns - string
 */
export const formatPercentageDisplayString = (value: number, total: number): string => {
  const percentage = (value / total) * 100;
  return `${percentage.toFixed(1)}%`;
};

/**
 * Checks that given object contains key, and **asserts** that key is keyof obj.
 * @param obj
 * @param key
 * @returns
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const hasKey = <O extends Record<any, any>>(obj: O, key: keyof any): key is keyof O => key in obj;

/** sortStringsAscending()
 * Predicate to handle .sort() on an iterable of strings.
 * Creates an ascending iterable based on value passed in.
 * @param a
 * @param b
 */
export const sortStringsAscending = (a: unknown = '', b: unknown = '') => {
  const aString = typeof a === 'string' ? a : `${a}`; //cast to string if necessary
  const bString = typeof b === 'string' ? b : `${b}`;
  const aLower = aString.toLowerCase();
  const bLower = bString.toLowerCase();

  if (aLower < bLower) {
    return -1;
  } else if (aLower > bLower) {
    return 1;
  } else {
    // if they're the same lowercase, try them input-case and order them lowercase first
    return aString.localeCompare(bString);
  }
};

/** sortStringsDescending()
 * Predicate to handle .sort() on an iterable of strings.
 * Creates a descending iterable based on value passed in.
 * @param a
 * @param b
 */
export const sortStringsDescending = (a: unknown = '', b: unknown = '') => {
  const aString = typeof a === 'string' ? a : `${a}`; //cast to string if necessary
  const bString = typeof b === 'string' ? b : `${b}`;
  const aLower = aString.toLowerCase();
  const bLower = bString.toLowerCase();

  if (aLower > bLower) {
    return -1;
  } else if (aLower < bLower) {
    return 1;
  } else {
    // if they're the same lowercase, try them input-case and order them uppercase first
    return bString.localeCompare(aString);
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const errorHasMessage = (err: any): err is { message: string } => 'message' in err;

export const hasErrorCode = (err: unknown): err is { code: string } =>
  typeof err === 'object' && !!err && 'code' in err;

export function nonNullable<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}

export const truthy = <T>(value: T): value is Truthy<T> => !!value;

export const isNotDeleted = <T extends { _deleted?: boolean | null }>(obj: T | null): obj is Truthy<T> =>
  !!(obj && !obj._deleted);

export const safeAssign = <T extends Record<any, any>>(target: T, ...sources: Partial<NoInfer<T>>[]): T =>
  Object.assign(target, ...sources);

/**
 * Sorts array by specific key (for use on render lists)
 * @param key Key to sort by
 * @param sort sort direction (defaults to ascending)
 * @returns Predicate to pass to .sort
 */
export const sortByKey = <T extends Record<string, any>>(
  key: keyof NoInfer<T>,
  sort: SortDir = 'asc',
  customSorts: Partial<Record<keyof NoInfer<T>, (dir: SortDir) => (a: NoInfer<T>, b: NoInfer<T>) => number>> = {}
): ((a: T, b: T) => number) =>
  customSorts[key]?.(sort) ??
  ((a, b) => {
    switch (typeof a?.[key]) {
      case 'number':
        return sort === 'asc' ? (b?.[key] ?? 0) - (a?.[key] ?? 0) : (a?.[key] ?? 0) - (b?.[key] ?? 0);
      default:
        return sort === 'asc' ? sortStringsAscending(a?.[key], b?.[key]) : sortStringsDescending(a?.[key], b?.[key]);
    }
  });

/**
 * Create a predicate to filter an array by searching specified keys for a given substring
 * @param keys Array of keys to search
 * @param value Substring to find
 * @param config Configuration, e.g. whether to be case sensitive
 * @returns Predicate to pass to .filter
 */
export const searchByKeys = <T extends Record<string, any>>(
  value: string,
  keys: [keyof T, ...(keyof T)[]],
  { caseSensitive = false }: { caseSensitive?: boolean } = {}
) => {
  const finalVal = caseSensitive ? value : value.toLocaleLowerCase();
  return (obj: T): boolean => {
    // like a .some but hopefully faster
    for (const key of keys) {
      if (typeof obj[key] !== 'string') {
        continue;
      }
      const keyVal = caseSensitive ? obj[key] : obj[key].toLocaleLowerCase();
      if (keyVal.includes(finalVal)) {
        return true;
      }
    }
    return false;
  };
};

/**
 * Define a value inline that's a specified type
 * @param val Value to be defined
 * @returns Value that was defined
 */
export const id = <TypeToFollow>(val: TypeToFollow) => val;

/**
 * Define a variable inline that **satisfies** a specified type, i.e. is assignable, while keeping its original type
 * ```ts
 * const value = satisfies<{ name: string | null }>()({ name: "hi" }); // value's type is { name: string } instead of { name: string | null }
 * ```
 */
export const satisfies =
  <ToSatisfy>() =>
  <SpecificType extends ToSatisfy>(val: SpecificType) =>
    val;

/**
 * Check that an item is included in a given array, and assert that the item is the same type as the contents of the array
 * @param array Array to match
 * @param item Item to check
 * @returns true if array includes item
 */
export const arrayIncludes = <T>(array: T[] | readonly T[], item: any): item is T => array.includes(item);

export const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function assert(condition: boolean, ...args: ConstructorParameters<typeof Error>): asserts condition {
  if (!condition) {
    throw new Error(...args);
  }
}

/**
 * "Draft-Safe" version of `proxy-memoize`'s `memoize`:
 * If an `immer`-drafted object is passed into the resulting selector's first argument,
 * the selector will act on the current draft value, instead of returning a cached value
 * that might be possibly outdated if the draft has been modified since.
 */
export const draftSafeMemoize: typeof memoize = (...args) => {
  const selector = (memoize as any)(...args);
  const wrappedSelector = (obj: unknown) => selector(isDraft(obj) ? current(obj) : obj);
  return wrappedSelector as any;
};

/**
 * "Draft-Safe" version of `proxy-memoize`'s `memoizeWithArgs`:
 * If an `immer`-drafted object is passed into the resulting selector's first argument,
 * the selector will act on the current draft value, instead of returning a cached value
 * that might be possibly outdated if the draft has been modified since.
 */
export const draftSafeMemoizeWithArgs: typeof memoizeWithArgs = (...args) => {
  const selector = (memoizeWithArgs as any)(...args);
  const wrappedSelector = (obj: unknown, ...rest: unknown[]) => selector(isDraft(obj) ? current(obj) : obj, ...rest);
  return wrappedSelector as any;
};

export function containsUnicode(s: string) {
  //eslint-disable-next-line
  return /[^\u0000-\u00ff]/.test(s);
}
