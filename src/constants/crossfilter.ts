export const TOTAL_GROUP_INITIAL_DATA = {
  count: 0,
  employeePercentageDailyWastedTimeSum: 0,
  employeePercentageDailyWastedTimeMean: 0,
  employeeWastedDaysSum: 0,
  employeeWastedDaysMean: 0,
  employeeDailyWastedMinutesSum: 0,
  employeeDailyWastedMinutesMean: 0,
  employeeOperationalLossSum: 0,
  employeeOperationalLossMean: 0,
  employeeRevenueLossSum: 0,
  employeeRevenueLossMean: 0,
  employeeQualityScoreSum: 0,
  employeeQualityScoreMean: 0,
  employeeHxScoreWeightSum: 0,
  employeeHxScoreSum: 0,
  logOfValue: 0,
  employeeOfficeDuration: 0,
  employeeRemoteDuration: 0,
};

// PAYROLL
export const OP_LOSS_CATEGORY_ABOVE_5K_VALUE = 5000;
export const OP_LOSS_CATEGORY_4K_TO_5K_VALUE = 4000;
export const OP_LOSS_CATEGORY_3K_TO_4K_VALUE = 3000;
export const OP_LOSS_CATEGORY_2K_TO_3K_VALUE = 2000;
export const OP_LOSS_CATEGORY_1K_TO_2K_VALUE = 1000;
export const OP_LOSS_CATEGORY_HALFK_TO_1K_VALUE = 500;

export const OP_LOSS_CATEGORY_ABOVE_5K = '>£5k';
export const OP_LOSS_CATEGORY_4K_TO_5K = '£4k-£5k';
export const OP_LOSS_CATEGORY_3K_TO_4K = '£3k-£4k';
export const OP_LOSS_CATEGORY_2K_TO_3K = '£2k-£3k';
export const OP_LOSS_CATEGORY_1K_TO_2K = '£1k-£2k';
export const OP_LOSS_CATEGORY_HALFK_TO_1K = '£0.5k-£1k';
export const OP_LOSS_CATEGORY_LESS_THAN_HALFK = '<£0.5k';

export const PAYROLL_CATEGORIES = [
  OP_LOSS_CATEGORY_ABOVE_5K,
  OP_LOSS_CATEGORY_4K_TO_5K,
  OP_LOSS_CATEGORY_3K_TO_4K,
  OP_LOSS_CATEGORY_2K_TO_3K,
  OP_LOSS_CATEGORY_1K_TO_2K,
  OP_LOSS_CATEGORY_HALFK_TO_1K,
  OP_LOSS_CATEGORY_LESS_THAN_HALFK,
];

// EMPLOYEE WELLBEING
export const SUFFERING_GROUP_FILTER = -1;

export const EMP_WELL_THRESHOLD_UPPER_VALUE = 78;
export const EMP_WELL_THRESHOLD_MIDDLE_VALUE = 70;
export const EMP_WELL_THRESHOLD_LOWER_VALUE = 40;

export const EMP_WELL_THRESHOLD_UPPER = 'Negligible Frustration';
export const EMP_WELL_THRESHOLD_MIDDLE = 'Mild Frustration';
export const EMP_WELL_THRESHOLD_LOWER = 'Severe Frustration';
export const EMP_WELL_THRESHOLD_UNUSABLE = 'Unusable';

// REVENUE CHART
export const REVENUE_CATEGORY_ABOVE_10K_VALUE = 10000;
export const REVENUE_CATEGORY_6K_TO_10K_VALUE = 6000;
export const REVENUE_CATEGORY_5K_TO_6K_VALUE = 5000;
export const REVENUE_CATEGORY_4K_TO_5K_VALUE = 4000;
export const REVENUE_CATEGORY_3K_TO_4K_VALUE = 3000;
export const REVENUE_CATEGORY_2K_TO_3K_VALUE = 2000;
export const REVENUE_CATEGORY_1K_TO_2K_VALUE = 1000;

export const REVENUE_CATEGORY_ABOVE_10K_LABEL = '>£10k';
export const REVENUE_CATEGORY_6K_TO_10K_LABEL = '£6k-£10k';
export const REVENUE_CATEGORY_5K_TO_6K_LABEL = '£5k-£6k';
export const REVENUE_CATEGORY_4K_TO_5K_LABEL = '£4k-£5k';
export const REVENUE_CATEGORY_3K_TO_4K_LABEL = '£3k-£4k';
export const REVENUE_CATEGORY_2K_TO_3K_LABEL = '£2k-£3k';
export const REVENUE_CATEGORY_1K_TO_2K_LABEL = '£1k-£2k';
export const REVENUE_CATEGORY_LESS_THAN_1K_LABEL = '<£1k';

export const UNKNOWN_TERM_CATEGORY = '__unknown__';

// Equality Chart
export const EQUALITY_TOP_10_LABEL = 'Top 10%';
export const EQUALITY_2nd_LABEL = '2nd';
export const EQUALITY_3rd_LABEL = '3rd';
export const EQUALITY_4th_LABEL = '4th';
export const EQUALITY_5th_LABEL = '5th';
export const EQUALITY_6th_LABEL = '6th';
export const EQUALITY_7th_LABEL = '7th';
export const EQUALITY_8th_LABEL = '8th';
export const EQUALITY_9th_LABEL = '9th';
export const EQUALITY_BOTTOM_10_LABEL = 'Bottom 10%';

//ENVIRONMENT CHART
export const ENVIRONMENT_THRESHOLD = 2.0;
export const CO2_SAVINGS_PER_MONTH = 1.35;
export const OFFICE_DAYS = 1;

export const ENVIRONMENT_ABLE = 'Able';
export const ENVIRONMENT_STRUGGLING = 'Struggling';

export const ENVIRONMENT_CHART_BAR_ORDER = {
  [ENVIRONMENT_ABLE]: 1,
  [ENVIRONMENT_STRUGGLING]: 2,
};
