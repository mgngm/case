import { addEmployeesToDeleteQueue, addEmployeesToQueue, getDuIdsForReport } from 'lambda/parse/report/employee';
import type { Project } from 'src/graphql';
import type { Levers, ParseResult, PersonaSettings } from 'src/types/csv';
import { buildPropertiesFromAnalyticData, hydrateAnalyticData } from './analytics';
import { CSV_FORMAT_FS183, EMPTY_DEPENDENT_PROPERTIES } from './constants';
import { convertCsvToJson } from './convert';
import { parseAnalyticData } from './parse';
import { addProjectsToDb, mapProjectsToTemplates, parseProjectData, updateReportWithProjects } from './projects';
import { validateJsonCsv } from './validate';

const emptyParseResult: ParseResult = {
  reportData: {
    userIdsFromAnalytics: [],
    employeeData: [],
    termsAndValues: {},
    valuesSearchLists: { du: new Set(), target: new Set(), dug: new Set(), spg: new Set() },
    locations: {
      all: {
        office: {
          count: 0,
          scoreSum: 0,
          weightSum: 0,
          hxScore: 0,
          scoreCounts: { total: 0, suffering: 0, frustrated: 0, satisfied: 0 },
        },
        remote: {
          count: 0,
          scoreSum: 0,
          weightSum: 0,
          hxScore: 0,
          scoreCounts: { total: 0, suffering: 0, frustrated: 0, satisfied: 0 },
        },
        hybrid: { hybridBreakdown: { 0: 0, 20: 0, 40: 0, 60: 0, 80: 0 }, count: 0 },
      },
      offices: {},
      personas: {},
    },
    personaTerm: { value: '', termType: '' },
  },
  analyticData: [],
  inputLocations: new Set(),
  projects: [],
  projectFailures: [],
};

/**
 * parse and validate uploaded report csv file
 *
 * @param csvText {string}
 * @param orgId {string}
 * @param tokens {Tokens}
 * @returns Promise<ParsedAnalyticData>
 */
export const parseAndValidateReportCsv = async (
  csvText: string,
  projectCsvText: string,
  orgId: string,
  levers: Levers,
  date: string,
  parseId: string,
  reportId: string,
  regenerate: boolean,
  personaSettings: PersonaSettings
): Promise<ParseResult> => {
  // convert csv to json object
  let jsonData = await convertCsvToJson(csvText);
  let jsonProjectData = await convertCsvToJson(projectCsvText);

  // validate json data
  jsonData = validateJsonCsv(jsonData);
  jsonProjectData = validateJsonCsv(jsonProjectData);

  // hydrate/sanitise json data
  const { analyticData, locations, projects } = hydrateAnalyticData(jsonData, jsonProjectData, CSV_FORMAT_FS183, {
    termType: personaSettings.termType,
    value: personaSettings.term,
  });

  if (analyticData.length === 0) {
    // no analytic data, so bail early with an empty set
    return emptyParseResult;
  }

  // get properties from analyticData
  const properties = buildPropertiesFromAnalyticData(analyticData);
  const props = {
    properties,
    dependentProperties: EMPTY_DEPENDENT_PROPERTIES,
  };

  const reportData = parseAnalyticData(
    analyticData,
    personaSettings?.inputAssumptions,
    props,
    {
      termType: personaSettings.termType,
      value: personaSettings.term,
    },
    levers
  );

  const projectData = parseProjectData(
    projects,
    personaSettings?.inputAssumptions,
    {
      termType: personaSettings.termType,
      value: personaSettings.term,
    },
    props,
    levers,
    date
  );

  // match projects to templates and store for the report
  const { mergedProjects, failures: projectFailures } = await mapProjectsToTemplates(
    projectData,
    orgId,
    reportId,
    date
  );

  let projectRecords: Project[] = [];

  projectRecords = await addProjectsToDb(mergedProjects as Project[], reportId, orgId);
  console.log('PROJECT RECORDS', projectRecords);
  // write these to the projects key in the report table
  await updateReportWithProjects(reportId, projectRecords);

  // remove existing DUs before storing new ones
  if (regenerate) {
    try {
      const duIds = await getDuIdsForReport(reportId);
      await addEmployeesToDeleteQueue(duIds);
    } catch (err) {
      // if this fails, it's not the end of the world
      // we'll have duplicate DUs attached to the report
      // but that should be simple enough to sort by hand
      // by comparing createdAt values
      console.error(err);
    }
  }

  // store DUs
  await addEmployeesToQueue(
    reportData.employeeData,
    projectRecords,
    projectData,
    reportId,
    orgId,
    {
      termType: personaSettings.termType,
      value: personaSettings.term,
    },
    locations,
    parseId
  );

  return {
    reportData,
    inputLocations: locations,
    analyticData,
    projects: projectRecords,
    projectFailures,
  };
};
