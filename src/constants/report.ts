export const DEFAULT_REPORT_NAME = 'report.json';
export const REPORT_PREVIEW_MESSAGE = 'PREVIEW_UPDATE';
export const DEFAULT_CURRENCY = '£';
export const ALL_EMPLOYEES = '_all_';

export const REPORT_CSV_FILE_KEY = 'reportCSV';
export const PROJECT_CSV_FILE_KEY = 'projectCSV';
export const KEY_SITES_CSV_FILE_KEY = 'keySitesCSV';
export const UPGRADING_SITES_CSV_FILE_KEY = 'upgradingSitesCSV';
export const PERSONA_SETTINGS_FILE_KEY = 'personaSettings';

export enum FilenameState {
  NOT_SET = 'NOT_SET',
  NO_REPORT_AVAILABLE = 'NO_REPORT_AVAILABLE',
}

export enum ReportState {
  NOT_SET = 'NOT_SET',
  NO_REPORT_AVAILABLE = 'NO_REPORT_AVAILABLE',
}

export enum DeltaArrowDirection {
  UP = 'UP',
  DOWN = 'DOWN',
  NOT_AVAILABLE = 'NOT_AVAILABLE',
  NONE = 'NONE',
}
export enum DeltaArrowColor {
  GREEN = 'GREEN',
  RED = 'RED',
  NONE = 'NONE',
  NOT_AVAILABLE = 'NOT_AVAILABLE',
}

export const DELTA_STRING_MAP: Record<
  string,
  Record<Exclude<DeltaArrowDirection, DeltaArrowDirection.NOT_AVAILABLE>, string>
> = {
  wellbeing: {
    [DeltaArrowDirection.DOWN]: 'less suffering',
    [DeltaArrowDirection.UP]: 'more suffering',
    [DeltaArrowDirection.NONE]: 'No change from last month',
  },
  equality: {
    [DeltaArrowDirection.UP]: 'Up from grade',
    [DeltaArrowDirection.DOWN]: 'Down from grade',
    [DeltaArrowDirection.NONE]: 'No change from last month',
  },
  payroll: {
    [DeltaArrowDirection.DOWN]: 'waste reduced',
    [DeltaArrowDirection.UP]: 'waste increased',
    [DeltaArrowDirection.NONE]: 'No change from last month',
  },
  business: {
    [DeltaArrowDirection.DOWN]: 'days recovered',
    [DeltaArrowDirection.UP]: 'days lost',
    [DeltaArrowDirection.NONE]: 'No change from last month',
  },
  revenue: {
    [DeltaArrowDirection.DOWN]: 'reduction',
    [DeltaArrowDirection.UP]: 'increase',
    [DeltaArrowDirection.NONE]: 'No change from last month',
  },
  hx: {
    [DeltaArrowDirection.DOWN]: 'decrease in HX Score',
    [DeltaArrowDirection.UP]: 'increase in HX Score',
    [DeltaArrowDirection.NONE]: 'No change from last month',
  },
};

export const REPORT_ACCORDION = 'REPORT_ACCORDION';
export const PROJECTS_ACCORDION = 'PROJECTS_ACCORDION';
export const INSIGHTS_ACCORDION = 'INSIGHTS_ACCORDION';
export const PERSONA_SETTINGS_ACCORDION = 'PS_ACCORDION';

export const PREVIEW_ACCORDIONS = [
  REPORT_ACCORDION,
  PROJECTS_ACCORDION,
  INSIGHTS_ACCORDION,
  PERSONA_SETTINGS_ACCORDION,
] as const;

export type PreviewAccordion = typeof PREVIEW_ACCORDIONS[number];
