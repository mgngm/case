import type { AttributeValue, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  ScanCommand,
  QueryCommand,
  BatchWriteCommand,
  BatchGetCommand,
  UpdateCommand,
  TransactWriteCommand,
} from '@aws-sdk/lib-dynamodb';
import type {
  ScanCommandInput,
  ScanCommandOutput,
  QueryCommandOutput,
  QueryCommandInput,
  BatchWriteCommandOutput,
  BatchGetCommandInput,
  UpdateCommandInput,
  TransactWriteCommandOutput,
  TransactWriteCommandInput,
} from '@aws-sdk/lib-dynamodb';
import { v4 } from 'uuid';
import type { TableData } from 'lambda/shared/types';
import aws from 'src/aws-exports';
import type { Tokens } from 'src/types/auth';

/**
 * Create a new dynamo db client with the project region
 * and tokens if supplied
 *
 * tokens are not required for calls from a lambda, but
 * are included for local testing purposes
 *
 * @param tokens optional aws credentials
 * @returns DynamoDBClient
 */
export const getDynamoClient = (tokens?: Tokens) => {
  const opts: DynamoDBClientConfig = {
    region: aws.aws_project_region,
  };

  if (tokens) {
    opts.credentials = tokens;
  }

  return new DynamoDBClient(opts);
};

export const defaultScanOptions = {
  ExpressionAttributeNames: { '#key': '_deleted' },
  ExpressionAttributeValues: { ':value': true },
  FilterExpression: '#key <> :value',
  ReturnConsumedCapacity: 'TOTAL',
};

/**
 * Use a scan command to get all items from a table
 *
 * @param table {string} - table name
 * @param scanOptions {ScanCommandInput} - scan options without table name
 * @param credentials {Tokens}
 * @returns Promise<ScanCommandOutput>
 */
export const scanDynamoTable = async (
  table: string,
  scanOptions: Omit<ScanCommandInput, 'TableName'> = defaultScanOptions,
  tokens?: Tokens,
  ddClient?: DynamoDBDocumentClient
): Promise<ScanCommandOutput> => {
  try {
    // create a document client so we can use unmarshalled data
    const dynamoDocClient = ddClient ?? DynamoDBDocumentClient.from(getDynamoClient(tokens));

    const scanParams: ScanCommandInput = {
      TableName: table,
      ...scanOptions,
    };

    const res = await dynamoDocClient.send(new ScanCommand(scanParams));

    if (res.LastEvaluatedKey && res.Items) {
      let key: Record<string, unknown> | undefined = res.LastEvaluatedKey;

      while (key) {
        scanParams.ExclusiveStartKey = key;
        const pagination = await dynamoDocClient.send(new ScanCommand(scanParams));

        if (pagination.Items) {
          res.Items = [...res.Items, ...pagination.Items];
        }

        key = pagination.LastEvaluatedKey;
      }
    }

    return res;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

/**
 * Query a dynamo table by index
 *
 * @param table {string} - table name
 * @param index {string} - index to search on
 * @param query {string} - search value
 * @param credentials {Tokens} - auth tokens
 * @returns Promise<QueryCommandOutput>
 */
export const queryDynamoTable = async (
  table: string,
  index: string | null,
  field: string,
  query: string,
  queryExtras: { names: Record<string, string>; values: Record<string, string>; conditions?: string } = {
    names: {},
    values: {},
  },
  tokens?: Tokens,
  ddClient?: DynamoDBDocumentClient
): Promise<QueryCommandOutput> => {
  try {
    // create a document client so we can use unmarshalled data
    const dynamoDocClient = ddClient ?? DynamoDBDocumentClient.from(getDynamoClient(tokens));

    const queryParams: QueryCommandInput = {
      TableName: table,
      ExpressionAttributeNames: { '#key': field, ...queryExtras.names },
      ExpressionAttributeValues: { ':value': query, ...queryExtras.values },
      KeyConditionExpression: '#key = :value',
      Limit: 50,
    };

    if (queryExtras.conditions) {
      queryParams.FilterExpression = queryExtras.conditions;
    }

    if (index) {
      queryParams.IndexName = index;
    }

    const res = await dynamoDocClient.send(new QueryCommand(queryParams));

    if (res.LastEvaluatedKey && res.Items) {
      let key: Record<string, unknown> | undefined = res.LastEvaluatedKey;

      while (key) {
        queryParams.ExclusiveStartKey = key;
        const pagination = await dynamoDocClient.send(new QueryCommand(queryParams));

        if (pagination.Items) {
          res.Items = [...res.Items, ...pagination.Items];
        }

        key = pagination.LastEvaluatedKey;

        await wait(100);
      }
    }

    return res;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const queryDynamoTableBatch = async (
  table: string,
  index: string,
  field: string,
  ids: string[],
  ddClient?: DynamoDBDocumentClient,
  tokens?: Tokens
) => {
  const dynamoDocClient = ddClient ?? DynamoDBDocumentClient.from(getDynamoClient(tokens));

  try {
    let items: Record<string, AttributeValue>[] = [];

    while (ids.length) {
      const primaryKeys = ids.splice(0, 100);

      const queryParams: BatchGetCommandInput = {
        RequestItems: {
          [table]: { Keys: primaryKeys.map((id) => ({ id })) },
        },
      };

      const resp = await dynamoDocClient.send(new BatchGetCommand(queryParams));
      items = [...items, ...(resp.Responses?.[table] ?? [])];
    }

    return items as unknown[];
  } catch (err) {
    console.error(err);
    throw err;
  }
};

/**
 * uploadToDynamoTable
 *
 * Takes a list of data rows and inserts them into a dynamoDB table in bulk
 *
 * @param data TableData - data items to store in the table (essentially a row)
 * @param table string - name of the table
 * @param credentials Tokens - authentications tokens
 * @returns Promise<BatchWriteCommandOutput> - output from the put request to dynamo
 */
export const uploadToDynamoTable = async <Data extends TableData>(
  data: Data[],
  table: string,
  tokens?: Tokens
): Promise<BatchWriteCommandOutput> => {
  try {
    // create a document client so we can use unmarshalled data
    const dynamoDocClient = DynamoDBDocumentClient.from(getDynamoClient(tokens));

    // build prerequisites for primary key
    const conditionRule = {
      ConditionExpression: '#pk <> :pkValue',
      ExpressionAttributeNames: { '#pk': 'id' },
    };

    // construct the put request
    const dynamoParams = {
      RequestItems: {
        // map each row into a put request to the table, combining it with the prerequisites that match the id
        [table]: data.map((Item) => ({
          PutRequest: { Item, ...conditionRule, ExpressionAttributeValues: { ':pkVaue': { S: Item.id } } },
        })),
      },
    };

    // send to dynamo
    return await dynamoDocClient.send(new BatchWriteCommand(dynamoParams));
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * uploadToDynamoTable
 *
 * Takes a list of data rows and inserts them into a dynamoDB table in bulk
 *
 * @param data TableData - data items to store in the table (essentially a row)
 * @param table string - name of the table
 * @param credentials Tokens - authentications tokens
 * @returns Promise<BatchWriteCommandOutput> - output from the put request to dynamo
 */
export const uploadAllToDynamoTable = async <Data extends TableData>(
  data: Data[],
  table: string,
  waitMs = 0,
  tokens?: Tokens
): Promise<BatchWriteCommandOutput[]> => {
  try {
    // create a document client so we can use unmarshalled data
    const dynamoDocClient = DynamoDBDocumentClient.from(getDynamoClient(tokens));

    // build prerequisites for primary key
    const conditionRule = {
      ConditionExpression: '#pk <> :pkValue',
      ExpressionAttributeNames: { '#pk': 'id' },
    };

    // send to dynamo
    const res = [];

    while (data.length) {
      const items = data.splice(0, 25);
      // construct the put request
      const dynamoParams = {
        RequestItems: {
          // map each row into a put request to the table, combining it with the prerequisites that match the id
          [table]: items.map((Item) => ({
            PutRequest: { Item, ...conditionRule, ExpressionAttributeValues: { ':pkVaue': { S: Item.id } } },
          })),
        },
      };

      console.log(`Writing ${items.length} items to ${table}`);
      res.push(await dynamoDocClient.send(new BatchWriteCommand(dynamoParams)));

      await wait(waitMs);
    }

    return res;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const removeAttributeFromRecord = async (
  table: string,
  attribute: string,
  recordKey: string,
  tokens?: Tokens
) => {
  const command: UpdateCommandInput = {
    TableName: table,
    Key: { id: recordKey },
    ExpressionAttributeNames: { '#rmAttr0': attribute },
    UpdateExpression: 'REMOVE #rmAttr0',
    ReturnValues: 'UPDATED_NEW',
  };

  const dynamoDocClient = DynamoDBDocumentClient.from(getDynamoClient(tokens));

  return await dynamoDocClient.send(new UpdateCommand(command));
};

type UpdateTableProps = {
  table: string;
  expressionAttributeNames: Record<string, string>;
  expressionAttributeValues: Record<string, unknown>;
  updateExpression: string;
  id: string;
  tokens?: Tokens;
};

/**
 * Updates a single table record, with provided expressions
 *
 * @param table {string} - table to update
 * @param expressionAttributeNames {Record<string, string>} - Name substitutes for expression
 * @param expressionAttributeValues {Record<string, unknown>} - Value substitutions for expression
 * @param updateExpression {string} - Query to be run on the table - https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.UpdateExpressions.html
 * @param id {string} -  ID of the record to update
 * @param credentials {Tokens} - Token object for ddb client
 * @returns
 */
export const updateTableRecord = async ({
  table,
  expressionAttributeNames,
  expressionAttributeValues,
  updateExpression,
  id,
  tokens,
}: UpdateTableProps) => {
  const command: UpdateCommandInput = {
    TableName: table,
    Key: { id },
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    UpdateExpression: updateExpression,
    ReturnValues: 'UPDATED_NEW',
  };

  const dynamoDocClient = DynamoDBDocumentClient.from(getDynamoClient(tokens));

  return await dynamoDocClient.send(new UpdateCommand(command));
};

/**
 * small function to generate record meta data for dynamo
 */
export const getMeta = (date: Date, type: string) => ({
  createdAt: date.toISOString(),
  updatedAt: date.toISOString(),
  _lastChangedAt: date.getTime(),
  __typename: type,
  _deleted: false,
  _version: 1,
});

/**
 * Adds or updates a database record using the transact
 * API 100 items at a time
 *
 * @param data TableData[]
 * @param table name of table
 * @param keyUpdate main field to set or update
 * @param tokens optional credentials
 * @returns Promise<TransactWriteCommandOutput[]>
 */
export const upsertToTable = async <Data extends TableData>(
  data: Data[],
  table: string,
  keyUpdate: string,
  tokens?: Tokens
): Promise<TransactWriteCommandOutput[]> => {
  try {
    // create a document client so we can use unmarshalled data
    const dynamoDocClient = DynamoDBDocumentClient.from(getDynamoClient(tokens));

    // prepare response array for return
    const resp: TransactWriteCommandOutput[] = [];

    // batch by 100 items
    while (data.length > 0) {
      const upload = data.splice(0, 100);

      const params: TransactWriteCommandInput = {
        ClientRequestToken: v4(),
        ReturnItemCollectionMetrics: 'SIZE',

        // build the upsert command
        TransactItems: upload.map((item) => {
          let UpdateExpression = `SET #${keyUpdate} = :${keyUpdate}`;
          const ExpressionAttributeNames: Record<string, string> = {};
          const ExpressionAttributeValues: Record<string, string> = {};

          Object.keys(item).forEach((k) => {
            // can't update id, it's the primary key
            if (k !== 'id') {
              ExpressionAttributeNames[`#${k}` as keyof typeof ExpressionAttributeNames] = k;
              ExpressionAttributeValues[`:${k}`] = item[k as keyof typeof item] as unknown as string;

              // add to update expression if not the key update, which is already there
              if (k !== keyUpdate) {
                UpdateExpression += `, #${k} = :${k}`;
              }
            }
          });

          return {
            Update: {
              TableName: table,
              Key: {
                id: item.id,
              },
              UpdateExpression,
              ExpressionAttributeNames,
              ExpressionAttributeValues,
            },
          };
        }),
      };

      resp.push(await dynamoDocClient.send(new TransactWriteCommand(params)));
    }

    return resp;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

/**
 * Removes an attribute from a database record using the transact
 * API 100 items at a time
 *
 * @param data string[] - list of ids to remove attribute from
 * @param table name of table
 * @param keyUpdate main field to set or update
 * @param tokens optional credentials
 * @returns Promise<TransactWriteCommandOutput[]>
 */
export const removeAttributeFromBatchRecords = async (
  data: string[],
  table: string,
  keyUpdate: string,
  tokens?: Tokens,
  waitMs = 0
): Promise<TransactWriteCommandOutput[]> => {
  try {
    // create a document client so we can use unmarshalled data
    const dynamoDocClient = DynamoDBDocumentClient.from(getDynamoClient(tokens));

    // prepare response array for return
    const resp: TransactWriteCommandOutput[] = [];

    while (data.length > 0) {
      const upload = data.splice(0, 100);

      const params: TransactWriteCommandInput = {
        ClientRequestToken: v4(),
        ReturnItemCollectionMetrics: 'SIZE',

        // build the upsert command
        TransactItems: upload.map((item) => {
          const UpdateExpression = `REMOVE #${keyUpdate}`;
          const ExpressionAttributeNames: Record<string, string> = {};

          // can't remove id, it's the primary key
          if (keyUpdate !== 'id') {
            ExpressionAttributeNames[`#${keyUpdate}` as keyof typeof ExpressionAttributeNames] = keyUpdate;
          }

          return {
            Update: {
              TableName: table,
              Key: {
                id: item,
              },
              UpdateExpression,
              ExpressionAttributeNames,
            },
          };
        }),
      };

      await wait(waitMs);

      resp.push(await dynamoDocClient.send(new TransactWriteCommand(params)));
    }

    return resp;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
/**
 * deleteFromTable
 *
 * given a list of IDs, delete them from the given table
 * in batches of 100
 *
 * @param idsForDelete string[]
 * @param table string
 * @param tokens optional aws credentials
 * @returns Promise<TransactWriteCommandOutput[]>
 */
export const deleteFromTable = async (
  idsForDelete: string[],
  table: string,
  tokens?: Tokens,
  client?: DynamoDBDocumentClient,
  waitMs = 0
): Promise<TransactWriteCommandOutput[]> => {
  try {
    // create a document client so we can use unmarshalled data
    const dynamoDocClient = client ?? DynamoDBDocumentClient.from(getDynamoClient(tokens));

    // prepare response array for return
    const resp: TransactWriteCommandOutput[] = [];

    // batch by 100 items
    while (idsForDelete.length > 0) {
      const ids = idsForDelete.splice(0, 100);

      const params = {
        ClientRequestToken: v4(),
        ReturnItemCollectionMetrics: 'SIZE',

        // build the delete command
        TransactItems: ids.map((id) => ({
          Delete: {
            TableName: table,
            Key: {
              id: id,
            },
          },
        })),
      };

      await wait(waitMs);
      // send transation
      resp.push(await dynamoDocClient.send(new TransactWriteCommand(params)));
    }

    return resp;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
