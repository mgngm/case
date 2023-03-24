import type { GraphQLResult } from '@aws-amplify/api';
import type { GraphQLError } from 'graphql';
import { printError } from 'graphql';
import { satisfies } from 'src/logic/libs/helpers';
import type { Overwrite, PickRequired } from 'src/types/util';

export type ErrorPolicy = 'none' | 'ignore' | 'all';

export const defaultErrorPolicy = satisfies<ErrorPolicy>()('all');

export type WithErrorPolicy<
  T,
  Policy extends ErrorPolicy = typeof defaultErrorPolicy
> = Policy extends typeof defaultErrorPolicy
  ? PickRequired<GraphQLResult<T>, 'data'>
  : Overwrite<PickRequired<GraphQLResult<T>, 'data'>, { errors?: undefined }>;

export class GraphQLErrorPolicyError<T = any> extends Error {
  constructor(public policy: ErrorPolicy, public data?: T, public errors?: GraphQLError[]) {
    let message = `Error policy '${policy}' failed: `;
    if (!data) {
      message += '\n- No data provided';
    }
    if (errors?.length) {
      message += '\nErrors: \n- ';
      message += errors.map((err) => printError(err)).join('\n- ');
    } else {
      message += 'No errors found';
    }
    super(message);
    this.name = 'GraphQLErrorPolicyError';
  }
  toString() {
    return this.message;
  }
}

type SafeParseSuccess<T, Policy extends ErrorPolicy = typeof defaultErrorPolicy> = {
  success: true;
  data: WithErrorPolicy<T, Policy>;
};
type SafeParseError<T> = { success: false; error: GraphQLErrorPolicyError<T> };

type SafeParseReturnType<T, Policy extends ErrorPolicy = typeof defaultErrorPolicy> =
  | SafeParseSuccess<T, Policy>
  | SafeParseError<T>;

export const safeParseWithErrorPolicy = <T, Policy extends ErrorPolicy = typeof defaultErrorPolicy>(
  result: GraphQLResult<T>,
  errorPolicy: Policy = defaultErrorPolicy as Policy
): SafeParseReturnType<T, Policy> => {
  const successfullyReceivedData = !!result.data;
  const successfullyPassedErrorPolicy = !result.errors || errorPolicy === 'all' || errorPolicy === 'ignore';
  if (successfullyPassedErrorPolicy && successfullyReceivedData) {
    const data = (errorPolicy === 'ignore' ? { ...result, errors: undefined } : result) as WithErrorPolicy<T, Policy>;
    return { success: true, data };
  } else {
    return { success: false, error: new GraphQLErrorPolicyError(errorPolicy, result.data, result.errors) };
  }
};

export const parseWithErrorPolicy = <T, Policy extends ErrorPolicy = typeof defaultErrorPolicy>(
  result: GraphQLResult<T>,
  errorPolicy: Policy = defaultErrorPolicy as Policy
) => {
  const parseResult = safeParseWithErrorPolicy(result, errorPolicy);
  if (parseResult.success) return parseResult.data;
  throw parseResult.error;
};
