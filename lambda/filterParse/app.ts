/* eslint-disable import/no-unresolved */
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
// @ts-expect-error we've excluded aws-serverless-express from esbuild
import awsServerlessExpressMiddleware from 'aws-serverless-express/middleware';
import bodyParser from 'body-parser';
import type { Express } from 'express';
import express from 'express';
import { z } from 'zod';
import { getDusById, getOrganisation, getReport } from 'lambda/filterParse/db';
import { getInputLocationsFromReportData, mapDUsToEmployees } from 'lambda/filterParse/lib';
import { calculateScoresPerLocation } from 'lambda/parse/report/locations';
import { buildReportData } from 'lambda/parse/report/parse';
import { getDynamoClient } from 'lambda/shared/dynamo';
import { getParseForReport } from 'lambda/shared/helpers';
import type { Employee, Levers, PersonaSettings } from 'src/types/csv';
import type { DashboardData } from 'src/types/slices';

// declare a new express app
const app: Express = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

/**********************
 * GET methods *
 **********************/

app.get('/filter-parse', function (req, res) {
  res.json({ success: true });
});

/****************************
 * POST methods *
 ****************************/

app.post('/filter-parse', async (req, res) => {
  try {
    // validate request body
    const validateResult = z
      .object({ reportId: z.string(), dus: z.array(z.string()), orgId: z.string() })
      .safeParse(req.body);

    if (!validateResult.success) {
      console.error(validateResult);
      return res.status(400).json({ error: 'Invalid request body' });
    }

    const { dus: duIds, reportId, orgId } = validateResult.data;

    // create a reusable dynamo client
    const dynamoDocClient = DynamoDBDocumentClient.from(getDynamoClient());

    // fetch report
    let report;
    try {
      report = await getReport(reportId, dynamoDocClient);

      if (!report.reportData) {
        console.error(report);
        throw new Error(`reportData missing from ${reportId}`);
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Could not get report record from database' });
    }

    const reportData =
      typeof report.reportData === 'string'
        ? (JSON.parse(report.reportData) as DashboardData)
        : (report.reportData as DashboardData);

    // extract the original location names from the report data
    // (since they're normalised for calculations)
    const inputLocations = getInputLocationsFromReportData(reportData);

    // find parseId by reportId and fetch parse record
    let parseRecord;
    try {
      parseRecord = await getParseForReport(reportId);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Could not get parse from report ID' });
    }

    const { levers: dbLevers } = parseRecord;

    if (!dbLevers) {
      throw new Error('No levers found for parse');
    }

    let { personaSettings } = parseRecord;

    // fetch organisation record (if no persona settings on parse)
    if (!personaSettings) {
      let organisation;
      try {
        organisation = await getOrganisation(orgId);
        personaSettings = organisation.personaSettings;
      } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Could not get organisation record from database' });
      }
    }

    if (!personaSettings) {
      throw new Error('Could not find persona settings');
    }

    const settings: PersonaSettings =
      typeof personaSettings === 'string'
        ? (JSON.parse(personaSettings) as PersonaSettings)
        : (personaSettings as PersonaSettings);

    const levers: Levers = typeof dbLevers === 'string' ? (JSON.parse(dbLevers) as Levers) : (dbLevers as Levers);

    // fetch DUs by ID
    let dus: Employee[] = [];
    try {
      const dbDus = await getDusById(duIds, dynamoDocClient);

      if (dbDus.length === 0) {
        throw new Error('No DUs found for given IDs');
      }

      dus = mapDUsToEmployees(dbDus, settings);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Could not get DUs from DU ID list' });
    }

    // given all the locations in the DUs, calculate the aggregate scores
    const locations = calculateScoresPerLocation(dus, levers, {
      termType: settings.termType,
      value: settings.term,
    });

    // LETS PARSE!
    const parseResult = buildReportData(
      dus,
      locations,
      orgId,
      settings,
      levers,
      new Set(inputLocations),
      levers.keySites ?? [],
      levers.upgradingSites ?? []
    );

    // TODO: store the parse result in the filter results table (tbd)

    res.json(parseResult);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'filter parse failed' });
  }
});

/****************************
 * initialisation *
 ****************************/

app.listen(3000, function () {
  console.log('App started');
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
export default app;
