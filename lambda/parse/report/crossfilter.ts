import crossfilter from 'crossfilter2';
import type { Employee, EmployeeAverages, Levers, PersonaSettings, PersonaTerm } from 'src/types/csv';
import * as cfConstants from './constants';
import { getEmployeePersonaSettings } from './employee';

// used to check whether an employee value is NaN before adding
// the employee to the crossfilter group
const cfEmployeeKeys = [
  'employeePercentageDailyWastedTime',
  'employeeDailyWastedMinutes',
  'employeeOperationalLoss',
  'employeeRevenueLoss',
  'employeeQualityScore',
  'employeeScoreWeight',
  'employeeHxScore',
];

/**
 * Reduce function to add a new record to the chart dc state
 * @param {object} p - totals object
 * @param {object} v - new record to be added
 * @returns
 */
export const updateTotalGroupOnNewRecord =
  (personaSettings: PersonaSettings, levers: Levers) => (p: EmployeeAverages, v: Employee) => {
    // if any pertinent values are NaN for the employee, disregard it
    if (cfEmployeeKeys.some((k) => Number.isNaN(v[k]))) {
      return p;
    }

    const settings = getEmployeePersonaSettings(personaSettings, v);
    const timeWorkedPerDay = settings?.TIME_WORKED_PER_DAY ?? cfConstants.DEFAULT_TIME_WORKED_PER_DAY;

    p.count += 1;
    p.employeePercentageDailyWastedTimeSum += v.employeePercentageDailyWastedTime as number; // adding percentage daily wasted time value
    p.employeePercentageDailyWastedTimeMean = p.count ? p.employeePercentageDailyWastedTimeSum / p.count : 0;
    p.employeeDailyWastedMinutesSum += v.employeeDailyWastedMinutes as number; // adding daily wasted minutes value
    p.employeeDailyWastedMinutesMean = p.count ? p.employeeDailyWastedMinutesSum / p.count : 0;
    p.employeeWastedDaysSum += ((v.employeeDailyWastedMinutes as number) / timeWorkedPerDay) * levers.workingDays;
    p.employeeWastedDaysMean = p.count ? p.employeeWastedDaysSum / p.count : 0;
    p.employeeOperationalLossSum += v.employeeOperationalLoss as number; // adding operational loss
    p.employeeOperationalLossMean = p.count ? p.employeeOperationalLossSum / p.count : 0;
    p.employeeRevenueLossSum += v.employeeRevenueLoss as number; // adding revenue loss (opportunity)
    p.employeeRevenueLossMean = p.count ? p.employeeRevenueLossSum / p.count : 0;
    p.employeeQualityScoreSum += v.employeeQualityScore;
    p.employeeQualityScoreMean = p.count ? p.employeeQualityScoreSum / p.count : 0;
    p.logOfValue = p.count ? Math.log(p.count) / Math.log(10) : 0;

    p.employeeOfficeDuration += v.officeDuration as number;
    p.employeeRemoteDuration += v.remoteDuration as number;

    p.employeeHxScoreWeightSum += v.employeeScoreWeight;
    p.employeeHxScoreSum += v.employeeHxScore * v.employeeScoreWeight;
    return p;
  };

/**
 * Reduce function to remove a record to the chart dc state
 * @param {object} p - totals object
 * @param {object} v - new record to be removed
 * @returns
 */
export const updateTotalGroupOnRemoveRecord =
  (personaSettings: PersonaSettings, levers: Levers) => (p: EmployeeAverages, v: Employee) => {
    // if any pertinent values are NaN for the employee, disregard it
    if (cfEmployeeKeys.some((k) => Number.isNaN(v[k]))) {
      return p;
    }

    const settings = getEmployeePersonaSettings(personaSettings, v);
    const timeWorkedPerDay = settings?.TIME_WORKED_PER_DAY ?? cfConstants.DEFAULT_TIME_WORKED_PER_DAY;

    p.count -= 1;
    p.employeePercentageDailyWastedTimeSum -= v.employeePercentageDailyWastedTime as number; // adding percentage daily wasted time value
    p.employeePercentageDailyWastedTimeMean = p.count ? p.employeePercentageDailyWastedTimeSum / p.count : 0;
    p.employeeDailyWastedMinutesSum -= v.employeeDailyWastedMinutes as number; // adding daily wasted minutes value
    p.employeeDailyWastedMinutesMean = p.count ? p.employeeDailyWastedMinutesSum / p.count : 0;
    p.employeeWastedDaysSum -= ((v.employeeDailyWastedMinutes as number) / timeWorkedPerDay) * levers.workingDays;
    p.employeeWastedDaysMean = p.count ? p.employeeWastedDaysSum / p.count : 0;
    p.employeeOperationalLossSum -= v.employeeOperationalLoss as number; // adding operational loss
    p.employeeOperationalLossMean = p.count ? p.employeeOperationalLossSum / p.count : 0;
    p.employeeRevenueLossSum -= v.employeeRevenueLoss as number; // adding revenue loss (opportunity)
    p.employeeRevenueLossMean = p.count ? p.employeeRevenueLossSum / p.count : 0;
    p.employeeQualityScoreSum -= v.employeeQualityScore;
    p.employeeQualityScoreMean = p.count ? p.employeeQualityScoreSum / p.count : 0;
    p.logOfValue = p.count ? Math.log(p.count) / Math.log(10) : 0;

    p.employeeOfficeDuration -= v.employeeOfficeDuration as number;
    p.employeeRemoteDuration -= v.employeeRemoteDuration as number;

    p.employeeHxScoreWeightSum -= v.employeeScoreWeight;
    p.employeeHxScoreSum -= v.employeeHxScore * v.employeeScoreWeight;
    return p;
  };

export const hxScoreBandings = (d: Employee) => {
  // if employee hx score is NaN or missing, place employee in suffering group
  if (!d || d.employeeHxScore === null || d.employeeHxScore === undefined || Number.isNaN(d.employeeHxScore)) {
    return 'suffering';
  }

  switch (true) {
    case d.employeeHxScore < 5:
      return 'suffering';
    case d.employeeHxScore < 8:
      return 'frustrated';
    default:
      return 'satisfied';
  }
};

export const wellbeingChartDays = (personaSettings: PersonaSettings, levers: Levers) => (d: Employee) => {
  if (d.employeeHxScore < 5) {
    const settings = getEmployeePersonaSettings(personaSettings, d);
    const timeWorkedPerDay = settings?.TIME_WORKED_PER_DAY ?? cfConstants.DEFAULT_TIME_WORKED_PER_DAY;

    return Number.isNaN(d.employeeDailyWastedMinutes)
      ? cfConstants.SUFFERING_GROUP_FILTER
      : Math.max(
          0,
          Math.round(((d.employeeDailyWastedMinutes as number) / (timeWorkedPerDay || 1)) * levers.workingDays)
        );
  }

  return cfConstants.SUFFERING_GROUP_FILTER;
};

export const empWellCategories = (d: Employee) => {
  if (d.employeeQualityScore >= cfConstants.EMP_WELL_THRESHOLD_UPPER_VALUE) {
    return cfConstants.EMP_WELL_THRESHOLD_UPPER;
  } else if (d.employeeQualityScore >= cfConstants.EMP_WELL_THRESHOLD_MIDDLE_VALUE) {
    return cfConstants.EMP_WELL_THRESHOLD_MIDDLE;
  } else if (d.employeeQualityScore >= cfConstants.EMP_WELL_THRESHOLD_LOWER_VALUE) {
    return cfConstants.EMP_WELL_THRESHOLD_LOWER;
  } else {
    return cfConstants.EMP_WELL_THRESHOLD_UNUSABLE;
  }
};

export const opLossCategories = (d: Employee) => {
  if (d.employeeOperationalLoss > cfConstants.OP_LOSS_CATEGORY_ABOVE_5K_VALUE) {
    return cfConstants.OP_LOSS_CATEGORY_ABOVE_5K;
  } else if (d.employeeOperationalLoss > cfConstants.OP_LOSS_CATEGORY_4K_TO_5K_VALUE) {
    return cfConstants.OP_LOSS_CATEGORY_4K_TO_5K;
  } else if (d.employeeOperationalLoss > cfConstants.OP_LOSS_CATEGORY_3K_TO_4K_VALUE) {
    return cfConstants.OP_LOSS_CATEGORY_3K_TO_4K;
  } else if (d.employeeOperationalLoss > cfConstants.OP_LOSS_CATEGORY_2K_TO_3K_VALUE) {
    return cfConstants.OP_LOSS_CATEGORY_2K_TO_3K;
  } else if (d.employeeOperationalLoss > cfConstants.OP_LOSS_CATEGORY_1K_TO_2K_VALUE) {
    return cfConstants.OP_LOSS_CATEGORY_1K_TO_2K;
  } else if (d.employeeOperationalLoss >= cfConstants.OP_LOSS_CATEGORY_HALFK_TO_1K_VALUE) {
    return cfConstants.OP_LOSS_CATEGORY_HALFK_TO_1K;
  } else {
    return cfConstants.OP_LOSS_CATEGORY_LESS_THAN_HALFK;
  }
};

export const personaCategories =
  ({ termType, value }: PersonaTerm) =>
  (d: Employee) => {
    const termList = (d[termType as string] as Record<string, string[]>)[value as string];

    if (termList && termList.length > 0) {
      return termList[0];
    } else {
      return cfConstants.UNKNOWN_TERM_CATEGORY;
    }
  };

export const _reporting_RevenueCategories = (d: Employee) => {
  if (d.employeeRevenueLoss > cfConstants.REVENUE_CATEGORY_ABOVE_10K_VALUE) {
    return cfConstants.REVENUE_CATEGORY_ABOVE_10K_LABEL;
  } else if (d.employeeRevenueLoss > cfConstants.REVENUE_CATEGORY_6K_TO_10K_VALUE) {
    return cfConstants.REVENUE_CATEGORY_6K_TO_10K_LABEL;
  } else if (d.employeeRevenueLoss > cfConstants.REVENUE_CATEGORY_5K_TO_6K_VALUE) {
    return cfConstants.REVENUE_CATEGORY_5K_TO_6K_LABEL;
  } else if (d.employeeRevenueLoss > cfConstants.REVENUE_CATEGORY_4K_TO_5K_VALUE) {
    return cfConstants.REVENUE_CATEGORY_4K_TO_5K_LABEL;
  } else if (d.employeeRevenueLoss > cfConstants.REVENUE_CATEGORY_3K_TO_4K_VALUE) {
    return cfConstants.REVENUE_CATEGORY_3K_TO_4K_LABEL;
  } else if (d.employeeRevenueLoss > cfConstants.REVENUE_CATEGORY_2K_TO_3K_VALUE) {
    return cfConstants.REVENUE_CATEGORY_2K_TO_3K_LABEL;
  } else if (d.employeeRevenueLoss >= cfConstants.REVENUE_CATEGORY_1K_TO_2K_VALUE) {
    return cfConstants.REVENUE_CATEGORY_1K_TO_2K_LABEL;
  } else {
    return cfConstants.REVENUE_CATEGORY_LESS_THAN_1K_LABEL;
  }
};

export const environmentCategories = (d: Record<string, number>) => {
  if (d.employeePercentageDailyWastedTime < cfConstants.ENVIRONMENT_THRESHOLD) {
    return cfConstants.ENVIRONMENT_ABLE;
  } else {
    return cfConstants.ENVIRONMENT_STRUGGLING;
  }
};

/**
 * create the crossfilter groups for the metrics
 *
 * @param employeeData
 * @returns relevant crossfilter groups
 */
export const createCrossfilterGroups = (employeeData: Employee[], personaSettings: PersonaSettings, levers: Levers) => {
  const cf = crossfilter(employeeData);
  const personaTerm: PersonaTerm = { termType: personaSettings.termType, value: personaSettings.term };

  const addToTotalGroup = updateTotalGroupOnNewRecord(personaSettings, levers);
  const removeFromTotalGroup = updateTotalGroupOnRemoveRecord(personaSettings, levers);

  const totalDim = cf.dimension(() => 'totals');
  const totalGroup = (
    totalDim.group() as crossfilter.Group<Employee, crossfilter.NaturallyOrderedValue, EmployeeAverages>
  ).reduce(addToTotalGroup, removeFromTotalGroup, () => ({
    ...cfConstants.TOTAL_GROUP_INITIAL_DATA,
  }));

  const hxDim = cf.dimension(hxScoreBandings);
  const hxGroup = (
    hxDim.group() as crossfilter.Group<Employee, crossfilter.NaturallyOrderedValue, EmployeeAverages>
  ).reduce(addToTotalGroup, removeFromTotalGroup, () => ({
    ...cfConstants.TOTAL_GROUP_INITIAL_DATA,
  }));

  const wellbeingChartDim = cf.dimension(wellbeingChartDays(personaSettings, levers));
  const wellbeingChartGroup = (
    wellbeingChartDim.group() as crossfilter.Group<Employee, crossfilter.NaturallyOrderedValue, EmployeeAverages>
  ).reduce(addToTotalGroup, removeFromTotalGroup, () => ({
    ...cfConstants.TOTAL_GROUP_INITIAL_DATA,
  }));

  const payrollChartDim = cf.dimension(opLossCategories);
  const payrollChartGroup = (
    payrollChartDim.group() as crossfilter.Group<Employee, crossfilter.NaturallyOrderedValue, EmployeeAverages>
  ).reduce(addToTotalGroup, removeFromTotalGroup, () => ({
    ...cfConstants.TOTAL_GROUP_INITIAL_DATA,
  }));

  const personaDim = cf.dimension(personaCategories(personaTerm));

  const revenueChartGroup = (
    personaDim.group() as crossfilter.Group<Employee, crossfilter.NaturallyOrderedValue, EmployeeAverages>
  ).reduce(addToTotalGroup, removeFromTotalGroup, () => ({
    ...cfConstants.TOTAL_GROUP_INITIAL_DATA,
  }));

  const businessEfficiencyChartGroup = (
    personaDim.group() as crossfilter.Group<Employee, crossfilter.NaturallyOrderedValue, EmployeeAverages>
  ).reduce(addToTotalGroup, removeFromTotalGroup, () => ({
    ...cfConstants.TOTAL_GROUP_INITIAL_DATA,
  }));

  return {
    totalGroup,
    hxGroup,
    wellbeingChartGroup,
    payrollChartGroup,
    revenueChartGroup,
    businessEfficiencyChartGroup,
  };
};
