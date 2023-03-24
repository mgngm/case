import type { AccessLevel, ParseStatus } from 'src/graphql';

export type TableDataItem = {
  createdAt: string;
  updatedAt: string;
  _lastChangedAt: number;
  __typename: string;
  _deleted: boolean;
  _version: number;
  _ttl?: number;
  id: string;
};

export interface PersonaTableItem extends TableDataItem {
  organisation: string;
  termType: string;
  term: string;
  inputAssumptions: string[];
}

export interface InputAssumptionTableItem extends TableDataItem {
  termValue: string;
  timeWorkedPerDay: number;
  dailyDigitalPercentage: number;
  payrollPerEmployee: number;
  revenuePerEmployee: number;
  numberOfEmployees: number;
  applications: string[];
  personaSettingsInputAssumptionsId: string;
}

export interface ApplicationUsageTableItem extends TableDataItem {
  target: string;
  percent: number;
  inputAssumptionApplicationUsagesId: string;
}

export interface PartnerTableItem extends TableDataItem {
  partnerId: string;
  partnerName: string;
  organisations: string[];
}

export interface OrganisationTableItem extends TableDataItem {
  organisationId: string;
  organisationName: string;
  partnerOrganisationsId: string;
}

export interface ContextMapTableItem extends TableDataItem {
  context: string;
  identityProvider: string;
}

export interface ReportTableItem extends TableDataItem {
  context: string;
  reportDate: string;
  reportName: string;
  s3Key: string;
  accessLevel: AccessLevel;
  projects: string[];
  insights: string[];
}

export interface ProjectTableItem extends TableDataItem {
  employeeCount: number;
  projectId: string;
  hxScore: number;
  timeLost: number;
  payroll: number;
  projectDate: string;
  projectBody: Record<string, unknown>;
  projectName: string;
  projectType: string;
  projectStatus: string;
}

export interface ProjectTemplateTableItem extends TableDataItem {
  context: string;
  templateId: string;
  name: string;
  type: string;
  status: string;
  body: Record<string, unknown>;
}

export interface ParseTableItem extends TableDataItem {
  context: string;
  inputAnalyticCsv: string;
  inputProjectCsv: string;
  levers: string;
  startDateTime: string;
  endDateTime: string;
  status: ParseStatus;
  report?: string;
  warnings: string[];
}

export interface DUTableItem extends TableDataItem {
  name: string;
  context: string;
  hxScore: number;
  persona: string;
  timeLost: number;
  payroll: number;
  revenue: number;
  locationType: string;
  hybridPercent: number;
  applications: string[];
  // projects: [Project] @hasMany
  // reports: Report @hasOne
  office: string;
  country: string;
  officeHx: number;
  remoteHx: number;
}

export interface ProjectDUsTableItem extends TableDataItem {
  dUID: string;
  projectID: string;
}

export type TableData =
  | PersonaTableItem
  | InputAssumptionTableItem
  | ApplicationUsageTableItem
  | PartnerTableItem
  | OrganisationTableItem
  | ReportTableItem
  | ContextMapTableItem
  | ProjectTableItem
  | ProjectTemplateTableItem
  | ParseTableItem
  | DUTableItem
  | ProjectDUsTableItem;
