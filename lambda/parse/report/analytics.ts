/* eslint-disable @typescript-eslint/no-explicit-any */
import { produce } from 'immer';
import type {
  AnalyticData,
  AnalyticDU,
  AnalyticTarget,
  CsvJSON,
  EmployeeAnalytic,
  Impairer,
  InputAssumptions,
  ProjectAnalytic,
  ProjectAnalyticCsvJSON,
} from 'src/types/csv';
import {
  APPLICATION_WEIGHT,
  CSV_FORMAT_FS183,
  CSV_PROPERTY_DU_NAME,
  CSV_PROPERTY_LOCATION,
  CSV_PROPERTY_MISSION_NAME,
  CSV_PROPERTY_TARGET_NAME,
  FS183_MEAN_SCORE_KEY,
  FS813_POTENTIAL_SCORE_KEY,
  IMPAIRER_FIELDS,
  PROPERTY_DU,
  REPORTING_MEAN_SCORE_KEY,
  REPORTING_POTENTIAL_SCORE_KEY,
} from './constants';
import { getTargetName, getUserProperty } from './csv';
import { hasValidScores, hasPersonaTerm } from './validate';

/**
 * parses multiple impairer columns into a single impairer object
 *
 * @param analyticRow
 * @returns AnalyticData
 */
export const parseImpairers = (analyticRow: Record<string, string>) => {
  const impairers: Record<string, Impairer> = {};

  Object.entries(analyticRow).forEach(([key, value]) => {
    if (IMPAIRER_FIELDS.includes(key)) {
      const impairerId = key.replace(/^\D+/g, '');
      const impairerKey = `impairer${impairerId}`;

      if (!impairers[impairerKey]) {
        impairers[impairerKey] = { from: {}, to: {}, severity: undefined };
      }
      if (key.includes('From Impairer IP')) {
        impairers[impairerKey].from.ip = value;
      }

      if (key.includes('From Supplier')) {
        impairers[impairerKey].from.supplier = value;
      }

      if (key.includes('To Impairer IP')) {
        impairers[impairerKey].to.ip = value;
      }

      if (key.includes('To Supplier')) {
        impairers[impairerKey].to.supplier = value;
      }

      if (key.includes('Severity')) {
        impairers[impairerKey].severity = parseFloat(value);
      }
    }
  });

  // remove the unneeded fields
  const cleanRow = produce(analyticRow, (draftAnalyticRow: Record<string, string>) => {
    Object.keys(draftAnalyticRow).forEach((key) => {
      if (IMPAIRER_FIELDS.includes(key)) {
        delete draftAnalyticRow[key];
      }
    });
  });

  // return the lot
  return { ...cleanRow, impairers };
};

/**
 * This function takes the raw CSV data from the API/Cache and processes it ready for parsing.
 * The .text() should be called before the blob is passed to this function
 *
 * @param data - raw data object list to be hydrated
 * @returns
 */
export const hydrateAnalyticData = (
  data: CsvJSON,
  jsonProjectData: CsvJSON,
  csvType: string,
  personaTerm: { termType: string; value: string }
) => {
  const returnData: AnalyticData[] = [];
  const warnings: { [x: string]: any } = { score: [], du: [], target: [], personaTerm: [] };
  const locations: Set<string> = new Set();
  const projects: Map<string, ProjectAnalytic[]> = new Map();

  let i = 0;

  let meanKey = REPORTING_MEAN_SCORE_KEY;
  let potentialKey = REPORTING_POTENTIAL_SCORE_KEY;

  if (csvType === CSV_FORMAT_FS183) {
    meanKey = FS183_MEAN_SCORE_KEY;
    potentialKey = FS813_POTENTIAL_SCORE_KEY;
  }

  while (data && i < data.length) {
    const datum = data[i];
    if (
      hasValidScores(datum, meanKey, potentialKey) &&
      getUserProperty(datum as AnalyticDU) &&
      getTargetName(datum as AnalyticTarget) &&
      hasPersonaTerm(datum as Record<string, Record<string, string[]>>, personaTerm)
    ) {
      const datumParsedImpairers = parseImpairers(datum as Record<string, string>);

      const mean = datum[meanKey] as string;
      const potential = datum[potentialKey] as string;
      const hx = datum['HX Score'] as string;
      const weight = datum['Quality Score Weight'] as string;

      returnData.push({
        ...datumParsedImpairers,
        roundedMeanScore: Math.ceil(Number(mean)),
        meanScore: parseFloat(mean),
        potentialScore: parseFloat(potential),
        scoreDelta: parseFloat(potential) - parseFloat(mean),
        // notEstimated is a flag that is used in imported csvs to indicate whether a row has been created as a "fill in the gaps" analytic
        // if it is not specified, set it to true (ie, assume the analytic is real)
        notEstimated: datum.NotEstimated ? +datum.NotEstimated === 1 : true,
        hxScore: hx ? parseFloat(hx) : 0,
        scoreWeight: weight ? parseFloat(weight) : 0,
        Location: (datum[CSV_PROPERTY_LOCATION] as string).toLocaleLowerCase(),
      } as AnalyticData);

      locations.add(datum[CSV_PROPERTY_LOCATION] as string);

      // find datum in project data and add scores etc to it
      const projectAnalytics = jsonProjectData.filter(
        (projectAnalytic) =>
          projectAnalytic[CSV_PROPERTY_DU_NAME] === datum[CSV_PROPERTY_DU_NAME] &&
          projectAnalytic[CSV_PROPERTY_TARGET_NAME] === datum[CSV_PROPERTY_TARGET_NAME] &&
          projectAnalytic[CSV_PROPERTY_MISSION_NAME] === datum[CSV_PROPERTY_MISSION_NAME] &&
          (projectAnalytic[CSV_PROPERTY_LOCATION] as string)?.toLocaleLowerCase() ===
            (datum[CSV_PROPERTY_LOCATION] as string)?.toLocaleLowerCase()
      ) as ProjectAnalyticCsvJSON[];

      if (projectAnalytics.length > 0) {
        projectAnalytics.forEach((projectAnalytic) => {
          const hydratedProjectAnalytic = {
            ...projectAnalytic,
            ...datumParsedImpairers,
            roundedMeanScore: Math.ceil(Number(mean)),
            meanScore: parseFloat(mean),
            potentialScore: parseFloat(potential),
            scoreDelta: parseFloat(potential) - parseFloat(mean),
            notEstimated: true,
            hxScore: hx ? parseFloat(hx) : 0,
            scoreWeight: weight ? parseFloat(weight) : 0,
            applicationWeight: 0,
          };

          projects.set(projectAnalytic['Project ID'], [
            ...(projects.get(projectAnalytic['Project ID']) ?? []),
            hydratedProjectAnalytic,
          ]);
        });
      }
    } else if (!hasValidScores(datum, meanKey, potentialKey)) {
      warnings.score.push(datum);
    } else if (!getUserProperty(datum as AnalyticDU)) {
      warnings.du.push(datum);
    } else if (!getTargetName(datum as AnalyticTarget)) {
      warnings.target.push(datum);
    } else if (!hasPersonaTerm(datum as Record<string, Record<string, string[]>>, personaTerm)) {
      warnings.personaTerm.push(datum);
    }

    i += 1;
  }

  return { analyticData: returnData, warnings, locations, projects };
};

export const buildPropertiesFromAnalyticData = (analyticData: AnalyticData[]) => ({
  agent: Object.keys(analyticData[0].du ?? {}),
  agent_group: Object.keys(analyticData[0].dug ?? {}),
  sp_group: Object.keys(analyticData[0].spg ?? {}),
  target: Object.keys(analyticData[0].target ?? {}),
});

/**
 * calculateValuesPerAnalytic
 *
 * Calculates the derived data based on input assumptions from settings page
 *
 * @param analyticData - hydrated list of analytic objects
 * @returns object
 */
export const calculateValuesPerAnalytic = (analyticData: AnalyticData[]) => {
  const analyticDataWithValues = [];
  const ids = [];
  const employeeAnalyticObject: EmployeeAnalytic = {};

  let index = 0;
  while (analyticData && index < analyticData.length) {
    const analytic = analyticData[index];
    const key = getUserProperty(analytic)?.toLowerCase();

    if (key) {
      ids.push(key);
      if (key in employeeAnalyticObject) {
        employeeAnalyticObject[key].push(analytic);
      } else {
        employeeAnalyticObject[key] = [analytic];
      }
    }

    analyticDataWithValues.push(analytic);
    index += 1;
  }

  return { analyticDataWithValues, userIdsFromAnalytics: [...new Set(ids)], employeeAnalyticObject };
};

/**
 * Add analytic term values to a term value list
 *
 * @param termsList - list of term values
 * @param analyticTermValues - value or values for an analytic term
 * @returns Array<string>
 */
export const updateTermsList = (termsList: string[], analyticTermValues: string, termType: string) => {
  let values = [];

  if (termType === PROPERTY_DU) {
    values = [analyticTermValues];
  } else {
    // doesn't work for values which contain a comma
    // but we'll have to live with that for now
    const splitValues = analyticTermValues?.split(',') ?? [];

    for (const term of splitValues) {
      if (term) {
        values.push(term.trim());
      }
    }
  }

  if (Array.isArray(termsList)) {
    return { termsList: [...termsList, ...values], values };
  } else {
    return { termsList: values, values };
  }
};

export const getAnalyticApplicationWeights = (
  employeeAnalytics: Array<AnalyticData | ProjectAnalytic>,
  personaTermValue: string[],
  employeeApps: string[],
  inputAssumptions: InputAssumptions
): { updatedAnalytics: Array<AnalyticData | ProjectAnalytic>; normalisedApplications: Record<string, number> } => {
  const appWeightReducer =
    (applications: Record<string, number>) => (total: number, analytic: AnalyticData | ProjectAnalytic) => {
      const analyticTarget = analytic[CSV_PROPERTY_TARGET_NAME];
      return total + (applications[analyticTarget] || 0) / 100;
    };

  let applications: Record<string, number> = {};

  const personaTermValueLength = personaTermValue.length;

  if (personaTermValueLength > 0) {
    const personaTermVal = personaTermValue[0];

    if (personaTermValueLength === 1 && inputAssumptions[personaTermVal]) {
      const termSettings = inputAssumptions[personaTermVal];

      if (!termSettings) {
        applications = {};
      } else {
        applications = termSettings.applications;
      }
    } else if (personaTermValueLength > 1) {
      // edge case - if we have more than one persona term value for an employee
      // then take the average settings for both terms
      // this can occur if a non-du term is used as a persona term (eg a du can be in many custom groups)
      // but is this a likely situation in real life?

      const personaTermApps: Record<string, number> = {};

      for (let p = 0; p < personaTermValue.length; p++) {
        const personaTermSettings = inputAssumptions[personaTermValue[p]];

        if (!personaTermSettings) {
          continue;
        }

        const apps = personaTermSettings.applications;
        const appKeys = Object.keys(apps);

        for (let q = 0; q < appKeys.length; q++) {
          if (employeeApps.includes(appKeys[q])) {
            if (personaTermApps[appKeys[q]]) {
              personaTermApps[appKeys[q]] += apps[appKeys[q]] ?? 0;
            } else {
              personaTermApps[appKeys[q]] = apps[appKeys[q]] ?? 0;
            }
          }
        }
      }

      const personaTermAppsKeys = Object.keys(personaTermApps);
      const meanPersonaTermApps: Record<string, number> = {};

      for (let t = 0; t < personaTermAppsKeys.length; t++) {
        meanPersonaTermApps[personaTermAppsKeys[t]] =
          (personaTermApps[personaTermAppsKeys[t]] ?? 0) / personaTermValueLength;
      }

      applications = meanPersonaTermApps;
    }

    const totalAppWeight = employeeAnalytics.reduce(appWeightReducer(applications), 0);

    const normalisedApplications: Record<string, number> = {};
    Object.entries(applications).forEach(([app, val]) => (normalisedApplications[app] = val / 100));

    for (let n = 0; n < employeeAnalytics.length; n++) {
      const analyticTarget = employeeAnalytics[n][CSV_PROPERTY_TARGET_NAME];

      const calculatedAppWeight = (applications[analyticTarget] || 0) / 100 / (totalAppWeight || 1);
      employeeAnalytics[n][APPLICATION_WEIGHT] = Math.max(0, calculatedAppWeight);
    }

    return { updatedAnalytics: employeeAnalytics, normalisedApplications };
  }

  return { updatedAnalytics: employeeAnalytics, normalisedApplications: {} };
};
