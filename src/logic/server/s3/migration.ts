import { v4 } from 'uuid';
import { REPORT, REPORT_TABLE } from 'src/constants/datastore';
import { AccessLevel } from 'src/graphql';
import { getMeta, uploadToDynamoTable } from 'src/logic/server/dynamo';
import type { Tokens } from 'src/types/auth';
import type { ReportTableItem } from 'src/types/dynamo';

/**
 * Reads all report files from S3 dump and uploads a corresponding entry to the dyanmo report table for valid report files.
 *
 * @param stream Readable
 * @returns Promise<string>
 */
export const migrateReportListToDynamo = async (files: string[], tokens: Tokens) => {
  const newDynamoItems = [];

  for (const _file of files) {
    //Decode the filename (as s3 is annoying).
    const decodedFilename = decodeURI(_file);

    //Extract all the metadata we can out of the report path.
    const [partner, org, date, name] = decodedFilename.split('/');

    //Check that we have all the valid metadata that we need.
    if (!partner || !org || !date || !name || partner === 'upload') {
      continue;
    } else {
      console.log('Valid file found, generating dynamo object. Filename: ', decodedFilename);

      //Valid file found, create dynamo record to be uploaded.
      const dynamoItem: ReportTableItem = {
        ...getMeta(new Date(), REPORT),
        id: v4(),
        context: `${partner}/${org}`,
        reportDate: date,
        //For the uploaded files we'll pretty much just have `report.json` as the filename, not really sure how I feel about opening every file and extracting it here
        reportName: name,
        accessLevel: AccessLevel.PARTNER, //auto restrict all imported reports just in case.
        s3Key: decodedFilename, //s3 doesn't encode so for migration we can use this to make it a bit nicer.
        projects: [],
        insights: [],
      };

      newDynamoItems.push(dynamoItem);
    }
  }

  //Upload the new receords to the dynamo table
  return uploadToDynamoTable(newDynamoItems, REPORT_TABLE, tokens);
};
