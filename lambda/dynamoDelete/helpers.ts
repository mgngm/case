import type { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';
import type { S3Client } from '@aws-sdk/client-s3';
import type { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { listGroupsForContext, listUsersInContexts } from 'lambda/shared/cognito';
import { queryDynamoTable } from 'lambda/shared/dynamo';
import { findItemsInTable, getParseForReport } from 'lambda/shared/helpers';
import { findFilesInS3 } from 'lambda/shared/s3';
import type { OrgIdMap, reportIDMap } from 'lambda/shared/types/delete';
import {
  COGNITO_GROUP,
  COGNITO_USER,
  DU,
  DU_TABLE,
  ORGANISATION_TABLE,
  PARSE,
  PROJECT,
  PROJECT_DUS,
  PROJECT_DUS_TABLE,
  PROJECT_TABLE,
  REPORT,
  REPORT_TABLE,
  S3,
} from 'src/constants/datastore';

export const findIDsForReports = async (
  ids: string[] | Set<string>,
  client: DynamoDBDocumentClient
): Promise<reportIDMap> => {
  //Fetch dus.
  const reportDUs = await findItemsInTable({
    ids, //report ids
    index: 'byReport',
    fieldName: 'reportId',
    table: DU_TABLE,
    client,
  });

  //Fetch projects.
  const reportProjects = await findItemsInTable({
    ids, //report ids
    index: 'gsi-Report.projects',
    fieldName: 'reportProjectsId',
    table: PROJECT_TABLE,
    client,
  });

  //Get project DUs for all the DUs we found attached to this report.
  const reportProjectDus = await findItemsInTable({
    ids: [...reportDUs], //the ids of the DUs we found earlier :ffs:
    index: 'byDU',
    fieldName: 'dUID',
    table: PROJECT_DUS_TABLE,
    client,
  });

  const reportParseIds = new Set<string>([]);

  for (const _id of ids) {
    const parse = await getParseForReport(_id, client);
    reportParseIds.add(parse.id);
  }

  //We need to get the parse record for each report that we are passed, but we don't have any useful indexes on the parse
  return { [DU]: reportDUs, [PROJECT]: reportProjects, [PROJECT_DUS]: reportProjectDus, [PARSE]: reportParseIds };
};

type orgParams = {
  ids: string[] | Set<string>;
  ddbClient: DynamoDBDocumentClient;
  s3Client: S3Client;
  idpClient: CognitoIdentityProviderClient;
};

export const findIDsForOrg = async ({ ids, ddbClient, s3Client, idpClient }: orgParams): Promise<OrgIdMap> => {
  const returnMap: OrgIdMap = {
    [DU]: new Set([]),
    [PROJECT]: new Set([]),
    [PROJECT_DUS]: new Set([]),
    [REPORT]: new Set([]),
    [S3]: new Set([]),
    [COGNITO_GROUP]: new Set([]),
    [COGNITO_USER]: new Set([]),
    [PARSE]: new Set([]),
  };

  for (const _orgId of ids) {
    console.log(`Finding IDs for Org: ${_orgId}`);

    //First we need to get the nice org name from the db as we don't store reports on the db id.
    let orgName = null;
    const orgQuery = await queryDynamoTable(ORGANISATION_TABLE, null, 'id', _orgId, undefined, undefined, ddbClient);
    if (orgQuery && orgQuery.Items && orgQuery.Items.length > 0) {
      orgName = orgQuery.Items[0]?.organisationId ?? null;
    }

    //If we have this, we can go and look for all our reports / other bits.
    if (orgName) {
      console.log(`Org found: ${orgName}. Fetching resource IDs for deletion.`);

      const reportIdsToDelete = await findItemsInTable({
        ids: [orgName], //need to send the orgName not the database id because of annoying reasons. ^
        index: 'byContext',
        fieldName: 'context',
        table: REPORT_TABLE,
        client: ddbClient,
      });

      for (const _rid of reportIdsToDelete) {
        returnMap[REPORT].add(_rid);
      }

      //Get all ids mapped to all these reports
      const reportMappedIds = await findIDsForReports(reportIdsToDelete, ddbClient);

      //Pass all our new IDS to the return map.
      for (const _du of reportMappedIds[DU]) {
        returnMap[DU].add(_du);
      }
      for (const _rp of reportMappedIds[PROJECT]) {
        returnMap[PROJECT].add(_rp);
      }
      for (const _pdu of reportMappedIds[PROJECT_DUS]) {
        returnMap[PROJECT_DUS].add(_pdu);
      }
      for (const _parse of reportMappedIds[PARSE]) {
        returnMap[PARSE].add(_parse);
      }

      //OK Next up we want all S3 Files belonging to this org.
      const orgS3Files = await findFilesInS3(orgName, s3Client);
      for (const _file of orgS3Files) {
        returnMap[S3].add(_file);
      }

      //Then we want to get the corresponding Cognito Groups for delete.
      const groups = await listGroupsForContext([orgName], idpClient);
      for (const _group of groups) {
        returnMap[COGNITO_GROUP].add(_group);
      }

      //Then we want all of the users within those groups (this is it I swear);
      const users = await listUsersInContexts(groups, idpClient);
      for (const _user of users) {
        returnMap[COGNITO_USER].add(_user);
      }
    } else {
      console.log(`Org ID Mapping not found. Ignoring... ${_orgId}`);
    }
  }

  return returnMap;
};
