// depending on internal types is not ideal but it means we don't have to reinvent types
import type { NoInfer } from '@aws-amplify/ui';
import type { BaseQueryMeta } from '@reduxjs/toolkit/dist/query/baseQueryTypes';
import type { BaseEndpointDefinition } from '@reduxjs/toolkit/dist/query/endpointDefinitions';
import type { BaseQueryFn, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import type { GraphQLConfig } from 'src/logic/client/graphql';
import { graphQL, isGraphQLResult } from 'src/logic/client/graphql';
import type { ErrorPolicy, WithErrorPolicy } from 'src/logic/client/graphql/error';
import { defaultErrorPolicy, GraphQLErrorPolicyError } from 'src/logic/client/graphql/error';
import type { GraphQLOptions, ReturnFromQuery, VariablesFromQuery } from 'src/logic/client/graphql/types';
import { serializeError } from 'src/logic/libs/json';
import type { IfHasRequiredKeys, MaybePromise } from 'src/types/util';

type GraphQLBaseQueryExtraOptions<PaginateKey extends keyof any = string, Policy extends ErrorPolicy = ErrorPolicy> = {
  additionalHeaders?: Parameters<typeof graphQL>[1];
} & GraphQLConfig<PaginateKey, Policy>;

export const graphQLBaseQuery: BaseQueryFn<
  GraphQLOptions,
  WithErrorPolicy<unknown>,
  FetchBaseQueryError,
  GraphQLBaseQueryExtraOptions
> = async (options, _api, extraOptions) => {
  const { additionalHeaders, ...config } = extraOptions ?? {};
  try {
    return {
      data: await graphQL<string, Record<string, string>, object, ErrorPolicy>(options, additionalHeaders, config),
    };
  } catch (error) {
    let err = error;
    if (isGraphQLResult<null>(err)) {
      err = new GraphQLErrorPolicyError(config?.errorPolicy ?? defaultErrorPolicy, err.data, err.errors); // wrap for nice message formatting
    }
    console.error(err);
    return { error: { status: 500, data: err instanceof Error ? serializeError(err) : err } };
  }
};

/**
 * Typescript helper for graphQL RTK endpoints - ensures that variables are correct for their query, helpfully gives a type to transformResponse's baseQueryReturnValue and infers error policy correctly.
 * @param definition Partial RTK endpoint definition
 * @returns partial definition to spread into final endpoint
 * ```ts
 * getThings: build.query({
 *   ...graphQLHelper({
 *     query: (arg: Arg) => ({ query: getThings, variables: { input: arg }}) // automatically checks if final variables are correct
 *     transformResponse: ({ data, errors }): WithErrorPolicy<Thing[], 'none'> => ({ data: data.getThings?.items ?? [], errors }), // parameter knows its type
 *     extraOptions: { errorPolicy: 'none' } // reflects in transformResponse's param
 *   })
 * })
 * ```
 */
// open to better names
export const graphQLHelper = <
  ResultType,
  QueryArg,
  QueryString extends string,
  Variables extends VariablesFromQuery<QueryString> = VariablesFromQuery<QueryString>,
  QueryReturn extends ReturnFromQuery<QueryString> = ReturnFromQuery<QueryString>,
  Policy extends ErrorPolicy = typeof defaultErrorPolicy
>(
  definition: {
    query: (arg: QueryArg) => GraphQLOptions<NoInfer<Variables>, QueryString>;
    transformResponse?: (
      baseQueryReturnValue: WithErrorPolicy<QueryReturn, Policy>,
      meta: BaseQueryMeta<typeof graphQLBaseQuery>,
      arg: QueryArg
    ) => MaybePromise<ResultType>;
  } & IfHasRequiredKeys<
    GraphQLBaseQueryExtraOptions<NoInfer<keyof QueryReturn>, Policy>,
    { extraOptions: GraphQLBaseQueryExtraOptions<NoInfer<keyof QueryReturn>, Policy> },
    { extraOptions?: GraphQLBaseQueryExtraOptions<NoInfer<keyof QueryReturn>, Policy> }
  >
) =>
  definition as Pick<
    Exclude<BaseEndpointDefinition<QueryArg, typeof graphQLBaseQuery, ResultType>, { query?: never }>,
    'query' | 'transformResponse' | 'extraOptions'
  >;
