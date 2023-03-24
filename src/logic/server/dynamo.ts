import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  BatchWriteCommand,
  QueryCommand,
  ScanCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import type {
  BatchWriteCommandOutput,
  QueryCommandOutput,
  QueryCommandInput,
  ScanCommandInput,
  ScanCommandOutput,
  UpdateCommandInput,
} from '@aws-sdk/lib-dynamodb';
import aws from 'src/aws-exports';
import type { Tokens } from 'src/types/auth';
import type { TableData } from 'src/types/dynamo';

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
  credentials: Tokens
): Promise<BatchWriteCommandOutput> => {
  try {
    // build a dynamo client with the tokens
    const dynamoClient = new DynamoDBClient({
      region: aws.aws_user_files_s3_bucket_region,
      credentials,
    });

    // create a document client so we can use unmarshalled data
    const dynamoDocClient = DynamoDBDocumentClient.from(dynamoClient);

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
  credentials: Tokens,
  {
    ExpressionAttributeNames,
    ExpressionAttributeValues,
    ...queryExtras
  }: Partial<Omit<QueryCommandInput, 'TableName' | 'IndexName' | 'KeyConditionExpression'>> = {}
): Promise<QueryCommandOutput> => {
  try {
    // build a dynamo client with the tokens
    const dynamoClient = new DynamoDBClient({
      region: aws.aws_user_files_s3_bucket_region,
      credentials,
    });

    // create a document client so we can use unmarshalled data
    const dynamoDocClient = DynamoDBDocumentClient.from(dynamoClient);

    const queryParams: QueryCommandInput = {
      KeyConditionExpression: '#key = :value',
      ...queryExtras,
      ...(index && { IndexName: index }),
      TableName: table,
      ExpressionAttributeNames: { '#key': field, ...ExpressionAttributeNames },
      ExpressionAttributeValues: { ':value': query, ...ExpressionAttributeValues },
    };

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
      }
    }

    return res;
  } catch (err) {
    console.error(err);
    throw err;
  }
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
  credentials: Tokens
): Promise<ScanCommandOutput> => {
  try {
    // build a dynamo client with the tokens
    const dynamoClient = new DynamoDBClient({
      region: aws.aws_user_files_s3_bucket_region,
      credentials,
    });

    // create a document client so we can use unmarshalled data
    const dynamoDocClient = DynamoDBDocumentClient.from(dynamoClient);

    const scanParams: ScanCommandInput = {
      TableName: table,
      ...scanOptions,
    };

    return await dynamoDocClient.send(new ScanCommand(scanParams));
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const removeAttributeFromRecord = async (
  table: string,
  attribute: string,
  recordKey: string,
  credentials: Tokens
) => {
  // build a dynamo client with the tokens
  const dynamoClient = new DynamoDBClient({
    region: aws.aws_user_files_s3_bucket_region,
    credentials,
  });

  const command: UpdateCommandInput = {
    TableName: table,
    Key: { id: recordKey },
    ExpressionAttributeNames: { '#rmAttr0': attribute },
    UpdateExpression: 'REMOVE #rmAttr0',
    ReturnValues: 'UPDATED_NEW',
  };

  const dynamoDocClient = DynamoDBDocumentClient.from(dynamoClient);

  return await dynamoDocClient.send(new UpdateCommand(command));
};

type UpdateTableProps = {
  table: string;
  expressionAttributeNames: Record<string, string>;
  expressionAttributeValues: Record<string, unknown>;
  updateExpression: string;
  id: string;
  credentials: Tokens;
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
  credentials,
}: UpdateTableProps) => {
  // build a dynamo client with the tokens
  const dynamoClient = new DynamoDBClient({
    region: aws.aws_user_files_s3_bucket_region,
    credentials,
  });

  const command: UpdateCommandInput = {
    TableName: table,
    Key: { id },
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    UpdateExpression: updateExpression,
    ReturnValues: 'UPDATED_NEW',
  };

  const dynamoDocClient = DynamoDBDocumentClient.from(dynamoClient);

  return await dynamoDocClient.send(new UpdateCommand(command));
};

// small function to generate record meta data for dynamo
export const getMeta = (date: Date, type: string) => ({
  createdAt: date.toISOString(),
  updatedAt: date.toISOString(),
  _lastChangedAt: date.getTime(),
  __typename: type,
  _deleted: false,
  _version: 1,
});
