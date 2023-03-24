import { updateTableRecord } from 'lambda/shared/dynamo';
import { PARSE_TABLE } from 'src/constants/datastore';
import type { ParseResult } from './init';
import { initParse } from './init';

//These come from running `amplify edit function` and providing the lambda access to our graphQL Api resource. They're made automagically.
// const GRAPHQL_ENDPOINT = process.env.API_TESSERACT_GRAPHQLAPIENDPOINTOUTPUT;
// const GRAPHQL_API_KEY = process.env.API_TESSERACT_GRAPHQLAPIKEYOUTPUT;

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

        console.log('parsedData', data);
      }

      //We can't set the ttl on the parse/report when we create the record because graphQL doesn't let you, however we can set it here at the start of the parse.
      const nextWeek = Math.floor(Date.now() / 1000 + 24 * 60 * 60 * 7);
      const expressionAttributeNames = {
        '#ttl': '_ttl',
      };
      const expressionAttributeValues = {
        ':ttl': nextWeek,
      };

      const updateExpression = 'SET #ttl = :ttl';
      await updateTableRecord({
        table: PARSE_TABLE,
        id: data.parseId,
        expressionAttributeNames,
        expressionAttributeValues,
        updateExpression,
      });

      if (data) {
        let parse: ParseResult & { status: string };
        try {
          parse = {
            ...(await initParse(data)),
            status: 'SUCCESS',
          };
        } catch (err) {
          parse = {
            status: 'ERROR',
            warnings: [{ parseError: err instanceof Error ? err.message : String(err) }],
            levers: data.levers,
            key: 'ERROR',
            personaSettings: data.personaSettings,
          };
        }

        // write parse result to db
        try {
          console.log('writing parse result to', PARSE_TABLE);
          //TODO: Should we cancel if we don't have a parse version available on here ? We should always be passing one up.
          const expressionAttributeNames = {
            '#inputAnalyticCsv': 'inputAnalyticCsv',
            '#inputProjectCsv': 'inputProjectCsv',
            '#levers': 'levers',
            '#endDateTime': 'endDateTime',
            '#status': 'status',
            '#warnings': 'warnings',
            '#previewS3': 'previewS3',
            '#version': '_version',
          };

          const expressionAttributeValues = {
            ':setInputAnalyticCsv': data.inputAnalyticCsv,
            ':setInputProjectCsv': data.inputProjectCsv,
            ':setLevers': JSON.stringify(parse.levers),
            ':setEndDateTime': new Date().toISOString(),
            ':setStatus': parse.status,
            ':setWarnings': parse.warnings.map((w) => JSON.stringify(w)),
            ':setPreviewS3': parse.key,
            ':setParseVersion': data.parseVersion ? data.parseVersion + 1 : 1,
          };

          // TODO: can this be built from the above?
          const updateExpression =
            'SET #inputAnalyticCsv = :setInputAnalyticCsv,#inputProjectCsv = :setInputProjectCsv,#levers = :setLevers,#endDateTime = :setEndDateTime,#status = :setStatus,#warnings = :setWarnings,#previewS3 = :setPreviewS3, #version = :setParseVersion';

          const res = await updateTableRecord({
            table: PARSE_TABLE,
            id: data.parseId,
            expressionAttributeNames,
            expressionAttributeValues,
            updateExpression,
          });

          console.log('Parse write result: ', res);
        } catch (err) {
          console.error(err);
        }
      }
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
    body: JSON.stringify({ res: 'ok!' }),
  };
};

export default handler;
