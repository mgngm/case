import { z } from 'zod';
import { DU_TABLE } from 'src/constants/datastore';
import { queryDynamoTable } from 'src/logic/server/dynamo';
import type { Tokens } from 'src/types/auth';

export const getCountriesForReport = async (reportId: string, tokens: Tokens) => {
  const queryResponse = await queryDynamoTable(DU_TABLE, 'byReport', 'reportId', reportId, tokens, {
    ReturnConsumedCapacity: 'TOTAL',
    ExpressionAttributeNames: { '#ap0': 'country' },
    Select: 'SPECIFIC_ATTRIBUTES',
    ProjectionExpression: '#ap0',
  });

  if (!queryResponse || queryResponse.Items?.length === 0) {
    throw new Error(`Could not find countries by ID ${reportId}`);
  }

  return z
    .object({ country: z.string() })
    .array()
    .transform((arr) => Array.from(new Set(arr.map(({ country }) => country))))
    .parse(queryResponse.Items);
};
