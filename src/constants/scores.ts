export interface TitleMap {
  [key: string]: {
    title: string;
    cssIdentifier: string;
    tooltip: string;
  };
}

export const ANIMATION_TIME = 2000;

export const TOTAL_EMPLOYEES = 'total-employees';
export const HOME_WORKERS = 'home-workers';
export const OFFICE_WORKERS = 'office-workers';
export const HYBRID_WORKERS = 'hybrid-workers';

//Keeping lowercase as used for css classes too as well as switch statements.
export const BAND_TYPE_SUFFERING = 'suffering';
export const BAND_TYPE_FRUSTRATED = 'frustrated';
export const BAND_TYPE_SATISFIED = 'satisfied';

export const BAND_CONSTANTS: TitleMap = {
  [BAND_TYPE_FRUSTRATED]: {
    title: 'Frustrated',
    cssIdentifier: 'frustrated',
    tooltip: 'HX Scores 5 - 7.9',
  },
  [BAND_TYPE_SUFFERING]: {
    title: 'Suffering',
    cssIdentifier: 'suffering',
    tooltip: 'HX Scores 0 - 4.9',
  },
  [BAND_TYPE_SATISFIED]: {
    title: 'Satisfied',
    cssIdentifier: 'satisfied',
    tooltip: 'HX Scores 8+',
  },
};

export const OVERVIEW_DATA_VIEW_STRING = 'Overview';
export const BREAKDOWN_DATA_VIEW_STRING = 'Breakdown';
export const TOP_10_DATA_VIEW_STRING = 'top10';
export const BOTTOM_90_DATA_VIEW_STRING = 'bottom90';

export const WORKING_LOCATION_ALL = 'all';
export const WORKING_LOCATION_OFFICE = 'office';
export const WORKING_LOCATION_HOME = 'home';
