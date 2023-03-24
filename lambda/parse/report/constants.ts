import type { HxScoreDistribution } from 'src/types/csv';

export const CSV_FORMAT_FS183 = 'fs183';
export const CSV_FORMAT_REPORTING = 'reporting';

export const PROPERTY_DU = 'agent';
export const PROPERTY_GROUP = 'agent_group';
export const PROPERTY_SPG = 'sp_group';
export const PROPERTY_TARGET = 'target';

export const CSV_PROPERTY_DU_NAME = 'DU Name';
export const CSV_PROPERTY_TARGET_NAME = 'Target Name';
export const CSV_PROPERTY_MISSION_NAME = 'Mission Name';
export const CSV_PROPERTY_LOCATION = 'Location';

export const CSV_FIELD_DU = 'du';
export const CSV_FIELD_GROUP = 'dug';
export const CSV_FIELD_SPG = 'spg';
export const CSV_FIELD_TARGET = 'target';
export const CSV_FIELD_MAPPED = 'mapped';

export const PROPERTY_CSV_FIELD_MAP = {
  [PROPERTY_DU]: CSV_FIELD_DU,
  [PROPERTY_GROUP]: CSV_FIELD_GROUP,
  [PROPERTY_SPG]: CSV_FIELD_SPG,
  [PROPERTY_TARGET]: CSV_FIELD_TARGET,
} as const;

export const REPORTING_MEAN_SCORE_KEY = 'Monthly Typical Score';
export const REPORTING_POTENTIAL_SCORE_KEY = 'Monthly Potential Quality Score';
export const FS183_MEAN_SCORE_KEY = 'Mean Quality Score';
export const FS813_POTENTIAL_SCORE_KEY = 'Potential Quality Score';
export const NA_VALUE = 'n/a';

export const NA_TERM = 'n/a';
export const EMPTY_TERM = '';
export const ID_TERM = '_id';
export const PATH_FILTER_TERM = '__pathFilter';
export const ADDRESS_TERM = '__address';
export const CITY_TERM = '__city';
export const COUNTRY_TERM = '__country';
export const LATITUDE_TERM = '__latitude';
export const LONGITUDE_TERM = '__longitude';
export const REGION_TERM = '__region';
export const POSTCODE_TERM = '__postCode';

export const TERMS_AND_VALUES_DEFAULT: Record<string, Record<string, string[]>> = {
  [CSV_FIELD_DU]: {
    [ADDRESS_TERM]: [],
    [CITY_TERM]: [],
    [COUNTRY_TERM]: [],
    [REGION_TERM]: [],
    [POSTCODE_TERM]: [],
    [LATITUDE_TERM]: [],
    [LONGITUDE_TERM]: [],
  },
  [CSV_FIELD_GROUP]: {},
  [CSV_FIELD_SPG]: {},
  [CSV_FIELD_TARGET]: {},
  [CSV_FIELD_MAPPED]: {},
};

/**
 * `termType|||propName|||propValue`
 */
export const SEARCH_TERM_SEPARATOR = '|||';

export const EMPTY_DEPENDENT_PROPERTIES = { from: [], to: [] };

export const IMPAIRER_FIELDS = [
  'From Impairer IP 1',
  'From Supplier 1',
  'To Impairer IP 1',
  'To Supplier 1',
  'Severity 1',
  'From Impairer IP 2',
  'From Supplier 2',
  'To Impairer IP 2',
  'To Supplier 2',
  'Severity 2',
  'From Impairer IP 3',
  'From Supplier 3',
  'To Impairer IP 3',
  'To Supplier 3',
  'Severity 3',
  'From Impairer IP 4',
  'From Supplier 4',
  'To Impairer IP 4',
  'To Supplier 4',
  'Severity 4',
  'From Impairer IP 5',
  'From Supplier 5',
  'To Impairer IP 5',
  'To Supplier 5',
  'Severity 5',
  'From Impairer IP 6',
  'From Supplier 6',
  'To Impairer IP 6',
  'To Supplier 6',
  'Severity 6',
  'From Impairer IP 7',
  'From Supplier 7',
  'To Impairer IP 7',
  'To Supplier 7',
  'Severity 7',
  'From Impairer IP 8',
  'From Supplier 8',
  'To Impairer IP 8',
  'To Supplier 8',
  'Severity 8',
];

export const APPLICATION_WEIGHT = 'applicationWeight';

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
export const INITIAL_HX_DISTRIBUTION: HxScoreDistribution = {
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0,
  6: 0,
  7: 0,
  8: 0,
  9: 0,
  10: 0,
};

export const EQUALITY_BOUNDARIES = [0.07, 0.15, 0.25, 0.4];
export const EQUALITY_GRADE_A = 'A';
export const EQUALITY_GRADE_B = 'B';
export const EQUALITY_GRADE_C = 'C';
export const EQUALITY_GRADE_D = 'D';
export const EQUALITY_GRADE_E = 'E';

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

export const DEFAULT_HYBRID_LOWER_PERCENT = 5;
export const DEFAULT_HYBRID_UPPER_PERCENT = 95;
export const DEFAULT_WORKING_DAYS = 240;
export const DEFAULT_TIME_WORKED_PER_DAY = 480;

// these are normalised...
export const DEFAULT_HYBRID_LOWER = DEFAULT_HYBRID_LOWER_PERCENT / 100;
export const DEFAULT_HYBRID_UPPER = DEFAULT_HYBRID_UPPER_PERCENT / 100;

export const CO2_REDUCTION_LABEL = 'Commuting impact (CO2)';

export const DEFAULT_CURRENCY = '£';
