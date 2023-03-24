import type { Key } from 'react';

/** Either the actual type, or the type wrapped in a promise. */
export type MaybePromise<T> = T | PromiseLike<T>;

export type Nullable<T> = T | null;

export type Nullish<T> = T | null | undefined;

export type EnumLike = {
  [k: string]: string | number;
  [nu: number]: string;
};

export type ObjectValues<T> = T[keyof T];

export type ObjectEntries<T> = Array<{ [K in keyof T]: [K, T[K]] }[keyof T]>;

export type SentenceCase<T extends string> = T extends `${infer First}${infer Rest}`
  ? `${Uppercase<First>}${Lowercase<Rest>}`
  : T;

/** Extract keys of object T that match type V */
export type KeysMatching<T, V> = { [K in keyof T]-?: T[K] extends V ? K : never }[keyof T];

/** Merge object intersections visually */
// eslint-disable-next-line @typescript-eslint/ban-types
export type Id<T> = {} & { [P in keyof T]: T[P] };

/**
 * Turns an object type such as `{ hi: string; bye: number; }` to a discriminated union, e.g. `{ type: "hi", val: string } | { type: "bye", val: number }`
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export type RecordToDiscrimUnion<
  Obj extends Record<any, any>,
  ValueKey extends keyof any = 'val',
  DiscrimKey extends keyof any = 'type'
> = { [Key in keyof Obj]: Id<{ [key in DiscrimKey]: Key } & { [key in ValueKey]: Obj[Key] }> }[keyof Obj];
/* eslint-enable @typescript-eslint/no-explicit-any */

/** Add a required key prop to a set of props */
export type WithKey<Props> = Id<Props & { key: Key }>;

/** Only allow one of a given set of keys */
export type ExactlyOneKey<K extends keyof any, V, KK extends keyof any = K> = {
  [P in K]: { [Q in P]: V } & { [Q in Exclude<KK, P>]?: never } extends infer O ? { [Q in keyof O]: O[Q] } : never;
}[K];

/** Make specified keys optional */
export type PickPartial<T, K extends keyof T> = Id<Omit<T, K> & Partial<Pick<T, K>>>;

/** Make specified keys required */
export type PickRequired<T, K extends keyof T> = Id<Omit<T, K> & Required<Pick<T, K>>>;

export type OnlyRequiredKeys<T> = { [K in keyof T]-?: undefined extends T[K] ? never : K }[keyof T];

export type IfHasRequiredKeys<T, True, False> = OnlyRequiredKeys<T> extends never ? False : True;

export type OnlyOptionalKeys<T> = { [K in keyof T]-?: undefined extends T[K] ? K : never }[keyof T];

export type KeyofUnion<T> = T extends T ? keyof T : never;

export type AccessFromUnion<T, Key extends KeyofUnion<T>> = {
  [U in T as keyof U]: {
    [K in Key]: K extends keyof U ? U[K] : never;
  }[Key];
}[KeyofUnion<T>];

export type Satisfies<T extends U, U> = T;

/**
 * Replace part of a string type with another string
 * e.g.
 * ```ts
 * ReplaceString<'hi there', 'hi', 'bye'> // 'bye there'
 * ReplaceString<'cool shirt', 'cool ', ''> // 'shirt'
 * ```
 */
export type ReplaceString<
  Str extends string,
  ToReplace extends string,
  Replace extends string,
  ReplaceAll extends boolean = false
> = Str extends `${infer Before}${ToReplace}${infer After}`
  ? `${Before}${Replace}${ReplaceAll extends true ? ReplaceString<After, ToReplace, Replace, ReplaceAll> : After}`
  : Str;

/**
 * Replace object keys with new values
 * ```ts
 * Overwrite<{ key: string; key2: number; }, { key2: string }> // { key: string; key2: string; }
 * ```
 */
export type Overwrite<Original, Override> = Id<Pick<Original, Exclude<keyof Original, keyof Override>> & Override>;

export type DeepOverwrite<T, U> = T extends object
  ? U extends object
    ? {
        [K in keyof T]: K extends keyof U ? DeepOverwrite<T[K], U[K]> : T[K];
      }
    : U
  : U;
