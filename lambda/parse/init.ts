import { updateTableRecord } from 'lambda/shared/dynamo';
import { getFromS3AsString } from 'lambda/shared/s3';
import { REPORT_TABLE } from 'src/constants/datastore';
import type { Levers, PersonaSettings } from 'src/types/csv';
import type { DashboardData } from 'src/types/slices';
import { parseAndValidateReportCsv } from './report';
import { buildReportData } from './report/parse';
import { validateLevers } from './report/validate';

const writeReportToDatabase = async (reportId: string, data: DashboardData) => {
  console.log(
    JSON.stringify(data, (k, v) => (v === undefined || Number.isNaN(v) ? '!!! WARNING UNDEFINED OR NaN' : v))
  );

  const nextWeek = Math.floor(Date.now() / 1000 + 24 * 60 * 60 * 7);
  const expressionAttributeNames = {
    '#reportData': 'reportData',
    '#ttl': '_ttl',
  };

  const expressionAttributeValues = {
    ':setReportData': data,
    ':ttl': nextWeek,
  };

  const updateExpression = 'SET #reportData = :setReportData, #ttl = :ttl';
  await updateTableRecord({
    table: REPORT_TABLE,
    id: reportId,
    expressionAttributeNames,
    expressionAttributeValues,
    updateExpression,
  });

  console.log('Report data set successfully');
};

export type ParseInput = {
  inputAnalyticCsv: string;
  orgId: string;
  inputProjectCsv: string;
  reportDate: string;
  levers: Levers;
  parseId: string;
  reportId: string;
  regenerate: boolean;
  personaSettings: PersonaSettings;
};

export type ParseResult = {
  key: string;
  levers: Levers;
  warnings: Record<string, string>[];
  personaSettings: PersonaSettings;
};

export const initParse = async ({
  inputAnalyticCsv,
  inputProjectCsv,
  orgId,
  reportDate,
  levers,
  parseId,
  reportId,
  regenerate,
  personaSettings,
}: ParseInput): Promise<ParseResult> => {
  console.log(`${regenerate ? 'Regenerate' : 'Parse'} started`, { parseId, reportId });

  const workingDays = Number(levers.workingDays);

  // normalise levers
  const hybridLower = levers.hybridLower / 100;
  const hybridUpper = levers.hybridUpper / 100;

  // validate levers
  if (!validateLevers({ hybridLower, hybridUpper, workingDays }, true)) {
    throw new Error('Invalid lever settings');
  }

  // check we have the csv file
  let csvText: string;
  try {
    // s3 file has been uploaded to s3, fetch it and grab its contents as a string
    csvText = await getFromS3AsString(inputAnalyticCsv);
  } catch (err) {
    console.error(err);
    throw new Error(`Missing file: ${inputAnalyticCsv}`);
  }

  // bail out if the csv is empty
  if (!csvText) {
    throw new Error(`Could not read file: ${inputAnalyticCsv}`);
  }

  let projectCsvText: string;
  try {
    // s3 file has been uploaded to s3, fetch it and grab its contents as a string
    projectCsvText = await getFromS3AsString(inputProjectCsv);
  } catch (err) {
    console.error(err);
    throw new Error(`Missing file: ${inputProjectCsv}`);
  }

  if (!projectCsvText) {
    throw new Error(`Could not read file: ${inputProjectCsv}`);
  }

  console.log('upload validation complete, beginning parse...');

  try {
    console.time('parse');
    const { reportData, inputLocations, projectFailures } = await parseAndValidateReportCsv(
      csvText,
      projectCsvText,
      orgId,
      {
        hybridLower,
        hybridUpper,
        workingDays,
        keySites: levers.keySites || [],
        upgradingSites: levers.upgradingSites || [],
      },
      reportDate,
      parseId,
      reportId,
      regenerate, //use to decide to delete existing DUs or not.
      personaSettings
    );

    const { employeeData, locations } = reportData;

    // build the JSON report
    console.log('buildReportData');
    const report = buildReportData(
      employeeData,
      locations,
      orgId,
      personaSettings,
      { hybridLower, hybridUpper, workingDays },
      inputLocations,
      levers.keySites,
      levers.upgradingSites
    );
    console.log('buildReportData complete');

    const data = {
      report,
      personaSettings,
      levers,
      inputProjectCsv,
      inputAnalyticCsv,
    };

    console.log(data);
    // send the data to s3
    // We now write to db but can keep this as a backup for now.
    const key = 'S3_KEY_DEPRECATED'; //TODO: Remove this once sly migration is complete

    //Write this to the database now.
    console.log('Writing report data to ddb...');
    await writeReportToDatabase(reportId, data.report);

    console.log('completed');
    return { key, levers: data.levers, warnings: projectFailures, personaSettings: data.personaSettings };
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    console.timeEnd('parse');
  }
};
