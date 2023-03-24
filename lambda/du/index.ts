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

import { v4 } from 'uuid';
import { updateTableRecord, uploadToDynamoTable, uploadAllToDynamoTable, getMeta } from 'lambda/shared/dynamo';
import { DU_TABLE, PARSE_TABLE, PROJECT_DUS, PROJECT_DUS_TABLE } from 'src/constants/datastore';
import type { DUTableItem, ProjectDUsTableItem } from './types';

const handleFailure = async (err: unknown, parseId: string) => {
  console.error(err);

  await updateTableRecord({
    table: PARSE_TABLE,
    id: parseId,
    expressionAttributeNames: { '#status': 'status' },
    expressionAttributeValues: { ':status': 'ERROR' },
    updateExpression: 'SET #status = :status',
  });

  return;
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 *
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
export const handler = async (event: any) => {
  console.log(event);
  try {
    for (const { body } of event.Records) {
      let data;
      if (body) {
        data = JSON.parse(body);
      }

      if (data) {
        const { entries, parseId } = data;

        if (entries && Array.isArray(entries) && entries.length > 0) {
          try {
            const projectEntryList: ProjectDUsTableItem[] = [];

            while (entries.length) {
              const dbUpload = entries.splice(0, 25);
              console.log(
                'WRITING EMPLOYEES TO DB',
                dbUpload.length,
                dbUpload.map((en) => en.name)
              );

              try {
                await uploadToDynamoTable(dbUpload as DUTableItem[], DU_TABLE);
              } catch (err) {
                await handleFailure(err, parseId);
                continue;
              } finally {
                await wait(100);
              }

              // store for projects table update if necessary
              for (const { id, projects } of dbUpload) {
                projectEntryList.push(
                  ...(projects.map((projectID: string) => ({
                    id: v4(),
                    dUID: id,
                    projectID,
                    ...getMeta(new Date(), PROJECT_DUS),
                  })) as ProjectDUsTableItem[])
                );
              }

              // update number of DUs processed on parse table
              await updateTableRecord({
                table: PARSE_TABLE,
                id: parseId,
                expressionAttributeNames: { '#processedDus': 'processedDus' },
                expressionAttributeValues: { ':processedDus': dbUpload.length },
                updateExpression: 'SET #processedDus = #processedDus + :processedDus',
              });
            }

            // if we have any DU projects to store, update that table
            try {
              console.log(`${projectEntryList.length} items to write to PROJECT DUS TABLE...`);
              await uploadAllToDynamoTable(projectEntryList, PROJECT_DUS_TABLE, 250);
            } catch (err) {
              await handleFailure(err, parseId);
              continue;
            }
          } catch (err) {
            await handleFailure(err, parseId);
            continue;
          }
        }
      }
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
  } catch (err) {
    console.error(err);
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
};

export default handler;
