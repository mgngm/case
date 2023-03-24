import type {
  DU,
  PROJECT,
  PROJECT_DUS,
  REPORT,
  S3,
  COGNITO_GROUP,
  COGNITO_USER,
  ORGANISATION,
  PARTNER,
  PARSE,
} from 'src/constants/datastore';

export type DynamoDeleteLambdaIdMap = {
  [PROJECT_DUS]: Set<string>;
  [DU]: Set<string>;
  [PROJECT]: Set<string>;
  [REPORT]: Set<string>;
  [ORGANISATION]: Set<string>;
  [PARTNER]: Set<string>;
  [PARSE]: Set<string>;
  [S3]: Set<string>;
  [COGNITO_GROUP]: Set<string>;
  [COGNITO_USER]: Set<string>;
};

export type DeleteLambdaItem = {
  id: string;
  type: string;
  table?: string; //legacy message type.
};

export type reportIDMap = {
  [DU]: Set<string>;
  [PROJECT]: Set<string>;
  [PROJECT_DUS]: Set<string>;
  [PARSE]: Set<string>;
};

export type OrgIdMap = reportIDMap & {
  [REPORT]: Set<string>;
  [S3]: Set<string>;
  [COGNITO_GROUP]: Set<string>;
  [COGNITO_USER]: Set<string>;
};
