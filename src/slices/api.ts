import type { SerializedError } from '@reduxjs/toolkit';
import { isPlainObject } from '@reduxjs/toolkit';
import type {
  BaseQueryApi,
  BaseQueryArg,
  BaseQueryError,
  BaseQueryExtraOptions,
  BaseQueryResult,
} from '@reduxjs/toolkit/dist/query/baseQueryTypes';
import type { BaseQueryFn, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Auth } from 'aws-amplify';
import { pick, pickBy } from 'lodash';
import { memoizeWithArgs } from 'proxy-memoize';
import type { RootState } from 'src/store';
import {
  USERS_TAG,
  USER_CONTEXT_TAG,
  DU_LIST_TAG,
  ORGANISATIONS_TAG,
  PARSE_LIST_TAG,
  PARTNERS_TAG,
  PROJECT_TEMPLATES_TAG,
  REPORT_LIST_TAG,
  REPORT_PROJECTS_TAG,
  REPORT_TAG,
} from 'src/constants/slices';
import { graphQLBaseQuery } from 'src/slices/graphql';
import type { Tokens } from 'src/types/auth';

export type ApiError = {
  /** Internal message, to help debug */
  error: string;
  /** Message that's human readable - i.e. toastable */
  message?: string;
  /** Any other info */
  meta?: unknown;
};

/**
 * getAuthHeader
 *
 * get the authorization header value for the
 * currently logged in user
 *
 * @returns base64 encoded auth header value
 */
export const getAuthHeader = async (): Promise<string> => {
  let authCreds;
  let userToken;

  /* develblock:start */
  if (process.env.NEXT_PUBLIC_AMPLIFY_MOCK === '1') {
    // mock auth credentials
    authCreds = {
      accessKeyId: 'accessKeyId',
      secretAccessKey: 'secretAccessKey',
      sessionToken: 'sessionToken',
    };
    userToken = 'abcedefghijklmnopqrstuvwxyz123accessTokenJWT==';
  }
  /* develblock:end */

  if (!authCreds) {
    authCreds = await Auth.currentCredentials();

    try {
      if (!authCreds.authenticated) {
        throw new Error('Unauthenticated credentials');
      }

      userToken = (await Auth.currentAuthenticatedUser()).signInUserSession.accessToken.jwtToken;
    } catch (err) {
      // check we have a valid credentials object and are attempting a login
      if (
        (authCreds.expiration?.getTime() || Date.now() - 10) > Date.now() &&
        window &&
        window.location.pathname === '/login/'
      ) {
        userToken = 'LOGGING_IN';
      } else {
        throw new Error('Invalid auth header');
      }
    }
  }

  const creds: Tokens = {
    accessKeyId: authCreds.accessKeyId,
    secretAccessKey: authCreds.secretAccessKey,
    sessionToken: authCreds.sessionToken,
    userToken,
  };

  return window.btoa(JSON.stringify(creds));
};

const fetchBQ = fetchBaseQuery({
  baseUrl: '/api',
  prepareHeaders: async (headers) => {
    const authHeader = await getAuthHeader();
    // If we have a token set in state, let's assume that we should be passing it.
    headers.set('authorization', authHeader);

    return headers;
  },
});

const combineBaseQueries =
  <
    DefaultBQ extends BaseQueryFn<any, any, any, any, any>,
    CaseBQs extends {
      predicate: (arg: unknown, api: BaseQueryApi, extraOptions: unknown) => boolean;
      baseQuery: BaseQueryFn<any, any, any, any, any>;
    }[],
    AllBQs extends DefaultBQ | CaseBQs[number]['baseQuery'] = DefaultBQ | CaseBQs[number]['baseQuery']
  >(
    defaultBQ: DefaultBQ,
    ...caseBQs: CaseBQs
  ): BaseQueryFn<
    BaseQueryArg<AllBQs>,
    BaseQueryResult<AllBQs>,
    BaseQueryError<AllBQs>,
    BaseQueryExtraOptions<AllBQs>
  > =>
  (arg, api, extraOptions) => {
    for (const { predicate, baseQuery } of caseBQs) {
      if (predicate(arg, api, extraOptions)) {
        return baseQuery(arg, api, extraOptions);
      }
    }
    return defaultBQ(arg, api, extraOptions);
  };

const polymorphBaseQuery = combineBaseQueries(fetchBQ, {
  baseQuery: graphQLBaseQuery,
  predicate: (args) => isPlainObject(args) && 'query' in args,
});

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: polymorphBaseQuery,
  tagTypes: [
    USERS_TAG,
    USER_CONTEXT_TAG,
    PARTNERS_TAG,
    ORGANISATIONS_TAG,
    REPORT_LIST_TAG,
    PROJECT_TEMPLATES_TAG,
    REPORT_PROJECTS_TAG,
    PARSE_LIST_TAG,
    DU_LIST_TAG,
    REPORT_TAG,
  ],
  endpoints: () => ({}),
});

export const serialiseAmplifyError = (error: unknown) =>
  typeof error !== 'object' || error === null || isPlainObject(error)
    ? error
    : Object.keys(error).reduce<Record<string, unknown>>((acc, key) => {
        acc[key] = serialiseAmplifyError(error[key]);
        return acc;
      }, {});

export const hasErrorMessage = (errorData: unknown): errorData is { error: string } =>
  typeof errorData === 'object' && !!errorData && typeof (errorData as Record<string, string>).error === 'string';

export const getErrorMessageFromRTK = (error: FetchBaseQueryError | SerializedError) => {
  if ('status' in error) {
    // typescript now knows it's a FetchBaseQueryError
    return hasErrorMessage(error.data) ? error.data.error : 'Something went wrong';
  }
  return error.message;
};

export const selectAllCachedQueriesByEndpoint = memoizeWithArgs((state: RootState, endpointName: string) =>
  pickBy(state[baseApi.reducerPath].queries, (entry) => entry?.endpointName === endpointName)
);
