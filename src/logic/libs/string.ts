import type { ReplaceString } from 'src/types/util';

/**
 * Interweaves multiple arrays into a single array.
 * @param arrays Arrays to be combined
 * @returns An array with all items combined in alternating order.
 *
 * found https://stackoverflow.com/a/57748845
 */
export const braidArrays = <T>(...arrays: T[][]) => {
  const braided: T[] = [];
  for (let i = 0; i < Math.max(...arrays.map((a) => a.length)); i++) {
    arrays.forEach((array) => {
      if (array[i] !== undefined) braided.push(array[i]);
    });
  }
  return braided;
};

const isPluralTuple = (arr: unknown[]): arr is [number, string, string | undefined] =>
  typeof arr[0] === 'number' && typeof arr[1] === 'string' && ['string', 'undefined'].includes(typeof arr[2]);

/**
 * Tagged template literal to pluralise based on a value
 *
 * Values are given as a tuplet `[number, single]` or optionally `[number, single, plural]`.
 *
 * Plural is `single` appended with `s` if not provided.
 * @example
 * pluralise`I have ${cows} ${[cows, "cow"]}, ${sheep} ${[sheep, "sheep", "sheep"]}, and ${geese} ${[geese, "goose", "geese"]}`
 */

export const pluralise = (strings: TemplateStringsArray, ...expressions: unknown[]) => {
  const plurals = expressions.map((value) => {
    if (Array.isArray(value) && isPluralTuple(value)) {
      const [val, single, plural] = value;
      return val === 1 ? single : plural ?? `${single}s`;
    }
    return value;
  });
  return braidArrays([...strings], plurals).join('');
};

export const typedReplace = <
  Str extends string,
  ToReplace extends string,
  Replace extends string,
  ReplaceAll extends boolean = false
>(
  str: Str,
  searchValue: ToReplace,
  replaceValue: Replace,
  all: ReplaceAll = false as ReplaceAll
) =>
  (all ? str.replaceAll(searchValue, replaceValue) : str.replace(searchValue, replaceValue)) as ReplaceString<
    Str,
    ToReplace,
    Replace,
    ReplaceAll
  >;
