import { useCallback, useDebugValue, useEffect, useMemo, useReducer } from 'react';
import type { AnyAction, Draft, PayloadAction } from '@reduxjs/toolkit';
import { bindActionCreators, createSlice } from '@reduxjs/toolkit';
import { shallowEqual } from 'react-redux';
import type { FilterInput, InputType } from 'src/logic/libs/graphql';
import { draftSafeMemoize } from 'src/logic/libs/helpers';
import type { Id, Nullish } from 'src/types/util';

// exclude and, or, and not
type StandardKeys<Filter extends FilterInput<Filter>> = Exclude<keyof Filter, keyof FilterInput<any>>;

type FieldConfig = {
  /** whether multiple values can be selected
   * if true, values go in `filter.and` as an `{ or: values }` entry, instead of `filter[key]: value`
   */
  multi?: true;
};

/**
 * Keys of FieldMap that are multi
 */
type MultiKeys<FieldMap extends { [K in string]?: FieldConfig | true }> = Id<
  { [Key in keyof FieldMap]: FieldMap[Key] extends { multi: true } ? Key : never }[keyof FieldMap]
>;

type PreventExtraKeys<
  Filter extends FilterInput<Filter>,
  FieldMap extends { [K in StandardKeys<Filter>]?: FieldConfig | true }
> = FieldMap & { [Key in keyof FieldMap as Key extends keyof Filter ? never : Key]: never };

type GQLFilterOptions<
  Filter extends FilterInput<Filter>,
  FieldMap extends { [K in StandardKeys<Filter>]?: FieldConfig | true }
> = {
  /** current filter to be kept up to date with */
  savedFilter: Filter;
  /**
   * Description of fields in form
   *
   * NOTE: this needs to be a stable value (either created outside component, or memo'd)
   * Consider using `makeFieldConfig` to help make this
   */
  fields: FieldMap;
};

/**
 * Utility function to create a field config based on an existing filterinput type
 * ```ts
 * const config = makeFieldConfig<ExistingFilterInput>()({ foo: true, bar: { multi: true } });
 * ```
 */
export const makeFieldConfig =
  <Filter extends FilterInput<Filter>>() =>
  <FieldMap extends { [K in StandardKeys<Filter>]?: FieldConfig | true }>(map: PreventExtraKeys<Filter, FieldMap>) =>
    map;

// the final filter will look like `{ hxScore: { ge, le }, and: [{ or: [{ office: { eq: 'foo' } }, { office: { eq: 'bar' } }] }, { or: [{ { eq: country: 'foo' } }, { { eq: country: 'bar' } }] }] }`
// this gives us a useful format to work with for the and array `{ office: { index: 0, selected: ['foo', 'bar'] }, country: { index: 1, selected: ['foo', 'bar'] } }`
type FriendlyAnd<
  Filter extends FilterInput<Filter>,
  FieldMap extends { [K in StandardKeys<Filter>]?: FieldConfig | true }
> = Id<{
  [Key in keyof FieldMap as FieldMap[Key] extends { multi: true } ? Key : never]?: Key extends keyof Filter
    ? Filter[Key] extends { eq?: any } | null | undefined
      ? {
          index: number;
          selected: InputType<Filter[Key]>[];
        }
      : never
    : never;
}>;

type ToggleFieldAction<
  Filter extends FilterInput<Filter>,
  FieldMap extends { [K in StandardKeys<Filter>]?: FieldConfig | true }
> = Id<
  {
    [Key in keyof FieldMap]: Key extends keyof Filter
      ? FieldMap[Key] extends { multi: true }
        ? Filter[Key] extends Nullish<{ eq?: any }>
          ? { key: Key; value: InputType<Filter[Key]> }
          : never
        : never
      : never;
  }[keyof FieldMap]
>;

// create a union of all of the allowed { key, value } pairings
type SetFieldAction<
  Filter extends FilterInput<Filter>,
  FieldMap extends { [K in StandardKeys<Filter>]?: FieldConfig | true }
> = Id<
  {
    [Key in keyof FieldMap]: Key extends keyof Filter
      ? // if we're working with a multi field, receive just an array of raw values instead of the input type
        FieldMap[Key] extends { multi: true }
        ? Filter[Key] extends Nullish<{ eq?: any }>
          ? { key: Key; value: Array<InputType<Filter[Key]>> }
          : never
        : { key: Key; value: NonNullable<Filter[Key]> }
      : never;
  }[keyof FieldMap]
>;

const useGQLFilter = <
  Filter extends FilterInput<Filter>,
  FieldMap extends { [K in StandardKeys<Filter>]?: FieldConfig | true }
>({
  savedFilter,
  fields,
}: GQLFilterOptions<Filter, FieldMap>) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getFriendlyAnd = useCallback(
    draftSafeMemoize((filter: Filter) => {
      const options = {} as FriendlyAnd<Filter, FieldMap>;
      filter.and?.forEach((andFilter, index) =>
        andFilter?.or?.forEach(
          (orFilter) =>
            orFilter &&
            Object.entries(orFilter).forEach(([key, value]) => {
              if (value && 'eq' in value && typeof (value as Record<'eq', unknown>).eq === 'string') {
                // @ts-expect-error uhhh fun
                (options[key] ??= { index, selected: [] }).selected.push(value.eq);
              }
            })
        )
      );
      return options;
    }),
    []
  );
  const slice = useMemo(
    () =>
      createSlice({
        name: 'filter',
        // we're providing the actual initial state in useReducer, so this is fine
        initialState: {} as Filter,
        reducers: {
          replaceFilter: (state, { payload }: PayloadAction<Filter>) => payload,
          setField: (state, { payload: { key, value } }: PayloadAction<SetFieldAction<Filter, FieldMap>>) => {
            const config = fields[key as keyof FieldMap];
            if (typeof config === 'object' && config.multi) {
              if (!Array.isArray(value)) {
                throw new Error('value must be an array if field is multi');
              }
              const index = getFriendlyAnd(state as Filter)[key as unknown as keyof typeof friendlyAnd]?.index;
              (state.and ??= []).splice(index ?? state.and.length, 1, {
                or: value.map((val) => ({ [key]: { eq: val } })),
              } as unknown as Draft<Filter>);
            } else {
              // @ts-expect-error this is gross
              state[key] = value;
            }
          },
          toggleField: (state, { payload: { key, value } }: PayloadAction<SetFieldAction<Filter, FieldMap>>) => {
            const config = fields[key as keyof FieldMap];
            if (typeof config === 'object' && config.multi) {
              throw new Error('use multiItemToggled instead');
            } else {
              if (shallowEqual(state[key as keyof Draft<Filter>], value)) {
                slice.caseReducers.resetField(state, slice.actions.resetField(key));
              } else {
                slice.caseReducers.setField(state, slice.actions.setField({ key, value }));
              }
            }
          },
          multiItemToggled: (
            state,
            { payload: { key, value } }: PayloadAction<ToggleFieldAction<Filter, FieldMap>>
          ) => {
            const friendlyAnd = getFriendlyAnd(state as Filter);
            const itemIndex = friendlyAnd[key as unknown as keyof typeof friendlyAnd]?.index;
            if (typeof itemIndex === 'number') {
              const index = friendlyAnd[key as unknown as keyof typeof friendlyAnd]?.selected?.findIndex(
                (val) => val === value
              );
              if (typeof index !== 'number' || index < 0) {
                state.and?.[itemIndex]?.or?.push({ [key]: { eq: value } } as unknown as Draft<Filter>);
              } else {
                slice.caseReducers.multiItemDeleted(
                  state,
                  slice.actions.multiItemDeleted({ key: key as unknown as MultiKeys<FieldMap>, index })
                );
              }
            } else {
              slice.caseReducers.setField(state, slice.actions.setField({ key, value: [value] }));
            }
          },
          multiItemDeleted: (
            state,
            { payload: { key, index } }: PayloadAction<{ key: MultiKeys<FieldMap>; index: number }>
          ) => {
            const itemIndex = getFriendlyAnd(state as Filter)[key as unknown as keyof typeof friendlyAnd]?.index;
            if (typeof itemIndex === 'number') {
              state.and?.[itemIndex]?.or?.splice(index, 1);
              if (state.and?.[itemIndex]?.or?.length === 0) {
                state.and?.splice(itemIndex, 1);
                if (state.and?.length === 0) {
                  delete state.and;
                }
              }
            }
          },
          resetField: (state, { payload }: PayloadAction<keyof FieldMap>) => {
            const config = fields[payload];
            if (typeof config === 'object' && config.multi) {
              const index = getFriendlyAnd(state as Filter)[payload as keyof typeof friendlyAnd]?.index;
              if (typeof index === 'number') {
                state.and?.splice(index, 1);
                if (state.and?.length === 0) {
                  delete state.and;
                }
              }
            } else {
              delete state[payload as keyof Draft<Filter>];
            }
          },
        },
      }),
    [fields, getFriendlyAnd]
  );

  const extraMethods = useMemo(
    () => ({
      hasField: (state: Filter, field: keyof FieldMap) => {
        const config = fields[field];
        if (typeof config === 'object' && config.multi) {
          const index = getFriendlyAnd(state)[field as keyof typeof friendlyAnd]?.index;

          if (typeof index === 'number') {
            return true;
          }

          return false;
        } else {
          return !!state[field as keyof Filter];
        }
      },
      hasFieldValue: <Key extends keyof FieldMap>(
        state: Filter,
        field: Key,
        value: Key extends keyof Filter
          ? Filter[Key] extends Nullish<{ eq?: any }>
            ? InputType<Filter[Key]>
            : never
          : never
      ) => {
        const config = fields[field];
        if (typeof config === 'object' && config.multi) {
          const selected = getFriendlyAnd(state)[field as unknown as keyof typeof friendlyAnd]?.selected;
          if (selected?.includes(value)) {
            return true;
          }

          return false;
        } else {
          // TODO: double check this when we implement with a non-multi value
          return (state[field as keyof Filter] as { eq?: any } | undefined)?.eq === value;
        }
      },
    }),
    [fields, getFriendlyAnd]
  );

  const [filter, _dispatch] = useReducer(slice.reducer, savedFilter);
  // mimic redux dispatch behaviour
  const dispatch = useCallback(
    <Action extends AnyAction>(action: Action): Action => (_dispatch(action), action),
    [_dispatch]
  );
  const methods = useMemo(
    () => ({ ...bindActionCreators(slice.actions, dispatch), ...extraMethods }),
    [dispatch, slice, extraMethods]
  );
  useEffect(() => {
    methods.replaceFilter(savedFilter);
  }, [savedFilter, methods]);
  const friendlyAnd = getFriendlyAnd(filter);
  if (process.env.NODE_ENV === 'development') {
    // this env var should never change within the context of a build/session, so the order should be fine
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useDebugValue({ filter, friendlyAnd });
  }
  return [filter, methods, friendlyAnd] as const;
};

export default useGQLFilter;
