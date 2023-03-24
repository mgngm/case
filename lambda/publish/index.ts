/* Amplify Params - DO NOT EDIT
	API_TESSERACT_DUTABLE_ARN
	API_TESSERACT_DUTABLE_NAME
	API_TESSERACT_GRAPHQLAPIIDOUTPUT
	API_TESSERACT_PARSETABLE_ARN
	API_TESSERACT_PARSETABLE_NAME
	API_TESSERACT_REPORTTABLE_ARN
	API_TESSERACT_REPORTTABLE_NAME
	ENV
	REGION
Amplify Params - DO NOT EDIT */

import {
  queryDynamoTable,
  updateTableRecord,
  removeAttributeFromBatchRecords,
  removeAttributeFromRecord,
} from 'lambda/shared/dynamo';
import { wait } from 'lambda/shared/helpers';
import { DU_TABLE, REPORT_TABLE, PROJECT_TABLE, PARSE_TABLE } from 'src/constants/datastore';

const handleFailure = async (err: unknown) => {
  console.error(err);

  return {
    statusCode: 500,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
    },
    body: JSON.stringify({ res: 'error', error: err instanceof Error ? err.message : String(err) }),
  };
};

/**
 *
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
export const handler = async (event: { Records: [{ body: string }] }) => {
  console.log(event);
  try {
    for (const { body } of event.Records) {
      let data;
      if (body) {
        data = JSON.parse(body) ?? null;
      }

      if (data) {
        const { reportId, accessLevel, projects, insights, parseId } = data;

        try {
          const updateObj = {
            table: REPORT_TABLE,
            id: reportId,
            expressionAttributeNames: {
              '#accessLevel': 'accessLevel',
              '#projects': 'projects',
              '#insights': 'insights',
              '#reportStatus': 'reportStatus',
            },
            expressionAttributeValues: {
              ':accessLevel': accessLevel,
              ':projects': projects,
              ':insights': insights,
              ':reportStatus': 'PUBLISHED',
            },
            updateExpression:
              'SET #accessLevel = :accessLevel, #projects = :projects, #insights = :insights, #reportStatus = :reportStatus',
          };

          console.log('Updating report in db', reportId, JSON.stringify(updateObj));
          await updateTableRecord(updateObj);

          console.log('[ttl] Removing TTL attribute for Report...');
          await removeAttributeFromRecord(REPORT_TABLE, '_ttl', reportId);
          console.log('[ttl] Report update complete');

          console.log('[ttl] Removing TTL attribute for Parse...');
          await removeAttributeFromRecord(PARSE_TABLE, '_ttl', parseId);
          console.log('[ttl] Parse update complete');

          // get DUs to remove TTL
          console.log('[ttl] Querying DUs by report ID');
          const result = await queryDynamoTable(DU_TABLE, 'byReport', 'reportId', reportId);

          const dus = result.Items?.map(({ id }) => id) ?? [];

          console.log('[ttl] DUS to update:', dus.length);

          if (dus.length) {
            // we've just done a massive query on the DU table, so lets wait half a second before
            // sending a ton of records back for a REMOVE call
            await wait(500);

            console.log('[ttl] Removing TTL attribute for DUs...');
            await removeAttributeFromBatchRecords(dus, DU_TABLE, '_ttl', undefined, 1000);
            console.log('[ttl] DU update complete');
          }

          console.log('[ttl] Projects to update:', projects.length);

          if (projects.length) {
            console.log('[ttl] Removing TTL attribute for projects...');
            await removeAttributeFromBatchRecords(projects, PROJECT_TABLE, '_ttl');
            console.log('[ttl] Project update complete');
          }

          console.log('Publish complete.');
        } catch (err) {
          handleFailure(err);
        }

        return {
          statusCode: 200,
          //  Uncomment below to enable CORS requests
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
          },
          body: JSON.stringify({ res: 'ok!' }),
        };
      }
      return {
        statusCode: 400,
        //  Uncomment below to enable CORS requests
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*',
        },
        body: JSON.stringify({ res: null }),
      };
    }
  } catch (err) {
    console.error(err);
  }
};

export default handler;
