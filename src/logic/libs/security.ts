/* eslint-disable @typescript-eslint/no-explicit-any */
export const BLACKLISTED_ACCESSORS: (keyof any)[] = ['constructor', 'prototype'];

/**
 * Checks key isn't blacklisted.
 * @param key Key or index to access with.
 * @returns If key isn't blacklisted
 */
export const safeKey = (key: keyof any) => !BLACKLISTED_ACCESSORS.includes(key);

/**
 * Blacklists specific keys to prevent object injection.
 * @param obj Object or array to be fetched from
 * @param key Key or index to access with.
 * @returns Accessed value, or `undefined` if key is blacklisted.
 */
export const safeAccessor = <O extends Record<string, any>, K extends keyof O>(
  obj: O,
  key: keyof O
): O[K] | undefined => (BLACKLISTED_ACCESSORS.includes(key) || typeof obj !== 'object' ? undefined : obj?.[key]);

/**
 * Blacklists specific keys to prevent object injection.
 * @param obj Object or array to be set
 * @param key Key or index to set.
 * @param value Value to set
 * @returns Object (mutated if key isn't blacklisted).
 */
export const safeMutator = <O extends Record<string, any>, K extends keyof O>(obj: O, key: K, value: O[K]) => {
  if (typeof obj === 'object' && key !== undefined && !BLACKLISTED_ACCESSORS.includes(key)) {
    obj[key] = value;
    return obj;
  }
  return obj;
};
