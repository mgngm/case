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
