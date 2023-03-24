// 🍾🍾🍾
export enum ApiMethods {
  ADD = 'ADD',
  DELETE = 'DELETE',
}

export enum DeleteType {
  partner = 'partner',
  organisation = 'organisation',
}

export const DYNAMO_DELETE_QUEUE = 'dynamoDeleteQueue';
export const REPORT_PARSE_QUEUE = 'reportParse';
export const REPORT_PUBLISH_QUEUE = 'reportPublish';
export const DU_DDB_QUEUE = 'DUQueue';
