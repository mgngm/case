/* eslint-disable no-relative-import-paths/no-relative-import-paths */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { calculatePercentage, constructValueDisplayString } from 'lambda/shared/helpers';
import type {
  AnalyticData,
  Employee,
  InputAssumptions,
  Levers,
  Locations,
  OrgProperties,
  ParsedAnalyticData,
  PersonaSettings,
  PersonaTerm,
} from 'src/types/csv';
import type { DashboardData } from 'src/types/slices';
import { calculateValuesPerAnalytic } from './analytics';
import {
  getBusinessEfficiencyChartData,
  getPayrollChartData,
  getRevenueChartData,
  getWellbeingChartData,
  buildWorstOfficeChartData,
} from './chart-data';
import { CO2_REDUCTION_LABEL, DEFAULT_CURRENCY } from './constants';
import { createCrossfilterGroups } from './crossfilter';
import {
  calculateScoreBoundingsForAllEmployees,
  calculateHxScoreForAllEmployees,
  calculatePerEmployeeAveragesAndTermsAndGenerateCustomDimensions,
  calculateValuesPerEmployee,
} from './employee';
import { calculateScoresPerLocation } from './locations';
import {
  getAverageDaysLostMetric,
  getEfficiencyMetric,
  getEqualityMetric,
  getPayrollMetric,
  getRevenueMetric,
  getSufferingAverages,
  getWellbeingDifferentialMetric,
  getWellbeingMetric,
  getSufferingMetrics,
  getBusinessEfficiencyMetric,
  getEnvironmentMetric,
} from './metrics';
import { buildPersonaHybridBreakdown, buildPersonaWorkingLocations } from './persona';

/**
 * parseAnalyticData
 *
 * parses the analytic data from the csv
 *
 * @param data - data to be parsed
 * @param inputAssumptions - user-defined assumptions from settings
 * @param orgProperties - organisation properties from the AC
 * @returns object
 * @throws parsing error
 */
export const parseAnalyticData = (
  data: AnalyticData[],
  inputAssumptions: InputAssumptions,
  orgProperties: OrgProperties,
  personaTerm: PersonaTerm,
  levers: Levers
): ParsedAnalyticData => {
  // check we have data
  if (!data || !Array.isArray(data)) {
    throw new Error('Parse error: invalid input data');
  }

  if (data.length === 0) {
    throw new Error('Parse error: no data to parse');
  }

  try {
    // we continually update the parsedData, so initialise it with passed data
    // and update with the results of each calculate* function
    let analyticData: any = [...data];
    // calculate values for each analytic, and get a list of unique userIds at the same time (efficiency! *finger guns*)
    const { userIdsFromAnalytics, employeeAnalyticObject } = calculateValuesPerAnalytic(analyticData);

    analyticData = null;

    if (!userIdsFromAnalytics?.length) {
      throw new Error('Parse error: cannot derive userIds from analytics');
    }

    // calculate average for each user ID (employee) and the terms for the employees
    const { employeeData, termsAndValues, valuesSearchLists } =
      calculatePerEmployeeAveragesAndTermsAndGenerateCustomDimensions(
        employeeAnalyticObject,
        userIdsFromAnalytics,
        orgProperties,
        personaTerm,
        inputAssumptions
      );

    if (!Object.keys(employeeData)?.length) {
      throw new Error('Parse error: no employee data available');
    }

    //From now on we don't need the employeeData keyed by ID so we can convert it to an array
    let employeeDataArray = Object.values(employeeData);

    // calculate employee numbers
    employeeDataArray = calculateValuesPerEmployee(employeeDataArray, inputAssumptions, personaTerm);

    // calculate scores per location
    const locations = calculateScoresPerLocation(employeeDataArray, levers, personaTerm);

    return {
      userIdsFromAnalytics,
      employeeData: employeeDataArray,
      termsAndValues,
      valuesSearchLists,
      locations,
      personaTerm,
    };
  } catch (error) {
    console.error('parse failed', error);
    throw error;
  }
};

/**
 * Convert employee data and location data into the s3-equivalent json
 *
 * (needs a better function name...)
 *
 * @param employeeData Employee[]
 * @param locations Locations
 * @param organisation string
 * @returns DashboardData without blockData and metrics
 */
export const buildReportData = (
  employeeData: Employee[],
  locations: Locations,
  organisation: string,
  personaSettings: PersonaSettings,
  levers: Levers,
  inputLocations: Set<string>,
  keySites: string[] = [],
  upgrading: string[] = []
) => {
  const {
    totalGroup,
    hxGroup,
    wellbeingChartGroup,
    payrollChartGroup,
    revenueChartGroup,
    businessEfficiencyChartGroup,
  } = createCrossfilterGroups(employeeData, personaSettings, levers);

  const wellbeingChartData = getWellbeingChartData(wellbeingChartGroup);
  const { chartData: revenueChartData, tooltipData: revenueChartTooltip } = getRevenueChartData(revenueChartGroup);
  const { chartData: payrollChartData, tooltipData: payrollChartTooltip } = getPayrollChartData(payrollChartGroup);
  const { chartData: businessChartData, tooltipData: businessChartTooltip } =
    getBusinessEfficiencyChartData(businessEfficiencyChartGroup);

  const scoreBoundings = calculateScoreBoundingsForAllEmployees(employeeData);

  const efficiency = getEfficiencyMetric(totalGroup);
  const equality = getEqualityMetric(scoreBoundings);
  const payroll = getPayrollMetric(totalGroup);
  const revenue = getRevenueMetric(totalGroup);
  const businessMetrics = getBusinessEfficiencyMetric(hxGroup);
  const wellbeing = getWellbeingMetric(hxGroup);
  const wellbeingVars = getWellbeingDifferentialMetric(hxGroup);
  const averageDays = getAverageDaysLostMetric(totalGroup);

  const sufferingAverages = getSufferingAverages(hxGroup);
  const sufferingMetrics = getSufferingMetrics(hxGroup);
  const environment = getEnvironmentMetric(hxGroup);

  const currency = DEFAULT_CURRENCY;

  const json: DashboardData = {
    organisation,
    hxScore: { value: calculateHxScoreForAllEmployees(employeeData), delta: 0 },
    employees: {
      total: employeeData.length,
      home: locations.all.remote.count,
      office: locations.all.office.count,
      hybrid: locations.all.hybrid.count,
      hybridBreakdown: locations.all.hybrid.hybridBreakdown,
      levers: {
        hybridLower: levers.hybridLower,
        hybridUpper: levers.hybridUpper,
      },
      personas: buildPersonaHybridBreakdown(locations.personas),
    },
    scores: scoreBoundings,
    workingLocations: {
      office: {
        score: locations.all.office.hxScore,
        percentages: {
          suffering: calculatePercentage(
            locations.all.office.scoreCounts.suffering,
            locations.all.office.scoreCounts.total,
            false
          ),
          frustrated: calculatePercentage(
            locations.all.office.scoreCounts.frustrated,
            locations.all.office.scoreCounts.total,
            false
          ),
          satisfied: calculatePercentage(
            locations.all.office.scoreCounts.satisfied,
            locations.all.office.scoreCounts.total,
            false
          ),
        },
      },
      home: {
        score: locations.all.remote.hxScore,
        percentages: {
          suffering: calculatePercentage(
            locations.all.remote.scoreCounts.suffering,
            locations.all.remote.scoreCounts.total,
            false
          ),
          frustrated: calculatePercentage(
            locations.all.remote.scoreCounts.frustrated,
            locations.all.remote.scoreCounts.total,
            false
          ),
          satisfied: calculatePercentage(
            locations.all.remote.scoreCounts.satisfied,
            locations.all.remote.scoreCounts.total,
            false
          ),
        },
      },
      personas: buildPersonaWorkingLocations(locations.personas),
    },
    metrics: {
      currency,
      efficiency,
      equality,
      payroll,
      revenue,
      wellbeing,
    },
    worstOffices: buildWorstOfficeChartData(locations.offices, inputLocations, keySites, upgrading),
    blockData: {
      wellbeingBlockData: {
        title: 'Wellbeing',
        subtitle: `${constructValueDisplayString(
          wellbeing.value ?? 0
        )}% of your workforce struggle significantly to do their day to day jobs due to the experience they have with your digital workplace`,
        text: [
          'This group are having a continuously frustrating experience in the digital workplace, with constant issues using applications and carrying out basic tasks. The employees in this group lose a significant amount of working time due to waiting on the digital ecosystem.',
          `Your most adversely affected employees are losing a disproportionately large amount of time (almost ${constructValueDisplayString(
            wellbeingVars?.scalar ?? ''
          )} times more) than your top ${constructValueDisplayString(wellbeingVars?.topPercent ?? '0')}%.`,
        ],
        metrics: {
          averageDaysLost: {
            suffix: 'Days',
            value: averageDays ?? 0,
          },
          payrollLost: {
            prefix: currency,
            value: sufferingMetrics.payroll ?? 0,
          },
          revenueOpportunity: {
            prefix: currency,
            value: sufferingMetrics.revenue ?? 0,
          },
          carbonReduction: {
            suffix: 'kg',
            value: environment.value ?? 0,
          },
        },
        table: {
          title: 'Average per employee',
          rows: [
            { label: 'Payroll Lost', value: sufferingAverages.payroll, prefix: currency },
            { label: 'Revenue Opportunity', value: sufferingAverages.revenue, prefix: currency },
            {
              label: CO2_REDUCTION_LABEL,
              value: sufferingAverages.environment ?? 0,
              suffix: 'kg',
            },
          ],
        },
        chartData: wellbeingChartData,
      },
      payrollBlockData: {
        title: 'Payroll',
        subtitle: 'Understand the financial impact of your digital friction',
        text: [
          'Calculated using wasted time per employee across a working year, combined with average payroll by department and location',
        ],
        metrics: {
          opportunity: {
            prefix: currency,
            value: payroll.value ?? 0,
          },
          averageOpportunity: {
            prefix: currency,
            value: payroll.value / (employeeData.length || 1) ?? 0,
          },
        },
        chartData: payrollChartData,
        chartTooltip: payrollChartTooltip,
      },
      revenueBlockData: {
        title: 'Revenue Opportunity',
        subtitle:
          "The revenue generation potential your business has if your digital world worked properly and didn't reduce productive employee time",
        text: [
          'Calculated using wasted time per employee across a working year, combined with average annual revenue generation by department in the business',
        ],
        metrics: {
          opportunity: {
            prefix: currency,
            value: revenue.value ?? 0,
          },
          averageOpportunity: {
            prefix: currency,
            value: revenue.value / (employeeData.length || 1) ?? 0,
          },
        },
        chartData: revenueChartData,
        chartTooltip: revenueChartTooltip,
      },
      businessBlockData: {
        title: 'Business Efficiency',
        subtitle: 'The average time lost per employee each year while they wait for the digital world to work properly',
        text: ['Calculated using wasted time per employee across a working year'],
        metrics: {
          averageDaysLost: {
            value: averageDays ?? 0,
            suffix: ' Days',
          },
          suffering: {
            value: businessMetrics.suffering ?? 0,
            suffix: ' Days',
          },
          frustrated: {
            value: businessMetrics.frustrated ?? 0,
            suffix: ' Days',
          },
          satisfied: {
            value: businessMetrics.satisfied ?? 0,
            suffix: ' Days',
          },
          personaTerm: {
            value: personaSettings.term,
          },
        },
        chartData: businessChartData,
        chartTooltip: businessChartTooltip,
      },
    },
  };

  return json;
};
