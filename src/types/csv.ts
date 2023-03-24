import type { ProjectStatus, Project } from 'src/graphql';

export type CsvJSON = Record<string, string | number | boolean | Record<string, string | number | string[]>>[];

export type ProjectAnalyticCsvJSON = {
  'DU Name': string;
  'Target Name': string;
  'Mission Name': string;
  Location: string;
  'Project ID': string;
};

export type InputAssumption = {
  TIME_WORKED_PER_DAY: number;
  DAILY_DIGITAL_PERCENTAGE: number;
  PAYROLL_PER_EMPLOYEE: number;
  REVENUE_PER_EMPLOYEE: number;
  NUMBER_OF_EMPLOYEES: number;
  applications: Record<string, number>;
};

export type InputAssumptions = Record<string, InputAssumption>;

export type PersonaSettings = {
  termType: string;
  term: string;
  inputAssumptions: InputAssumptions;
};

export type UpdatedHeaderTermsType = Record<string, string | null>;

export type Supplier = {
  supplier?: string;
  ip?: string;
};

export type Impairer = {
  from: Supplier;
  to: Supplier;
  severity?: number;
};

export type Levers = {
  hybridLower: number;
  hybridUpper: number;
  workingDays: number;
  keySites?: string[];
  upgradingSites?: string[];
};

export type AnalyticDU = { 'DU Name'?: string; User?: string };
export type AnalyticTarget = { 'Target Name': string };
export type AnalyticProperties = {
  du?: Record<string, string>;
  dug?: Record<string, string>;
  spg?: Record<string, string>;
  target?: Record<string, string>;
};
export type AnalyticImpairers = { impairers: Record<string, Impairer> };
export type AnalyticLocation = {
  Location?: string;
  City?: string;
  Region?: string;
  Country?: string;
  'Interface Type'?: string;
  'Device IP'?: string;
  'DNS IP'?: string;
};

export type AnalyticData = AnalyticDU &
  AnalyticTarget &
  AnalyticLocation &
  AnalyticImpairers &
  AnalyticProperties & {
    roundedMeanScore: number;
    meanScore: number;
    potentialScore: number;
    scoreDelta: number;
    notEstimated: boolean;
    hxScore: number;
    scoreWeight: number;
    applicationWeight: number;
  };

export type ProjectAnalytic = AnalyticData & {
  'Mission Name': string;
  'Project ID': string;
};

export type EmployeeAnalytic = Record<string, Array<AnalyticData | ProjectAnalytic>>;

export type PersonaTerm = { termType: string; value: string };

export type OrgProperties = {
  properties: Record<string, string[]>;
  dependentProperties: { from: string[]; to: string[] };
};

export type ValuesSearchLists = {
  du: Set<string>;
  target: Set<string>;
  dug: Set<string>;
  spg: Set<string>;
};

export type Location = {
  location?: string;
  city?: string;
  region?: string;
  country?: string;
  interfaceType?: string;
  deviceIP?: string;
  dnsIP?: string;
};

export type EmployeeLocation = {
  scoreSum: number;
  weightSum: number;
  durationSum: number;
  appWeightSum: number;
  maxDuration: number;
  hxScore: number;
  locations: Location[];
};

export type Employee = {
  User: string;
  employeeQualityScore: number;
  employeePotentialScore: number;
  employeeScoreDelta: number;
  employeeHxScore: number;
  employeeScoreWeight: number;
  analytics: Array<AnalyticData | ProjectAnalytic>;
  locations: Record<string, EmployeeLocation>;
  officeDuration?: number;
  remoteDuration?: number;
  hybridPercent?: number;
  remote?: boolean;
  office?: boolean;
  hybrid?: boolean;
} & Record<
  string,
  string | number | Record<string, string[]> | AnalyticData[] | Record<string, EmployeeLocation> | boolean
>;

export type HydratedProject = {
  dus: Employee[];
  employeeCount: number;
  projectId: string;
  hxScore: number;
  timeLost: number;
  payroll: number;
  projectDate: string;
  projectStatus: ProjectStatus;
};

export type ProjectTemplate = {
  projectId: string;
  projectBody: Record<string, unknown>;
  projectName: string;
  projectType: string;
  projectStatus: ProjectStatus;
};

export interface ParsedLocation {
  count: number;
  scoreSum: number;
  weightSum: number;
  hxScore: number;
  scoreCounts: {
    total: number;
    suffering: number;
    frustrated: number;
    satisfied: number;
  };
}

export type HybridBreakdown = {
  0: number;
  20: number;
  40: number;
  60: number;
  80: number;
};

export type Office = ParsedLocation;
export type Remote = ParsedLocation;
export type Hybrid = {
  count: number;
  hybridBreakdown: HybridBreakdown;
};

export type PersonaLocation = {
  count: number;
  office: Office;
  remote: Remote;
  hybrid: Hybrid;
};

export type Locations = {
  all: {
    office: Office;
    remote: Remote;
    hybrid: Hybrid;
  };
  personas: {
    [s: string]: PersonaLocation;
  };
  offices: {
    [s: string]: Office;
  };
};

export type PersonaHybridBreakdown = {
  total: number;
  home: number;
  office: number;
  hybrid: number;
  hybridBreakdown: HybridBreakdown;
};

export type ParsedAnalyticData = {
  userIdsFromAnalytics: (string | undefined)[];
  employeeData: Employee[];
  termsAndValues: Record<string, Record<string, string[]>>;
  valuesSearchLists: ValuesSearchLists;
  locations: Locations;
  personaTerm: PersonaTerm;
};

export type HxScoreDistribution = {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
  6: number;
  7: number;
  8: number;
  9: number;
  10: number;
};

export type EmployeeAverages = {
  count: number;
  employeePercentageDailyWastedTimeSum: number;
  employeePercentageDailyWastedTimeMean: number;
  employeeDailyWastedMinutesSum: number;
  employeeDailyWastedMinutesMean: number;
  employeeWastedDaysSum: number;
  employeeWastedDaysMean: number;
  employeeOperationalLossSum: number;
  employeeOperationalLossMean: number;
  employeeRevenueLossSum: number;
  employeeRevenueLossMean: number;
  employeeQualityScoreSum: number;
  employeeQualityScoreMean: number;
  employeeHxScoreWeightSum: number;
  employeeHxScoreSum: number;
  employeeOfficeDuration: number;
  employeeRemoteDuration: number;
  logOfValue: number;
};

export type ParseResult = {
  reportData: ParsedAnalyticData;
  analyticData: AnalyticData[];
  inputLocations: Set<string>;
  projects: Project[];
  projectFailures: Record<string, string>[];
};

export type WorkingLocation = {
  score: number;
  percentages: {
    suffering: number;
    satisfied: number;
    frustrated: number;
  };
};

export type WorkingLocations = {
  home: WorkingLocation;
  office: WorkingLocation;
};
