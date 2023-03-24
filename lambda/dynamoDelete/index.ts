import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';
import { S3Client } from '@aws-sdk/client-s3';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { findIDsForOrg, findIDsForReports } from 'lambda/dynamoDelete/helpers';
import {
  deleteCognitoGroups,
  deleteCognitoUsers,
  listGroupsForContext,
  listUsersInContexts,
} from 'lambda/shared/cognito';
import { deleteFromTable, getDynamoClient, queryDynamoTable } from 'lambda/shared/dynamo';
import { findItemsInTable } from 'lambda/shared/helpers';
import { removeFromS3 } from 'lambda/shared/s3';
import type { DeleteLambdaItem, DynamoDeleteLambdaIdMap, OrgIdMap, reportIDMap } from 'lambda/shared/types/delete';
import aws from 'src/aws-exports';
import {
  COGNITO_GROUP,
  COGNITO_USER,
  DU,
  DU_TABLE,
  ORGANISATION,
  ORGANISATION_TABLE,
  PARSE,
  PARSE_TABLE,
  PARTNER,
  PARTNER_TABLE,
  PROJECT,
  PROJECT_DUS,
  PROJECT_DUS_TABLE,
  PROJECT_TABLE,
  REPORT,
  REPORT_TABLE,
  S3,
} from 'src/constants/datastore';

//This is for mapping the type of delete to it's xorresponding db table.
const tableMap = {
  [PROJECT_DUS_TABLE]: PROJECT_DUS,
  [DU_TABLE]: DU,
  [PROJECT_TABLE]: PROJECT,
  [REPORT_TABLE]: REPORT,
  [ORGANISATION_TABLE]: ORGANISATION,
  [PARTNER_TABLE]: PARTNER,
  [PARSE_TABLE]: PARSE,
};

//THIS IS ONLY SET UP FOR DU/PROJECT/PROJECT_DU ATM. PHASE 2 THIS WEEK.
/**
 *
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
export const handler = async (event: any) => {
  console.log(event);

  //We will create an object that will track all the ids we want to delete
  const dynamoDeleteMap: DynamoDeleteLambdaIdMap = {
    [PROJECT_DUS]: new Set([]),
    [DU]: new Set([]),
    [PROJECT]: new Set([]),
    [REPORT]: new Set([]),
    [ORGANISATION]: new Set([]),
    [PARTNER]: new Set([]),
    [PARSE]: new Set([]),
    [S3]: new Set([]),
    [COGNITO_GROUP]: new Set([]),
    [COGNITO_USER]: new Set([]),
  };

  const ddbClient = DynamoDBDocumentClient.from(getDynamoClient());
  const s3Client = new S3Client({
    region: aws.aws_user_files_s3_bucket_region,
  });
  const idpClient = new CognitoIdentityProviderClient({
    region: aws.aws_cognito_region,
    maxAttempts: 10,
  });

  //For every record we are sent, figure out which IDs we need to delete for it
  for (const _record of event.Records) {
    const deleteItem: DeleteLambdaItem = JSON.parse(_record.body);

    console.log('Delete Item: ', _record.body);

    if (!deleteItem.id) {
      console.log('No ID, ignoring.', deleteItem);
      continue;
    }
    if (!deleteItem.type) {
      console.log('No type available, checking if its an old message type...', deleteItem);
      if (deleteItem.table && tableMap[deleteItem.table]) {
        console.log(`Found table: ${deleteItem.table}. Mapping to type: ${tableMap[deleteItem.table]}...`);
        deleteItem.type = tableMap[deleteItem.table];
      } else {
        console.log(`Table: ${deleteItem.table} has no mapped table type, ignoring...`);
        continue;
      }
    }

    //We will switch on all of the various types of things we can delete and do different things based on what that type requires.
    switch (deleteItem.type) {
      case PROJECT_DUS:
        console.log(`Project DU detected. ID: ${deleteItem.id}`);
        dynamoDeleteMap[PROJECT_DUS].add(deleteItem.id);
        break;
      case PARSE:
        console.log(`Parse detected. ID: ${deleteItem.id}`);
        dynamoDeleteMap[PROJECT_DUS].add(deleteItem.id);
        break;
      case DU: {
        console.log(`DU detected. ID: ${deleteItem.id}`);
        //For DUs we want to find any PROJECT_DUS underneath and add it to the PDU set.
        const projectDUs = await findItemsInTable({
          ids: [deleteItem.id],
          index: 'byDU',
          fieldName: 'dUID',
          table: PROJECT_DUS_TABLE,
          client: ddbClient,
        });

        for (const _pdu of projectDUs) {
          dynamoDeleteMap[PROJECT_DUS].add(_pdu);
        }
        dynamoDeleteMap[DU].add(deleteItem.id);
        break;
      }
      case PROJECT: {
        console.log(`Project detected. ID: ${deleteItem.id}`);
        dynamoDeleteMap[PROJECT].add(deleteItem.id);
        break;
      }
      case REPORT: {
        console.log(`Report detected. ID: ${deleteItem.id}`);
        //If we are deleting a report, we want to delete every du / project that belongs to this report, as well as the report itself.
        dynamoDeleteMap[REPORT].add(deleteItem.id);

        //Use our wrapper function to get all of the ids for this report
        const _reportIds = await findIDsForReports([deleteItem.id], ddbClient);

        //Look at this beasty :D
        for (const _key of Object.keys(_reportIds) as Array<keyof reportIDMap>) {
          for (const _item of _reportIds[_key]) {
            dynamoDeleteMap[_key].add(_item);
          }
        }

        break;
      }
      case ORGANISATION: {
        console.log(`Org detected. ID: ${deleteItem.id}.`);

        //Get all the IDS for this org, and paste all of the IDs into our main map
        const _orgIds = await findIDsForOrg({
          ids: [deleteItem.id],
          ddbClient,
          s3Client,
          idpClient,
        });

        //Look at this beasty :D
        //Disabled for now whilst we try and sort this shit out
        for (const _key of Object.keys(_orgIds) as Array<keyof OrgIdMap>) {
          for (const _item of _orgIds[_key]) {
            dynamoDeleteMap[_key].add(_item);
          }
        }

        //Finally add this org to the list, too!
        dynamoDeleteMap[ORGANISATION].add(deleteItem.id);
        break;
      }
      case PARTNER: {
        console.log(`Partner detected. ID: ${deleteItem.id}.`);
        //We only need the partner name to clear out cognito things. We can get everything else from the ID but we should still check here.
        let partnerName = null;
        const partnerQuery = await queryDynamoTable(
          PARTNER_TABLE,
          null,
          'id',
          deleteItem.id,
          undefined,
          undefined,
          ddbClient
        );

        if (partnerQuery && partnerQuery.Items && partnerQuery.Items.length > 0) {
          partnerName = partnerQuery.Items[0]?.partnerId ?? null;
        }

        if (partnerName) {
          console.log(`Partner found: ${partnerName}. Fetching resource IDs for deletion.`);

          const partnerOrgs = await findItemsInTable({
            ids: [deleteItem.id],
            index: 'gsi-Partner.organisations',
            fieldName: 'partnerOrganisationsId',
            table: ORGANISATION_TABLE,
            client: ddbClient,
          });

          //For EVERY org under this partner get EVERY ID we can possibly think of and throw in the map.
          const orgIds = await findIDsForOrg({ ids: partnerOrgs, idpClient, s3Client, ddbClient });

          for (const _key of Object.keys(orgIds) as Array<keyof OrgIdMap>) {
            for (const _item of orgIds[_key]) {
              dynamoDeleteMap[_key].add(_item);
            }
          }

          //then we want to get the cognito groups for THIS partner and then the users in those groups and finally add the partner to the queue.
          const groups = await listGroupsForContext([partnerName], idpClient);
          for (const _group of groups) {
            dynamoDeleteMap[COGNITO_GROUP].add(_group);
          }
          const users = await listUsersInContexts(groups, idpClient);
          for (const _user of users) {
            dynamoDeleteMap[COGNITO_USER].add(_user);
          }

          //Finally add this context to the list, too!
          dynamoDeleteMap[PARTNER].add(deleteItem.id);
        } else {
          console.log(`Couldn't find a mappable partner for ${deleteItem.id}`);
        }
        break;
      }
      default:
        console.log(`Unknown type: ${deleteItem.type} found. Ignoring...`);

        break;
    }
  }

  console.log(dynamoDeleteMap);

  const waitMs = 500;
  //Time to delete!
  try {
    if (dynamoDeleteMap[PROJECT_DUS].size) {
      await deleteFromTable([...dynamoDeleteMap[PROJECT_DUS]], PROJECT_DUS_TABLE, undefined, ddbClient, waitMs);
    }
    if (dynamoDeleteMap[DU].size) {
      await deleteFromTable([...dynamoDeleteMap[DU]], DU_TABLE, undefined, ddbClient, waitMs);
    }
    if (dynamoDeleteMap[PROJECT].size) {
      await deleteFromTable([...dynamoDeleteMap[PROJECT]], PROJECT_TABLE, undefined, ddbClient, waitMs);
    }
    if (dynamoDeleteMap[REPORT].size) {
      await deleteFromTable([...dynamoDeleteMap[REPORT]], REPORT_TABLE, undefined, ddbClient, waitMs);
    }
    if (dynamoDeleteMap[PARSE].size) {
      await deleteFromTable([...dynamoDeleteMap[PARSE]], PARSE_TABLE, undefined, ddbClient, waitMs);
    }
    if (dynamoDeleteMap[ORGANISATION].size) {
      await deleteFromTable([...dynamoDeleteMap[ORGANISATION]], ORGANISATION_TABLE, undefined, ddbClient, waitMs);
    }
    if (dynamoDeleteMap[PARTNER].size) {
      await deleteFromTable([...dynamoDeleteMap[PARTNER]], PARTNER_TABLE, undefined, ddbClient, waitMs);
    }

    //Remove all files from S3.
    if (dynamoDeleteMap[S3].size) {
      await removeFromS3(dynamoDeleteMap[S3], s3Client);
    }

    //Remove cognito groups (if any)
    if (dynamoDeleteMap[COGNITO_GROUP].size) {
      await deleteCognitoGroups(dynamoDeleteMap[COGNITO_GROUP], idpClient);
    }

    if (dynamoDeleteMap[COGNITO_USER].size) {
      await deleteCognitoUsers(dynamoDeleteMap[COGNITO_USER], idpClient);
    }
  } catch (e) {
    console.error(e);
  }
  return {
    statusCode: 200,
    //  Uncomment below to enable CORS requests
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
    },
    body: JSON.stringify({ message: 'Items successfully processed' }),
  };
};

export default handler;
