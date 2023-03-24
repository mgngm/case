import type crossfilter from 'crossfilter2';
import type { Employee, EmployeeAverages, ParsedLocation } from 'src/types/csv';
import type { ChartTooltip } from 'src/types/slices';
import { SUFFERING_GROUP_FILTER, UNKNOWN_TERM_CATEGORY } from './constants';

/**
 * gets the chart data for the wellbeing content block
 *
 * @param wellbeingChartGroup - wellbeing chart crossfilter group
 * @returns wasted days mapped to employee count
 */
export const getWellbeingChartData = (
  wellbeingChartGroup: crossfilter.Group<Employee, crossfilter.NaturallyOrderedValue, EmployeeAverages>
) => {
  const emptyData = Object.fromEntries(Array.from({ length: 32 }, (v, i) => [i, 0]));

  const wellbeingChart = wellbeingChartGroup
    .order((p) => p.employeeWastedDaysMean)
    .top(Infinity)
    .filter((p) => p.key !== SUFFERING_GROUP_FILTER) // remove non-suffering scores
    .map((p) => ({ days: p.key as number, count: p.value.count }));

  if (wellbeingChart.length > 0) {
    const chartData = emptyData;

    // add counts to chart data
    wellbeingChart.forEach((p) => {
      chartData[p.days] = p.count;
    });

    return chartData;
  }

  return emptyData;
};

export const getPayrollChartData = (
  payrollChartGroup: crossfilter.Group<Employee, crossfilter.NaturallyOrderedValue, EmployeeAverages>
) => {
  const chartData: Record<string, number> = {};
  const tooltipData: Record<string, ChartTooltip> = {};

  payrollChartGroup.top(Infinity).forEach(({ key, value }) => {
    chartData[key as string] = value.employeeOperationalLossMean;
    tooltipData[key as string] = {
      employees: value.count,
    };
  });
  return { chartData, tooltipData };
};

export const getRevenueChartData = (
  revenueChartGroup: crossfilter.Group<Employee, crossfilter.NaturallyOrderedValue, EmployeeAverages>
) => {
  const chartData: Record<string, number> = {};
  const tooltipData: Record<string, ChartTooltip> = {};

  revenueChartGroup.all().forEach(({ key, value }) => {
    if (key !== UNKNOWN_TERM_CATEGORY) {
      chartData[key as string] = value.employeeRevenueLossMean;
      tooltipData[key as string] = {
        label: key as string,
        mean: value.employeeOperationalLossMean,
        employees: value.count,
        wastedMinutes: value.employeeDailyWastedMinutesMean,
      };
    }
  });

  return { chartData, tooltipData };
};

export const getBusinessEfficiencyChartData = (
  businessChartGroup: crossfilter.Group<Employee, crossfilter.NaturallyOrderedValue, EmployeeAverages>
) => {
  const chartData: Record<string, number> = {};
  const tooltipData: Record<string, ChartTooltip> = {};

  businessChartGroup.all().forEach(({ key, value }) => {
    if (key !== UNKNOWN_TERM_CATEGORY) {
      const averageDaysLost = Math.round(value.employeeWastedDaysMean);
      const totalDaysLost = Math.round(value.employeeWastedDaysSum);

      chartData[key as string] = averageDaysLost;
      tooltipData[key as string] = {
        label: key as string,
        employees: value.count,
        wastedDays: totalDaysLost,
        mean: averageDaysLost,
      };
    }
  });

  return { chartData, tooltipData };
};

export const getInputOfficeName = (needle: string, inputs: Set<string>) => {
  for (const o of inputs) {
    if (needle === o.toLocaleLowerCase()) {
      return o;
    }
  }

  return needle;
};

export type WorstOfficeEntry = { hxScore: number; employeeCount: number };
export type WorstOfficesChart = Record<string, WorstOfficeEntry>;
export enum WorstOfficesChartType {
  Worst10 = 'Worst10',
  KeySites = 'KeySites',
  Upgrading = 'Upgrading',
}

export const buildWorstOfficeChartData = (
  officeLocations: Record<string, ParsedLocation>,
  inputLocations: Set<string>,
  keySitesInput: string[],
  upgradingInput: string[]
): Record<string, WorstOfficesChart> => {
  const all: WorstOfficesChart = {};
  const worst10: WorstOfficesChart = {};
  const keySites: WorstOfficesChart = {};
  const upgrading: WorstOfficesChart = {};

  // toLowerCase the input arrays
  const keySitesCheck = keySitesInput.map((s) => s.toLocaleLowerCase());
  const upgradingCheck = upgradingInput.map((s) => s.toLocaleLowerCase());

  // map offices into an array
  const offices = Object.entries(officeLocations).map(([office, locationData]) => ({ office, ...locationData }));

  // order by the worst hx score
  offices.sort((a, b) => a.hxScore - b.hxScore);

  offices.forEach((location, index) => {
    const { office, hxScore, count: employeeCount } = location;
    const officeName = getInputOfficeName(office, inputLocations);
    const officeLower = office.toLocaleLowerCase();

    const chartEntry: WorstOfficeEntry = { hxScore, employeeCount };

    // store all offices for picklist
    all[officeName] = chartEntry;

    // get the worst 10 (or max number of offices) and their scores & counts
    if (index < 10) {
      worst10[officeName] = chartEntry;
    }

    // check if office is a "key site"
    if (keySitesCheck.includes(officeLower)) {
      keySites[officeName] = chartEntry;
    }

    // check if office has been marked as "upgrading"
    if (upgradingCheck.includes(officeLower)) {
      upgrading[officeName] = chartEntry;
    }
  });

  return {
    all,
    [WorstOfficesChartType.Worst10]: worst10,
    [WorstOfficesChartType.KeySites]: keySites,
    [WorstOfficesChartType.Upgrading]: upgrading,
  };
};
