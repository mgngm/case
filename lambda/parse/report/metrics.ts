/* eslint-disable no-relative-import-paths/no-relative-import-paths */
import type crossfilter from 'crossfilter2';
import type { HxScoreBoundings } from 'lambda/parse/report/employee';
import { calculateScoreBoundingsForAllEmployees } from 'lambda/parse/report/employee';
import { round } from 'lambda/shared/helpers';
import type { Employee, EmployeeAverages, HxScoreDistribution } from 'src/types/csv';
import {
  CO2_SAVINGS_PER_MONTH,
  EQUALITY_BOUNDARIES,
  EQUALITY_GRADE_A,
  EQUALITY_GRADE_B,
  EQUALITY_GRADE_C,
  EQUALITY_GRADE_D,
  EQUALITY_GRADE_E,
} from './constants';

// this was used extensively in reporting, abstracted to a function to
// make linting easier
// TODO: do we still need to detect -0?
function isNegativeZero(value: number) {
  return Object.is(value, -0);
}

/**
 * Calculates wellbeing percentage for all employees
 *
 * @param hxGroup - crossfilter group for hx bandings
 * @returns { value: number; delta: number; }
 */
export const getWellbeingMetric = (
  hxGroup: crossfilter.Group<Employee, crossfilter.NaturallyOrderedValue, EmployeeAverages>
) => {
  // get just the suffering employees
  const hxGroupBandings = hxGroup.order((p) => p.employeeHxScoreSum).all();
  const suffering = hxGroupBandings.filter((p) => p.key === 'suffering').pop();
  const total = hxGroupBandings.reduce((count, band) => count + band.value.count, 0);

  // if we have a selection
  if (suffering && suffering.value.count) {
    // calculate the total wellbeing percent
    const value = (suffering.value.count / (total || 1)) * 100;
    return { value, delta: 0 };
  }

  return { value: 0, delta: 0 };
};

/**
 * gets the percentage of employees with negligible issues and the scalar
 * between them and the rest, eg:
 *
 * Your most adversely affected employees are losing a disproportionately
 * large amount of time (almost ${scalar} times more) than your top ${topPercent}%.
 *
 * @param hxGroup - crossfilter group for hx bandings
 * @returns { topPercent: number; scalar: number; }
 */
export const getWellbeingDifferentialMetric = (
  hxGroup: crossfilter.Group<Employee, crossfilter.NaturallyOrderedValue, EmployeeAverages>
) => {
  const hxGroupBandings = hxGroup.order((p) => p.employeeHxScoreSum).all();
  const suffering = hxGroupBandings.filter((p) => p.key === 'suffering').pop();
  const satisfied = hxGroupBandings.filter((p) => p.key === 'satisfied').pop();
  const total = hxGroupBandings.reduce((count, band) => count + band.value.count, 0);

  if (suffering && suffering.value.count && satisfied && satisfied.value.count) {
    const sufferingTimeLost = suffering.value.employeeDailyWastedMinutesMean;
    const satisfiedTimeLost = satisfied.value.employeeDailyWastedMinutesMean;

    // top percent is the percentage of employees who are satisfied
    const topPercent = (satisfied.value.count / (total || 1)) * 100;

    // determine the scalar value
    const timeDiff = sufferingTimeLost / (satisfiedTimeLost || 1);

    return { topPercent, scalar: round(timeDiff, 2) };
  }

  return { topPercent: 0, scalar: 0 };
};

/**
 * Calculates efficiency value across all employees
 *
 * @param totalGroup - totals crossfilter group
 * @returns { value: number; delta: number; }
 */
export const getEfficiencyMetric = (
  totalGroup: crossfilter.Group<Employee, crossfilter.NaturallyOrderedValue, EmployeeAverages>
) => {
  const totals = totalGroup
    .order((p) => p.employeeDailyWastedMinutesMean)
    .top(1)
    .pop();

  const wastedDays = totals?.value.employeeWastedDaysMean ?? 0;

  if (isNegativeZero(wastedDays)) {
    return { value: 0, delta: 0 };
  }

  return { value: wastedDays, delta: 0 };
};

/**
 * Get the revenue cost across all employees
 *
 * @param totalGroup - total crossfilter group
 * @returns { value: number; delta: number; }
 */
export const getRevenueMetric = (
  totalGroup: crossfilter.Group<Employee, crossfilter.NaturallyOrderedValue, EmployeeAverages>
) => {
  const totals = totalGroup
    .order((p) => p.employeeRevenueLossMean)
    .top(1)
    .pop();

  let value = Math.round((totals?.value.employeeRevenueLossMean ?? 0) * (totals?.value.count ?? 0));

  if (isNegativeZero(value)) {
    value = 0;
  }
  return { value, delta: 0 };
};

/**
 * Get the wasted payroll value across all employees
 *
 * @param totalGroup - total crossfilter group
 * @returns { value: number; delta: number; }
 */
export const getPayrollMetric = (
  totalGroup: crossfilter.Group<Employee, crossfilter.NaturallyOrderedValue, EmployeeAverages>
) => {
  const totals = totalGroup
    .order((p) => p.employeeDailyWastedMinutesMean)
    .top(1)
    .pop();
  let value = Math.round((totals?.value.employeeOperationalLossMean ?? 0) * (totals?.value.count ?? 0));

  if (isNegativeZero(value)) {
    value = 0;
  }
  return { value, delta: 0 };
};

/**
 * Calculate a Gini coefficient based on HX score distribution as a
 * measure of "digital wealth" to provide a measure of equality amoung
 * employees of digital experience
 *
 * @link https://en.wikipedia.org/wiki/Gini_coefficient
 * @description https://docs.google.com/document/d/1syvSW2AJAfZvFFDLuuhsQuucXdMs57e-nlfJfEBEZdo/edit (restricted until approved by Prof)
 *
 * @param distribution HxScoreDistribution
 * @returns Gini Coefficient - number
 */
export const calculateGiniCoefficient = (distribution: HxScoreDistribution) => {
  // reusable sum function
  const sum = (vals: number[]) => vals.reduce((p, v) => p + v, 0);

  // map distribution into ten integer hx score buckets [1, 2, ..., 10]
  const x = Object.keys(distribution).map((x) => Number(x));

  // map distribution into array of frequencies
  const counts = Object.values(distribution);

  // calculate gini coefficient:

  const n = sum(counts);
  const m = x.length;

  const denominator = 2 * n * sum(counts.map((v, idx) => v * x[idx]));

  let outerSum = 0;

  for (let i = 0; i < m; i += 1) {
    let innerSum = 0;

    for (let j = 0; j < m; j += 1) {
      innerSum += counts[j] * Math.abs(i - j);
    }

    outerSum += counts[i] * innerSum;
  }

  return outerSum / denominator;
};

/**
 * map Gini coefficient value to a equality grade
 * based on hard-coded grade boundaries
 *
 * @description https://docs.google.com/document/d/1syvSW2AJAfZvFFDLuuhsQuucXdMs57e-nlfJfEBEZdo/edit (restricted until approved by Prof)
 * @param gini number
 * @returns string
 */
const getEqualityGrade = (gini: number) => {
  if (gini <= EQUALITY_BOUNDARIES[0]) {
    return EQUALITY_GRADE_A;
  } else if (gini <= EQUALITY_BOUNDARIES[1]) {
    return EQUALITY_GRADE_B;
  } else if (gini <= EQUALITY_BOUNDARIES[2]) {
    return EQUALITY_GRADE_C;
  } else if (gini <= EQUALITY_BOUNDARIES[3]) {
    return EQUALITY_GRADE_D;
  } else {
    return EQUALITY_GRADE_E;
  }
};

/**
 * Get the equality score across all employees
 *
 * @param scoreBoundings HxScoreBoundings
 * @returns { value: string; delta: number; }
 */
export const getEqualityMetric = (scoreBoundings: HxScoreBoundings) => {
  // map score boundings to a distribution object
  const distribution: HxScoreDistribution = {
    1: scoreBoundings.suffering.countValues[1],
    2: scoreBoundings.suffering.countValues[2],
    3: scoreBoundings.suffering.countValues[3],
    4: scoreBoundings.suffering.countValues[4],
    5: scoreBoundings.frustrated.countValues[5],
    6: scoreBoundings.frustrated.countValues[6],
    7: scoreBoundings.frustrated.countValues[7],
    8: scoreBoundings.satisfied.countValues[8],
    9: scoreBoundings.satisfied.countValues[9],
    10: scoreBoundings.satisfied.countValues[10],
  };

  const gini = calculateGiniCoefficient(distribution);
  const value = getEqualityGrade(gini);

  // helpful debugging for Prof
  console.log('hx distribution', distribution);
  console.log('gini coefficient', gini);
  console.log('grade', value);

  return { value, delta: 0 };
};

/**
 * calculate the wasted CO2 for a given amount of time in the office per month
 *
 * @param officeDuration number
 * @param remoteDuration number
 * @param employeeCount number
 * @returns number
 */
export const calculateEnvironmentMetric = (
  officeDuration: number,
  remoteDuration: number,
  employeeCount: number
): number => {
  const totalDuration = officeDuration + remoteDuration;
  const officeProportion = officeDuration / (totalDuration || 1);
  const workingDaysPerMonth = 20;

  return CO2_SAVINGS_PER_MONTH * employeeCount * workingDaysPerMonth * officeProportion;
};

/**
 * get the wasted CO2 across all employees
 *
 * @param totalGroup - total crossfilter group
 * @returns { value: number; delta: number; }
 */
export const getEnvironmentMetric = (
  hxGroup: crossfilter.Group<Employee, crossfilter.NaturallyOrderedValue, Record<string, number>>
) => {
  const hxGroupBandings = hxGroup.order((p) => p.employeeHxScoreSum).all();
  const suffering = hxGroupBandings.filter((p) => p.key === 'suffering').pop();

  // get the days per month these suffering employees have been in the office for CO2 reduction
  const officeDuration = suffering?.value.employeeOfficeDuration ?? 0;
  const remoteDuration = suffering?.value.employeeRemoteDuration ?? 0;

  const kg = calculateEnvironmentMetric(officeDuration, remoteDuration, suffering?.value.count ?? 0);

  return { value: kg, delta: 0 };
};

/**
 * get the average number of days lost for all employees
 *
 * @param totalGroup - total crossfilter group
 * @returns number
 */
export const getAverageDaysLostMetric = (
  totalGroup: crossfilter.Group<Employee, crossfilter.NaturallyOrderedValue, EmployeeAverages>
) => {
  const totals = totalGroup
    .order((p) => p.employeeDailyWastedMinutesMean)
    .top(1)
    .pop();
  const wastedDays = totals?.value.employeeWastedDaysMean ?? 0;

  return wastedDays;
};

export const getBusinessEfficiencyMetric = (
  hxGroup: crossfilter.Group<Employee, crossfilter.NaturallyOrderedValue, EmployeeAverages>
) => {
  const hxGroups = hxGroup.all();

  const metrics: Record<string, number> = {};

  hxGroups.forEach(({ key, value }) => {
    metrics[key as string] = value.employeeWastedDaysMean;
  });

  return metrics;
};

export const getSufferingMetrics = (
  hxGroup: crossfilter.Group<Employee, crossfilter.NaturallyOrderedValue, EmployeeAverages>
) => {
  // get just the suffering employees
  const suffering = hxGroup
    .order((p) => p.employeeHxScoreSum)
    .top(3)
    .filter((p) => p.key === 'suffering')
    .pop();

  if (suffering) {
    const payroll = (suffering?.value.employeeOperationalLossMean ?? 0) * (suffering?.value.count ?? 0);

    const revenue = (suffering?.value.employeeRevenueLossMean ?? 0) * (suffering?.value.count ?? 0);

    return { payroll, revenue };
  }

  return { payroll: 0, revenue: 0 };
};

/**
 * Get average payroll lost, revenue and CO2 wasted for suffering employees
 *
 * @param hxGroup - hx score crossfilter group
 * @returns { payroll: number; revenue: number; environment: number }
 */
export const getSufferingAverages = (
  hxGroup: crossfilter.Group<Employee, crossfilter.NaturallyOrderedValue, EmployeeAverages>
) => {
  // get just the suffering employees
  const suffering = hxGroup
    .order((p) => p.employeeHxScoreSum)
    .top(3)
    .filter((p) => p.key === 'suffering')
    .pop();

  if (suffering) {
    const wastedDays = (suffering.value.employeeWastedDaysSum || 0) / (suffering.value.count || 1);

    const payroll = (suffering.value.employeeOperationalLossSum || 0) / (suffering.value.count || 1);

    const revenue = (suffering.value.employeeRevenueLossSum || 0) / (suffering.value.count || 1);

    // get the days per month these suffering employees have been in the office for CO2 reduction
    const officeDuration = suffering?.value.employeeOfficeDuration || 0;
    const remoteDuration = suffering?.value.employeeRemoteDuration || 0;

    const environment =
      calculateEnvironmentMetric(officeDuration, remoteDuration, suffering.value.count || 0) /
      (suffering.value.count || 1); // in kg

    return { payroll, revenue, environment, wastedDays };
  }

  return { payroll: 0, revenue: 0, environment: 0, wastedDays: 0 };
};
