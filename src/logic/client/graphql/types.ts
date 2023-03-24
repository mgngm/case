// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import type { GraphQLAPI, OperationTypeNode } from '@aws-amplify/api-graphql';
import type { DuWithProjectsByReportQuery, DuWithProjectsByReportQueryVariables } from 'src/graphql';
import type { duWithProjectsByReport } from 'src/graphql/custom-queries';
import type {
  GraphQLMap as GraphQLMapAuto,
  GraphQLSubscriptionMap as GraphQLSubscriptionMapAuto,
} from 'src/logic/client/graphql/autogen';
import type { IfHasRequiredKeys } from 'src/types/util';

/** Customised options object to allow for more type safe behaviour */
export type GraphQLOptions<Variables extends object = object, QueryString extends string = string> = Omit<
  Parameters<typeof GraphQLAPI.graphql>[0],
  'variables'
> & { query: QueryString } & IfHasRequiredKeys<
    Variables, // make variables required if it has any required keys
    { variables: Variables },
    { variables?: Variables }
  >;

export type GraphQLEntry<Return = unknown, Variables extends object = object> = {
  return: Return;
  variables: Variables;
};

// add custom queries/mutations here
// eslint-disable-next-line @typescript-eslint/ban-types
type GraphQLMapCustom = {
  [duWithProjectsByReport]: GraphQLEntry<DuWithProjectsByReportQuery, DuWithProjectsByReportQueryVariables>;
};

export type GraphQLMap = GraphQLMapAuto & GraphQLMapCustom;

export type VariablesFromQuery<QueryString extends string, IfNotFound = object> = QueryString extends keyof GraphQLMap
  ? GraphQLMap[QueryString]['variables']
  : IfNotFound;

export type ReturnFromQuery<QueryString extends string, IfNotFound = unknown> = QueryString extends keyof GraphQLMap
  ? GraphQLMap[QueryString]['return']
  : IfNotFound;

// add custom subscriptions here
// eslint-disable-next-line @typescript-eslint/ban-types
type GraphQLSubscriptionMapCustom = {};

export type GraphQLSubscriptionMap = GraphQLSubscriptionMapAuto & GraphQLSubscriptionMapCustom;

export type VariablesFromSubscription<
  QueryString extends string,
  IfNotFound = object
> = QueryString extends keyof GraphQLSubscriptionMap ? GraphQLSubscriptionMap[QueryString]['variables'] : IfNotFound;

export type ReturnFromSubscription<
  QueryString extends string,
  IfNotFound = unknown
> = QueryString extends keyof GraphQLSubscriptionMap ? GraphQLSubscriptionMap[QueryString]['return'] : IfNotFound;

export type VariablesFromQueryOrSubscription<
  QueryString extends string,
  IfNotFound = object
> = QueryString extends keyof GraphQLMap
  ? GraphQLMap[QueryString]['variables']
  : QueryString extends keyof GraphQLSubscriptionMap
  ? GraphQLSubscriptionMap[QueryString]['variables']
  : IfNotFound;

export type ReturnFromQueryOrSubscription<
  QueryString extends string,
  IfNotFound = object
> = QueryString extends keyof GraphQLMap
  ? GraphQLMap[QueryString]['return']
  : QueryString extends keyof GraphQLSubscriptionMap
  ? GraphQLSubscriptionMap[QueryString]['return']
  : IfNotFound;

export type AutoGraphQLOptions<
  QueryString extends string,
  Variables extends VariablesFromQueryOrSubscription<QueryString> = VariablesFromQueryOrSubscription<QueryString>
> = GraphQLOptions<Variables, QueryString>;

export type PaginatedQuery<Item = any> =
  | { [key in string]?: { items: Item[]; nextToken?: string | null } | undefined | null }
  | null;

export type ItemFromPaginatedQuery<Query extends PaginatedQuery> = Query extends PaginatedQuery<infer Item>
  ? Item
  : never;

export type ExtractQueryType<Query extends string> = Query extends `\n  ${infer Type} ${string}`
  ? Type extends OperationTypeNode
    ? Type
    : never
  : never;
