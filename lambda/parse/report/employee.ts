/* eslint-disable no-relative-import-paths/no-relative-import-paths */
import { SQSClient, GetQueueUrlCommand, SendMessageCommand } from '@aws-sdk/client-sqs';
import cloneDeep from 'lodash/cloneDeep';
import { v4 } from 'uuid';
import { getMeta, queryDynamoTable, updateTableRecord } from 'lambda/shared/dynamo';
import { hasKey, round, safeAccessor, safeKey, safeMutator } from 'lambda/shared/helpers';
import aws from 'src/aws-exports';
import { DU_DDB_QUEUE, DYNAMO_DELETE_QUEUE } from 'src/constants/api';
import { DU, PARSE_TABLE, DU_TABLE } from 'src/constants/datastore';
import type { Project } from 'src/graphql';
import { LocationType } from 'src/graphql';
import type {
  AnalyticData,
  Employee,
  EmployeeAnalytic,
  EmployeeLocation,
  HydratedProject,
  InputAssumption,
  InputAssumptions,
  OrgProperties,
  PersonaSettings,
  PersonaTerm,
  ProjectAnalytic,
  ValuesSearchLists,
} from 'src/types/csv';
import { getAnalyticApplicationWeights, updateTermsList } from './analytics';
import { getInputOfficeName } from './chart-data';
import {
  CSV_FIELD_DU,
  CSV_FIELD_GROUP,
  CSV_FIELD_MAPPED,
  CSV_FIELD_SPG,
  CSV_FIELD_TARGET,
  CSV_PROPERTY_DU_NAME,
  CSV_PROPERTY_TARGET_NAME,
  EMPTY_TERM,
  NA_TERM,
  PROPERTY_CSV_FIELD_MAP,
  PROPERTY_DU,
  PROPERTY_TARGET,
  SEARCH_TERM_SEPARATOR,
  TERMS_AND_VALUES_DEFAULT,
} from './constants';
import { concatCsvTermsWithOrgTerms } from './csv';

/**
 * getDeploymentTermsForEmployee
 *
 * Gets deployment terms for each analytic for the appropriate employee
 * for filtering on terms. Adds mapping terms under their own key, and
 * ensures DU & Target names are included as a _id in the appropriate
 * place
 *
 * @param employeeAnalytics - list of analytics containing property values for the employee
 * @param propertyValues - organisation properties
 * @returns object
 */
export const getDeploymentTermsForEmployee = (
  employeeAnalytics: Array<AnalyticData | ProjectAnalytic>,
  propertyValues: Record<string, string[]>,
  mappedProperties: string[],
  termsAndValues: Record<string, Record<string, string[]>>,
  valuesSearchLists: Record<string, Set<string>>
) => {
  const propertyEntries = Object.entries(propertyValues);
  const props = Object.keys(propertyValues);
  const terms: Record<string, Record<string, string[]>> = {};

  if (employeeAnalytics) {
    // build term keys objects on the employee
    let i = 0;
    while (i < props.length) {
      const propertyType = props[i];
      const termKey = hasKey(PROPERTY_CSV_FIELD_MAP, propertyType) ? PROPERTY_CSV_FIELD_MAP[propertyType] : null;
      if (termKey && safeAccessor(terms, termKey)) {
        safeMutator(terms, termKey, { ...terms[termKey] });
      } else if (termKey) {
        safeMutator(terms, termKey, {});
      }
      i += 1;
    }

    // include existing mapped terms if any
    if (mappedProperties && !terms.mapped) {
      terms[CSV_FIELD_MAPPED] = {};
    }

    //get properties from each analytic in the employee
    for (let k = 0; k < employeeAnalytics.length; k += 1) {
      const analytic = employeeAnalytics[k];
      // loop properties to add to terms
      for (const [propertyType, property] of propertyEntries) {
        if (hasKey(PROPERTY_CSV_FIELD_MAP, propertyType)) {
          const key = PROPERTY_CSV_FIELD_MAP[propertyType];

          if (safeKey(key)) {
            for (let t = 0; t < property?.length; t += 1) {
              const term = property[t];
              if (term && safeKey(term)) {
                if (
                  analytic[key]?.[term] &&
                  typeof analytic[key]?.[term] === 'string' &&
                  analytic[key]?.[term].toLowerCase() !== NA_TERM &&
                  analytic[key]?.[term] !== EMPTY_TERM
                ) {
                  const { termsList, values } = updateTermsList(
                    terms[key]?.[term],
                    analytic[key]?.[term] ?? '',
                    propertyType
                  );

                  terms[key][term] = [...new Set(termsList)];

                  for (let tv = 0; tv < values.length; tv += 1) {
                    valuesSearchLists[key].add(key + SEARCH_TERM_SEPARATOR + term + SEARCH_TERM_SEPARATOR + values[tv]);
                  }
                } else {
                  // store empty term
                  terms[key][term] = [...new Set(Array.isArray(terms[key][term]) ? terms[key][term] : [])];
                }

                if (term in termsAndValues[key]) {
                  termsAndValues[key][term].push(...terms[key][term]);
                } else if (safeKey(term)) {
                  termsAndValues[key][term] = [...terms[key][term]];
                }
              }
            }

            // handle name mappings
            if (propertyType === PROPERTY_DU || propertyType === PROPERTY_TARGET) {
              const termName = propertyType === PROPERTY_DU ? CSV_PROPERTY_DU_NAME : CSV_PROPERTY_TARGET_NAME;
              const analyticName = analytic[termName];

              if (
                analyticName &&
                typeof analyticName === 'string' &&
                analyticName.toLowerCase() !== NA_TERM &&
                analyticName !== EMPTY_TERM
              ) {
                terms[key]._id = Array.isArray(terms[key]._id) ? [...terms[key]._id, analyticName] : [analyticName];
                terms[key]._id = [...new Set(terms[key]._id)];
                valuesSearchLists[key].add(`${key + SEARCH_TERM_SEPARATOR}_id${SEARCH_TERM_SEPARATOR}${analyticName}`);

                if ('_id' in termsAndValues[key]) {
                  termsAndValues[key]._id.push(...terms[key]._id);
                } else if (safeKey('_id')) {
                  termsAndValues[key]._id = [...terms[key]._id];
                }
              }
            }

            // if we have mapped properties, add them to the mapped key
            if (mappedProperties) {
              let propIndex = 0;
              while (propIndex < mappedProperties.length) {
                const mappedProperty = mappedProperties[propIndex];

                if (safeKey(mappedProperty)) {
                  const analyticValue = analytic.du?.[mappedProperty] || analytic.dug?.[mappedProperty];
                  if (
                    analyticValue &&
                    typeof analyticValue === 'string' &&
                    analyticValue.toLowerCase() !== NA_TERM &&
                    analyticValue !== EMPTY_TERM
                  ) {
                    terms.mapped[mappedProperty] = Array.isArray(terms.mapped[mappedProperty])
                      ? [...terms.mapped[mappedProperty], analyticValue]
                      : [analyticValue];
                    terms.mapped[mappedProperty] = [...new Set(terms.mapped[mappedProperty]?.filter(Boolean))];

                    if (mappedProperty in termsAndValues.mapped) {
                      termsAndValues.mapped[mappedProperty].push(...terms.mapped[mappedProperty]);
                    } else {
                      termsAndValues.mapped[mappedProperty] = terms.mapped[mappedProperty];
                    }
                  }
                }

                propIndex += 1;
              }
            }
          }
        }
      }
    }
  }

  return terms;
};

/**
 * calculatePerEmployeeAveragesAndTermsAndGenerateCustomDimensions
 *
 * Matches analytic records to a user ID and calculates the
 * average mean and potential scores for that user ID.  Then
 * determines the scoreDelta for that user ID (employee).
 *
 * While we're at it we also apply the analytic terms to the employee.
 *
 * @param analyticData - object keyed by user ID, each a list of hydrated analytic objects
 * @param userIds - list of unique user IDs
 * @param orgProperties - map of organisation properties to parse
 * @returns
 */
export const calculatePerEmployeeAveragesAndTermsAndGenerateCustomDimensions = (
  analyticData: EmployeeAnalytic,
  userIds: string[],
  orgProperties: OrgProperties,
  personaTerm: PersonaTerm,
  inputAssumptions: InputAssumptions
) => {
  const employeeData: Record<string, Employee> = {};
  const reduceFn = (
    {
      count,
      meanScoreSum,
      potentialScoreSum,
      hxScoreSum,
      weightSum,
    }: {
      count: number;
      meanScoreSum: number;
      potentialScoreSum: number;
      hxScoreSum: number;
      weightSum: number;
    },
    {
      meanScore,
      potentialScore,
      hxScore,
      scoreWeight,
      applicationWeight,
    }: { meanScore: number; potentialScore: number; hxScore: number; scoreWeight: number; applicationWeight: number }
  ) => ({
    count: count + 1,
    meanScoreSum: meanScoreSum + meanScore,
    potentialScoreSum: potentialScoreSum + potentialScore,
    hxScoreSum: hxScoreSum + hxScore * (scoreWeight * applicationWeight),
    weightSum: weightSum + scoreWeight * applicationWeight,
  });

  const termsAndValues = cloneDeep(TERMS_AND_VALUES_DEFAULT);

  const valuesSearchLists: ValuesSearchLists = {
    [CSV_FIELD_DU]: new Set(),
    [CSV_FIELD_TARGET]: new Set(),
    [CSV_FIELD_GROUP]: new Set(),
    [CSV_FIELD_SPG]: new Set(),
  };

  // get terms from the org/properties response
  let propertyValues = orgProperties.properties;

  // each analytic object will have all the csv terms, so we can just use the first one to get them
  const csvProperties = { ...analyticData[userIds[0]][0] };

  // get the terms from each csv term column and add them to the equivalent org list (which is what we loop on later)
  for (const [orgKey, csvKey] of Object.entries(PROPERTY_CSV_FIELD_MAP)) {
    propertyValues = concatCsvTermsWithOrgTerms(propertyValues, csvProperties, orgKey, csvKey);
  }

  let mappedProperties: string[] = [];

  // concat mapped properties into a single list
  if ('dependentProperties' in orgProperties) {
    mappedProperties = orgProperties.dependentProperties.from.concat(orgProperties.dependentProperties.to);
  }

  let i = 0;

  while (i < userIds.length) {
    const userId = userIds[i];

    let perUserIdAnalytics = analyticData[userId];

    if (perUserIdAnalytics.length > 0) {
      // add the terms for these analytics onto the employee
      // nb this function mutates termsAndValues and valuesSearchLists
      const terms = getDeploymentTermsForEmployee(
        perUserIdAnalytics,
        propertyValues,
        mappedProperties,
        termsAndValues,
        valuesSearchLists
      );

      const { termType: personaTermType, value: personaTermName } = personaTerm;
      const personaTermValue = (terms[personaTermType] as Record<string, string[]>)[personaTermName];
      const employeeApps = (terms.target as Record<string, string[]>)._id;

      // collate the application weightings for each analytic
      perUserIdAnalytics = getAnalyticApplicationWeights(
        perUserIdAnalytics,
        personaTermValue,
        employeeApps,
        inputAssumptions
      ).updatedAnalytics;

      const perUserIdSummary = perUserIdAnalytics.reduce(reduceFn, {
        count: 0,
        meanScoreSum: 0,
        potentialScoreSum: 0,
        hxScoreSum: 0,
        weightSum: 0,
      });

      if (perUserIdSummary.count > 0) {
        const employeeQualityScore = perUserIdSummary.meanScoreSum / perUserIdSummary.count;
        const employeePotentialScore = perUserIdSummary.potentialScoreSum / perUserIdSummary.count;
        const employeeScoreDelta = employeePotentialScore - employeeQualityScore;
        // per employee hx score is a weighted mean across employee analytic locations
        const employeeHxScore = perUserIdSummary.hxScoreSum / (perUserIdSummary.weightSum || 1);
        const employeeScoreWeight = perUserIdSummary.weightSum;

        // parse out employee locations
        const employeeLocations: Record<string, EmployeeLocation> = {
          // create a default remote location object
          remote: {
            hxScore: 0,
            scoreSum: 0,
            weightSum: 0,
            durationSum: 0,
            appWeightSum: 0,
            maxDuration: 0,
            locations: [],
          },
        };

        perUserIdAnalytics.forEach((analytic) => {
          if (analytic.Location) {
            // create a location object for this analytic location
            const location = {
              location: analytic.Location,
              city: analytic.City,
              region: analytic.Region,
              country: analytic.Country,
              hxScore: analytic.hxScore || 0,
              hxWeight: analytic.scoreWeight * analytic.applicationWeight,
              duration: analytic.scoreWeight,
              appWeight: analytic.applicationWeight,
              maxDuration: analytic.scoreWeight,
            };

            // if analytic location already exists in employee, add this analytic location to it
            if (analytic.Location in employeeLocations) {
              employeeLocations[analytic.Location].scoreSum +=
                analytic.hxScore * (analytic.scoreWeight * analytic.applicationWeight);
              employeeLocations[analytic.Location].weightSum += analytic.scoreWeight * analytic.applicationWeight;
              employeeLocations[analytic.Location].durationSum += analytic.scoreWeight;
              employeeLocations[analytic.Location].appWeightSum += analytic.applicationWeight;
              employeeLocations[analytic.Location].maxDuration = Math.max(
                employeeLocations[analytic.Location].maxDuration,
                analytic.scoreWeight
              );

              employeeLocations[analytic.Location].locations.push(location);
            } else {
              // if location not found on employee, create it
              employeeLocations[analytic.Location] = {
                hxScore: analytic.hxScore ?? 0,
                scoreSum: analytic.hxScore * (analytic.scoreWeight * analytic.applicationWeight),
                weightSum: analytic.scoreWeight * analytic.applicationWeight,
                durationSum: analytic.scoreWeight,
                maxDuration: analytic.scoreWeight,
                appWeightSum: analytic.applicationWeight,
                locations: [location],
              };
            }
          }
        });

        // loop locations and apply weighted mean to score
        Object.values(employeeLocations).forEach((location) => {
          if (location.scoreSum && location.weightSum) {
            location.hxScore = location.scoreSum / location.weightSum;
          } else {
            location.hxScore = 0;
          }
        });

        const employee: Employee = {
          User: userId,
          employeeQualityScore,
          employeePotentialScore,
          employeeScoreDelta,
          employeeHxScore,
          employeeScoreWeight,
          analytics: perUserIdAnalytics as AnalyticData[],
          locations: employeeLocations,
          ...terms,
        };

        //Set the data in the map
        safeMutator(employeeData, userId, employee);
      }
    }

    i += 1;
  }

  //remove duplicates from custom filters here.
  for (const termType of Object.keys(termsAndValues)) {
    for (const termKeys of Object.keys(termsAndValues[termType])) {
      termsAndValues[termType][termKeys] = [...new Set(termsAndValues[termType][termKeys]?.filter(Boolean))];
    }
  }

  return { employeeData, termsAndValues, valuesSearchLists };
};

/**
 * calculatePercentageDailyWastedTime
 *
 * combine wasted times for multiple analytics to produce a single wasted time for an employee,
 * use the combined weights obtained by multiplying score duration by the normalised app weighting: (D_i * WN_i)
 * then sum everything up and then apply the overarching “daily digital percentage” value provided
 *
 * daily_digital_percentage * sum(D_i * WN_i * wasted_time_i) / sum(D_i * WN_i)
 *
 * where wasted_time_i is calculated as the opposite of usable_time_i, which in turn is
 * 100 * (1 - (80 - pq_score_i) / 80)
 *
 * @param employeeAnalytics - AnalyticData[]
 * @param dailyDigitalPercentage - input assumption
 * @returns number
 */
export const calculatePercentageDailyWastedTime = (
  employeeAnalytics: AnalyticData[],
  dailyDigitalPercentage: number
): number => {
  const { wastedTimeSum, weightedSum } = employeeAnalytics.reduce(
    (
      { wastedTimeSum, weightedSum }: { wastedTimeSum: number; weightedSum: number },
      { meanScore, scoreWeight, applicationWeight }: AnalyticData
    ) => {
      // determine usable time, then flip it to create wasted time
      const usableTime = 100 * (1 - (80 - meanScore) / 80); // 80 is the "constant" upper limit
      const analyticUsableTime = Math.max(0, Math.min(100, usableTime)); // set 0 & 100 as boundaries for usable time
      const analyticWastedTime = 100 - analyticUsableTime;

      return {
        wastedTimeSum: wastedTimeSum + scoreWeight * applicationWeight * analyticWastedTime,
        weightedSum: weightedSum + scoreWeight * applicationWeight,
      };
    },
    { wastedTimeSum: 0, weightedSum: 0 }
  );

  // note this is really a proportion of wasted time, not a percentage now
  const percentageDailyWastedTime = dailyDigitalPercentage * (wastedTimeSum / (weightedSum || 1));

  return percentageDailyWastedTime / 100;
};

/**
 * calculateValuesPerEmployee
 *
 * Calculate values for each employee object
 *
 * @param employeeData - list of employee objects
 * @param inputAssumptions - input assumptions from settings page
 * @param personaTerm - current selected term
 * @returns
 */
export const calculateValuesPerEmployee = (
  employeeData: Employee[],
  inputAssumptions: InputAssumptions = {},
  personaTerm: PersonaTerm
) => {
  const { termType: personaTermType, value: personaTermName } = personaTerm;
  const returnData = [];
  let index = 0;

  while (employeeData && index < employeeData.length) {
    const employee = employeeData[index];

    const personaTermValue = (employee[personaTermType] as Record<string, string[]>)[personaTermName];
    const personaTermValueLength = personaTermValue.length;

    let dailyDigitalPercentage = 0;
    let minutesPerWorkingDay = 0;
    let payrollPerEmployee = 0;
    let revenuePerEmployee = 0;
    let settingsDailyDigitalPercentage = 0;

    //If this we only have one matching persona term on the employee (inside du or whatever)
    if (personaTermValueLength > 0) {
      const personaTermVal = personaTermValue[0];
      if (personaTermValueLength === 1 && inputAssumptions[personaTermVal]) {
        const termSettings = inputAssumptions[personaTermVal];

        if (!termSettings) {
          settingsDailyDigitalPercentage = 0;
          minutesPerWorkingDay = 0;
          payrollPerEmployee = 0;
          revenuePerEmployee = 0;
        } else {
          settingsDailyDigitalPercentage = termSettings.DAILY_DIGITAL_PERCENTAGE;

          minutesPerWorkingDay = termSettings.TIME_WORKED_PER_DAY;
          payrollPerEmployee = termSettings.PAYROLL_PER_EMPLOYEE;
          revenuePerEmployee = termSettings.REVENUE_PER_EMPLOYEE;
        }
      } else if (personaTermValueLength > 1) {
        // edge case - if we have more than one persona term value for an employee
        // then take the average settings for both terms
        // this can occur if a non-du term is used as a persona term (eg a du can be in many custom groups)
        // but is this a likely situation in real life?
        for (let p = 0; p < personaTermValue.length; p++) {
          if (inputAssumptions[personaTermValue[p]]) {
            const personaTermSettings = inputAssumptions[personaTermValue[p]];

            if (!personaTermSettings) {
              continue;
            }

            const personaDailyDigitalPercentage = personaTermSettings.DAILY_DIGITAL_PERCENTAGE;
            settingsDailyDigitalPercentage += personaDailyDigitalPercentage;
            minutesPerWorkingDay += personaTermSettings.TIME_WORKED_PER_DAY;
            payrollPerEmployee += personaTermSettings.PAYROLL_PER_EMPLOYEE;
            revenuePerEmployee += personaTermSettings.REVENUE_PER_EMPLOYEE;
          }
        }
        settingsDailyDigitalPercentage /= personaTermValueLength;
        minutesPerWorkingDay /= personaTermValueLength;
        payrollPerEmployee /= personaTermValueLength;
        revenuePerEmployee /= personaTermValueLength;
      }

      dailyDigitalPercentage = settingsDailyDigitalPercentage / 100;
    }

    employee.employeePercentageDailyWastedTime = calculatePercentageDailyWastedTime(
      employee.analytics,
      dailyDigitalPercentage
    );

    employee.employeeDailyWastedMinutes = employee.employeePercentageDailyWastedTime * minutesPerWorkingDay;

    employee.employeeOperationalLoss = employee.employeePercentageDailyWastedTime * payrollPerEmployee;

    employee.employeeRevenueLoss = employee.employeePercentageDailyWastedTime * revenuePerEmployee;

    returnData.push(employee);

    index += 1;
  }

  return returnData;
};

/**
 * calculate HX score for all employees via a standard "one man one vote" mean
 *
 * @param employeeData Employee[]
 * @returns number
 */
export const calculateHxScoreForAllEmployees = (employeeData: Employee[]): number => {
  const hxScores = employeeData.reduce((p, v) => p + v.employeeHxScore, 0);

  if (Number.isNaN(hxScores)) {
    return 0;
  }

  return hxScores / (employeeData.length || 1);
};

export type HxScoreBoundings = {
  suffering: {
    employeeCount: number;
    countValues: {
      1: number;
      2: number;
      3: number;
      4: number;
    };
  };
  frustrated: {
    employeeCount: number;
    countValues: {
      5: number;
      6: number;
      7: number;
    };
  };
  satisfied: {
    employeeCount: number;
    countValues: {
      8: number;
      9: number;
      10: number;
    };
  };
};

/**
 * convert employee hx scores into a score boundings object
 *
 * @param employeeData Employee[]
 * @returns HxScoreBoundings
 */
export const calculateScoreBoundingsForAllEmployees = (employeeData: Employee[]) => {
  const buckets: HxScoreBoundings = {
    suffering: {
      employeeCount: 0,
      countValues: {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
      },
    },
    frustrated: {
      employeeCount: 0,
      countValues: {
        5: 0,
        6: 0,
        7: 0,
      },
    },
    satisfied: {
      employeeCount: 0,
      countValues: {
        8: 0,
        9: 0,
        10: 0,
      },
    },
  };

  // "brute force" logic to align with powerBI
  employeeData.forEach((employee) => {
    const score = round(employee.employeeHxScore, 12);

    if (score < 1) {
      console.warn('DU score < 1', employee.User);
      // 0-1
      buckets.suffering.countValues['1'] += 1;
      buckets.suffering.employeeCount += 1;
    } else if (score < 2) {
      // 1-2
      buckets.suffering.countValues['1'] += 1;
      buckets.suffering.employeeCount += 1;
    } else if (score < 3) {
      // 2-3
      buckets.suffering.countValues['2'] += 1;
      buckets.suffering.employeeCount += 1;
    } else if (score < 4) {
      // 3-4
      buckets.suffering.countValues['3'] += 1;
      buckets.suffering.employeeCount += 1;
    } else if (score < 5) {
      // 4-5
      buckets.suffering.countValues['4'] += 1;
      buckets.suffering.employeeCount += 1;
    } else if (score < 6) {
      // 4-5
      buckets.frustrated.countValues['5'] += 1;
      buckets.frustrated.employeeCount += 1;
    } else if (score < 7) {
      // 5-6
      buckets.frustrated.countValues['6'] += 1;
      buckets.frustrated.employeeCount += 1;
    } else if (score < 8) {
      // 6-7
      buckets.frustrated.countValues['7'] += 1;
      buckets.frustrated.employeeCount += 1;
    } else if (score < 9) {
      // 7-8
      buckets.satisfied.countValues['8'] += 1;
      buckets.satisfied.employeeCount += 1;
    } else if (score < 10) {
      // 8-9
      buckets.satisfied.countValues['9'] += 1;
      buckets.satisfied.employeeCount += 1;
    } else {
      // 10+
      buckets.satisfied.countValues['10'] += 1;
      buckets.satisfied.employeeCount += 1;
    }
  });

  return buckets;
};

/**
 * get the appropriate input assumption settings for an employee persona
 *
 * @param personaSettings PersonaSettings
 * @param employee Employee
 * @returns InputAssumption
 */
export const getEmployeePersonaSettings = (personaSettings: PersonaSettings, employee: Employee): InputAssumption => {
  const { termType, term } = personaSettings;
  const employeePersonaTypes = employee[termType] as Record<string, string[]>;
  const [employeePersona] = employeePersonaTypes[term];
  const settings = personaSettings.inputAssumptions[employeePersona];

  return settings;
};

/**
 * Get the list of DU IDs for a report
 * @param reportId string
 * @returns Promise<string[]> - list of du IDs for report
 */
export const getDuIdsForReport = async (reportId: string): Promise<string[]> => {
  try {
    const res = await queryDynamoTable(DU_TABLE, 'byReport', 'reportId', reportId);
    return res.Items?.map(({ id }) => id) ?? [];
  } catch (err) {
    console.log('COULD NOT GET DUS FOR REPORT', reportId);
    console.error(err);
    throw err;
  }
};

export const addEmployeesToDeleteQueue = async (duIds: string[]) => {
  const sqsClient = new SQSClient({ region: aws.aws_project_region });
  const queueInput = { QueueName: DYNAMO_DELETE_QUEUE };
  const { QueueUrl: queueUrl } = await sqsClient.send(new GetQueueUrlCommand(queueInput));

  if (queueUrl) {
    for (const id of duIds) {
      const message = {
        MessageBody: JSON.stringify({
          type: DU,
          id,
        }),
        QueueUrl: queueUrl,
      };

      console.log('ADDING DU TO DELETE QUEUE', id);

      await sqsClient.send(new SendMessageCommand(message));
    }
  }
};

const getLocationTypeForEmployee = (employee: Employee): LocationType => {
  if (employee.hybrid) {
    return LocationType.HYBRID;
  }

  if (employee.office) {
    return LocationType.OFFICE;
  }

  if (employee.remote) {
    return LocationType.REMOTE;
  }

  // :shrug:
  return LocationType.HYBRID;
};

export const addEmployeesToQueue = async (
  employees: Employee[],
  projects: Project[],
  hydratedProjects: HydratedProject[],
  reportId: string,
  orgId: string,
  personaTerm: PersonaTerm,
  inputLocations: Set<string>,
  parseId: string
): Promise<void> => {
  // when we add employees to dynamo, set them to expire in 7 days
  // we will remove the ttl when the report is published. this way we
  // don't have orphaned employees persisting in the database if report
  // preview is abandoned.
  const nextWeek = Math.floor(Date.now() / 1000 + 24 * 60 * 60 * 7);

  //map the employees into storable objects
  const dbEntries = employees.map((employee) => {
    // get the most visited office and grab its name & score
    const office = Object.entries(employee.locations).reduce(
      (acc, [place, { maxDuration, hxScore }]) => {
        if (place !== 'remote') {
          if (Math.max(maxDuration, acc.maxDuration) === maxDuration) {
            acc = { key: place, name: getInputOfficeName(place, inputLocations), maxDuration, hxScore };
          }
        }

        return acc;
      },
      { key: '', name: '', maxDuration: 0, hxScore: 0 }
    );

    // use the original DU name rather than the toLowerCase'd one
    const duProps = employee.du as Record<string, string[]>;
    const name = duProps.__displayName?.[0] ?? duProps._id[0];

    return {
      ...getMeta(new Date(), DU),
      _ttl: nextWeek,
      id: v4(),
      reportId,
      reportDusId: reportId,
      name,
      context: orgId,
      hxScore: employee.employeeHxScore,
      persona: (employee[personaTerm.termType] as Record<string, string[]>)[personaTerm.value][0],
      timeLost: employee.employeeDailyWastedMinutes,
      payroll: employee.employeeOperationalLoss,
      revenue: employee.employeeRevenueLoss,
      locationType: getLocationTypeForEmployee(employee),
      hybridPercent: employee.hybridPercent,
      country: employee.analytics[0].Country || null,
      office: office.name || null,
      officeHx: office.hxScore,
      remoteHx: employee.locations.remote?.hxScore || null,
      applications: Array.from(new Set(employee.analytics.map((analytic) => analytic['Target Name']))),
      analytics: employee.analytics,
      locations: employee.locations,
      projects: projects
        .filter(
          ({ projectId }) =>
            projectId &&
            hydratedProjects
              .filter((p) => p.dus.find((em) => em.User === employee.User))
              .map(({ projectId }) => projectId)
              .indexOf(projectId) > -1
        )
        .map(({ id }) => id),
    };
  });

  // write total number of DUs to parse table
  await updateTableRecord({
    table: PARSE_TABLE,
    id: parseId,
    expressionAttributeNames: { '#expectedDus': 'expectedDus', '#processedDus': 'processedDus' },
    expressionAttributeValues: { ':expectedDus': dbEntries.length, ':processedDus': 0 },
    updateExpression: 'SET #expectedDus = :expectedDus, #processedDus = :processedDus',
  });

  const sqsClient = new SQSClient({ region: aws.aws_project_region });
  const queueInput = { QueueName: DU_DDB_QUEUE };
  const { QueueUrl: queueUrl } = await sqsClient.send(new GetQueueUrlCommand(queueInput));

  if (queueUrl) {
    while (dbEntries.length) {
      const messageEntries = dbEntries.splice(0, 20);

      const message = {
        MessageBody: JSON.stringify({
          parseId,
          entries: messageEntries,
        }),
        QueueUrl: queueUrl,
      };

      console.log(
        'ADDING EMPLOYEES TO QUEUE',
        messageEntries.map((en) => en.name)
      );

      await sqsClient.send(new SendMessageCommand(message));
    }
  }
};
