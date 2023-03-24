import type { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { queryDynamoTable, queryDynamoTableBatch } from 'lambda/shared/dynamo';
import { DU_TABLE, ORGANISATION_TABLE, REPORT_TABLE } from 'src/constants/datastore';
import type { DU, Organisation, Report } from 'src/graphql';

export const getDusById = async (duIds: string[], ddClient?: DynamoDBDocumentClient) => {
  console.log('Querying dynamo for DUs...');
  const dus = await queryDynamoTableBatch(DU_TABLE, 'id', 'id', duIds, ddClient);
  console.log('Got DUs successfully');

  return dus as DU[];
};

export const getOrganisation = async (orgId: string, ddClient?: DynamoDBDocumentClient) => {
  console.log('Querying dynamo for organisation', orgId);
  const query = await queryDynamoTable(
    ORGANISATION_TABLE,
    'byOrganisationId',
    'organisationId',
    orgId,
    undefined,
    undefined,
    ddClient
  );
  const org = query.Items?.[0];

  if (!org) {
    console.error(query);
    throw new Error(`Could not find org for ID ${orgId}`);
  }

  console.log('Got organisation successfully');

  return org as Organisation;
};

export const getReport = async (reportId: string, ddClient?: DynamoDBDocumentClient) => {
  console.log('Querying dynamo for report', reportId);
  const query = await queryDynamoTable(REPORT_TABLE, null, 'id', reportId, undefined, undefined, ddClient);
  const report = query.Items?.[0];

  if (!report) {
    console.error(query);
    throw new Error(`Could not find report for ID ${reportId}`);
  }

  console.log('Got report successfully');

  return report as Report;
};
