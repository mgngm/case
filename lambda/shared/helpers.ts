import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { defaultScanOptions, getDynamoClient, queryDynamoTable, scanDynamoTable } from 'lambda/shared/dynamo';
import { PARSE_TABLE } from 'src/constants/datastore';
import type { Parse } from 'src/graphql';

export const isNotDeleted = <T extends { _deleted?: boolean | null }>(obj: T | null): obj is NonNullable<T> =>
  !!(obj && !obj._deleted);

/* eslint-disable @typescript-eslint/no-explicit-any */
export const BLACKLISTED_ACCESSORS: (keyof any)[] = ['constructor', 'prototype'];

/**
 * Checks key isn't blacklisted.
 * @param key Key or index to access with.
 * @returns If key isn't blacklisted
 */
export const safeKey = (key: keyof any) => !BLACKLISTED_ACCESSORS.includes(key);

/**
 * Blacklists specific keys to prevent object injection.
 * @param obj Object or array to be fetched from
 * @param key Key or index to access with.
 * @returns Accessed value, or `undefined` if key is blacklisted.
 */
export const safeAccessor = <O extends Record<string, any>, K extends keyof O>(
  obj: O,
  key: keyof O
): O[K] | undefined => (BLACKLISTED_ACCESSORS.includes(key) || typeof obj !== 'object' ? undefined : obj?.[key]);

/**
 * Blacklists specific keys to prevent object injection.
 * @param obj Object or array to be set
 * @param key Key or index to set.
 * @param value Value to set
 * @returns Object (mutated if key isn't blacklisted).
 */
export const safeMutator = <O extends Record<string, any>, K extends keyof O>(obj: O, key: K, value: O[K]) => {
  if (typeof obj === 'object' && key !== undefined && !BLACKLISTED_ACCESSORS.includes(key)) {
    obj[key] = value;
    return obj;
  }
  return obj;
};

/**
 * Checks that given object contains key, and **asserts** that key is keyof obj.
 * @param obj
 * @param key
 * @returns
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const hasKey = <O extends Record<any, any>>(obj: O, key: keyof any): key is keyof O => key in obj;

/**
 * Rounds to a specified amount of decimal places
 * @param v Val to round
 * @param dp Decimal places (0 by default)
 * @returns value rounded to specified dp
 */
export const round = (v: number, dp = 0) => {
  const m = 10 ** dp;
  return Math.round(v * m) / m;
};

/**
 * Returns the percentage as an as a float or an integer, it will always return an integer if `round` is true
 * @param fraction Portion of total
 * @param total Total
 * @param shouldRound Whether to round (true by default)
 * @param dp Decimal places to round to (0 by default)
 */
export function calculatePercentage(fraction: number, total: number, shouldRound = true, dp = 0) {
  if (fraction === 0 && total === 0) {
    return 0;
  }

  if (total === 0) {
    return 0;
  }

  const percentage = (100 / total) * fraction;
  return shouldRound ? round(percentage, dp) : percentage;
}

/**
 * This function will generate a display string for whatever value is being passed, incl. rounding, suffixes, and divsion
 */
export const constructValueDisplayString = (value: number | string, dp = 1, formatNumber = true, prefix = '') => {
  let parsedValue = typeof value === 'string' ? parseFloat(value) : value;
  if (typeof value === 'string' && Number.isNaN(parsedValue)) {
    return value;
  }

  //Calculate the suffix required, and divide the number if necessary
  let suffix = '';
  if (formatNumber) {
    if (parsedValue >= 1000000) {
      suffix = 'M';
      parsedValue = parsedValue / 1000000;
    } else if (parsedValue >= 1000) {
      suffix = 'K';
      parsedValue = parsedValue / 1000;
    }
  }

  //Now we've got something closer to what we want to show on the screen, make sure it's rounded properly
  parsedValue = round(parsedValue, dp);

  //If it's a whole number, don't set the decimal places, otherwise, set them
  const returnValue = parsedValue % 1 != 0 ? parsedValue.toFixed(dp) : parsedValue;

  //Send it back with optional suffix attached
  return `${prefix}${returnValue}${suffix}`;
};

export const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type FindType = {
  ids: string[] | Set<string>;
  table: string;
  index: string | null;
  fieldName: string;
  client?: DynamoDBDocumentClient;
};

/**
 * Finds all items that match any ids on the index provided in a table in ddb
 */
export const findItemsInTable = async ({ ids, table, index, fieldName, client }: FindType) => {
  client = client ?? DynamoDBDocumentClient.from(getDynamoClient());
  const itemsToReturn = new Set<string>([]);

  for (const _id of ids) {
    const query = await queryDynamoTable(table, index, fieldName, _id, undefined, undefined, client);

    if (query && query.Items && query.Items.length > 0) {
      query.Items.forEach((_pdu) => itemsToReturn.add(_pdu.id));
    }
  }

  return itemsToReturn;
};

export const getParseForReport = async (reportId: string, ddClient?: DynamoDBDocumentClient) => {
  console.log('Scanning parse table for parseReportId', reportId);

  const scan = await scanDynamoTable(
    PARSE_TABLE,
    {
      ...defaultScanOptions,
      ExpressionAttributeNames: {
        ...defaultScanOptions.ExpressionAttributeNames,
        '#pr': 'parseReportId',
      },
      ExpressionAttributeValues: {
        ...defaultScanOptions.ExpressionAttributeValues,
        ':pr': reportId,
      },
      FilterExpression: `#pr = :pr AND ${defaultScanOptions.FilterExpression}`,
    },
    undefined,
    ddClient
  );

  const parse = scan.Items?.[0];

  if (!parse) {
    console.error(scan);
    throw new Error(`Could not find parse for report ID ${reportId}`);
  }

  console.log('Got parse successfully');

  return parse as Parse;
};
