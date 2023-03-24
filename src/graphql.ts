/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type ModelPartnerFilterInput = {
  id?: ModelIDInput | null;
  partnerId?: ModelStringInput | null;
  partnerName?: ModelStringInput | null;
  status?: ModelContextStatusInput | null;
  and?: Array<ModelPartnerFilterInput | null> | null;
  or?: Array<ModelPartnerFilterInput | null> | null;
  not?: ModelPartnerFilterInput | null;
};

export type ModelIDInput = {
  ne?: string | null;
  eq?: string | null;
  le?: string | null;
  lt?: string | null;
  ge?: string | null;
  gt?: string | null;
  contains?: string | null;
  notContains?: string | null;
  between?: Array<string | null> | null;
  beginsWith?: string | null;
  attributeExists?: boolean | null;
  attributeType?: ModelAttributeTypes | null;
  size?: ModelSizeInput | null;
};

export enum ModelAttributeTypes {
  binary = 'binary',
  binarySet = 'binarySet',
  bool = 'bool',
  list = 'list',
  map = 'map',
  number = 'number',
  numberSet = 'numberSet',
  string = 'string',
  stringSet = 'stringSet',
  _null = '_null',
}

export type ModelSizeInput = {
  ne?: number | null;
  eq?: number | null;
  le?: number | null;
  lt?: number | null;
  ge?: number | null;
  gt?: number | null;
  between?: Array<number | null> | null;
};

export type ModelStringInput = {
  ne?: string | null;
  eq?: string | null;
  le?: string | null;
  lt?: string | null;
  ge?: string | null;
  gt?: string | null;
  contains?: string | null;
  notContains?: string | null;
  between?: Array<string | null> | null;
  beginsWith?: string | null;
  attributeExists?: boolean | null;
  attributeType?: ModelAttributeTypes | null;
  size?: ModelSizeInput | null;
};

export type ModelContextStatusInput = {
  eq?: ContextStatus | null;
  ne?: ContextStatus | null;
};

export enum ContextStatus {
  CREATED = 'CREATED',
  FOR_DELETION = 'FOR_DELETION',
}

export type ModelPartnerConnection = {
  __typename: 'ModelPartnerConnection';
  items: Array<Partner | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type Partner = {
  __typename: 'Partner';
  id: string;
  partnerId: string;
  partnerName?: string | null;
  organisations?: ModelOrganisationConnection | null;
  status?: ContextStatus | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type ModelOrganisationConnection = {
  __typename: 'ModelOrganisationConnection';
  items: Array<Organisation | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type Organisation = {
  __typename: 'Organisation';
  id: string;
  organisationId: string;
  organisationName?: string | null;
  partner?: Partner | null;
  personaSettings?: string | null;
  status?: ContextStatus | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  partnerOrganisationsId?: string | null;
};

export enum ModelSortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export type ModelDUFilterInput = {
  id?: ModelIDInput | null;
  name?: ModelStringInput | null;
  context?: ModelStringInput | null;
  hxScore?: ModelFloatInput | null;
  persona?: ModelStringInput | null;
  timeLost?: ModelFloatInput | null;
  payroll?: ModelFloatInput | null;
  revenue?: ModelFloatInput | null;
  locationType?: ModelLocationTypeInput | null;
  hybridPercent?: ModelFloatInput | null;
  applications?: ModelStringInput | null;
  reportId?: ModelIDInput | null;
  office?: ModelStringInput | null;
  country?: ModelStringInput | null;
  officeHx?: ModelFloatInput | null;
  remoteHx?: ModelFloatInput | null;
  locations?: ModelStringInput | null;
  analytics?: ModelStringInput | null;
  and?: Array<ModelDUFilterInput | null> | null;
  or?: Array<ModelDUFilterInput | null> | null;
  not?: ModelDUFilterInput | null;
  reportDusId?: ModelIDInput | null;
};

export type ModelFloatInput = {
  ne?: number | null;
  eq?: number | null;
  le?: number | null;
  lt?: number | null;
  ge?: number | null;
  gt?: number | null;
  between?: Array<number | null> | null;
  attributeExists?: boolean | null;
  attributeType?: ModelAttributeTypes | null;
};

export type ModelLocationTypeInput = {
  eq?: LocationType | null;
  ne?: LocationType | null;
};

export enum LocationType {
  OFFICE = 'OFFICE',
  HYBRID = 'HYBRID',
  REMOTE = 'REMOTE',
}

export type ModelDUConnection = {
  __typename: 'ModelDUConnection';
  items: Array<DU | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type DU = {
  __typename: 'DU';
  id: string;
  name?: string | null;
  context?: string | null;
  hxScore?: number | null;
  persona?: string | null;
  timeLost?: number | null;
  payroll?: number | null;
  revenue?: number | null;
  locationType?: LocationType | null;
  hybridPercent?: number | null;
  applications?: Array<string | null> | null;
  projects?: ModelProjectDusConnection | null;
  reportId: string;
  report?: Report | null;
  office?: string | null;
  country?: string | null;
  officeHx?: number | null;
  remoteHx?: number | null;
  locations?: string | null;
  analytics?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  reportDusId?: string | null;
};

export type ModelProjectDusConnection = {
  __typename: 'ModelProjectDusConnection';
  items: Array<ProjectDus | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type ProjectDus = {
  __typename: 'ProjectDus';
  id: string;
  projectID: string;
  dUID: string;
  project: Project;
  dU: DU;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type Project = {
  __typename: 'Project';
  id: string;
  context?: string | null;
  projectId?: string | null;
  projectDate?: string | null;
  projectName?: string | null;
  projectType?: ProjectType | null;
  projectStatus?: ProjectStatus | null;
  projectBody?: string | null;
  timeLost?: number | null;
  hxScore?: number | null;
  payroll?: number | null;
  employeeCount?: number | null;
  report?: string | null;
  dus?: ModelProjectDusConnection | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  reportProjectsId?: string | null;
};

export enum ProjectType {
  APPLICATION = 'APPLICATION',
  NETWORK_REMOTE = 'NETWORK_REMOTE',
  NETWORK_OFFICE = 'NETWORK_OFFICE',
  WIDER_NETWORK = 'WIDER_NETWORK',
}

export enum ProjectStatus {
  NOT_STARTED = 'NOT_STARTED',
  ON_HOLD = 'ON_HOLD',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED',
}

export type Report = {
  __typename: 'Report';
  id: string;
  context?: string | null;
  reportDate?: string | null;
  reportName?: string | null;
  accessLevel?: AccessLevel | null;
  s3Key?: string | null;
  projects?: ModelProjectConnection | null;
  insights?: ModelProjectInsightConnection | null;
  projectIds?: Array<string | null> | null;
  insightIds?: Array<string | null> | null;
  customProjects?: string | null;
  reportStatus?: ReportStatus | null;
  dus?: ModelDUConnection | null;
  reportData?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export enum AccessLevel {
  GLOBAL = 'GLOBAL',
  PARTNER = 'PARTNER',
  ORGANISATION = 'ORGANISATION',
}

export type ModelProjectConnection = {
  __typename: 'ModelProjectConnection';
  items: Array<Project | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type ModelProjectInsightConnection = {
  __typename: 'ModelProjectInsightConnection';
  items: Array<ProjectInsight | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type ProjectInsight = {
  __typename: 'ProjectInsight';
  id: string;
  name?: string | null;
  insightDate?: string | null;
  s3Key?: string | null;
  context?: string | null;
  fileName?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  reportInsightsId?: string | null;
};

export enum ReportStatus {
  UPLOADING = 'UPLOADING',
  PROCESSING = 'PROCESSING',
  PREVIEW = 'PREVIEW',
  PUBLISHED = 'PUBLISHED',
  FOR_DELETION = 'FOR_DELETION',
}

export type CreatePersonaSettingsInput = {
  createdAt?: string | null;
  id?: string | null;
  organisation: string;
  termType?: string | null;
  term?: string | null;
  _version?: number | null;
};

export type ModelPersonaSettingsConditionInput = {
  createdAt?: ModelStringInput | null;
  organisation?: ModelStringInput | null;
  termType?: ModelStringInput | null;
  term?: ModelStringInput | null;
  and?: Array<ModelPersonaSettingsConditionInput | null> | null;
  or?: Array<ModelPersonaSettingsConditionInput | null> | null;
  not?: ModelPersonaSettingsConditionInput | null;
};

export type PersonaSettings = {
  __typename: 'PersonaSettings';
  createdAt: string;
  id: string;
  organisation: string;
  termType?: string | null;
  term?: string | null;
  inputAssumptions?: ModelInputAssumptionConnection | null;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type ModelInputAssumptionConnection = {
  __typename: 'ModelInputAssumptionConnection';
  items: Array<InputAssumption | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type InputAssumption = {
  __typename: 'InputAssumption';
  id: string;
  termValue: string;
  timeWorkedPerDay?: number | null;
  dailyDigitalPercentage?: number | null;
  payrollPerEmployee?: number | null;
  revenuePerEmployee?: number | null;
  numberOfEmployees?: number | null;
  applicationUsages?: ModelApplicationUsageConnection | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  personaSettingsInputAssumptionsId?: string | null;
};

export type ModelApplicationUsageConnection = {
  __typename: 'ModelApplicationUsageConnection';
  items: Array<ApplicationUsage | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type ApplicationUsage = {
  __typename: 'ApplicationUsage';
  id: string;
  target: string;
  percent: number;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  inputAssumptionApplicationUsagesId?: string | null;
};

export type UpdatePersonaSettingsInput = {
  createdAt?: string | null;
  id: string;
  organisation?: string | null;
  termType?: string | null;
  term?: string | null;
  _version?: number | null;
};

export type DeletePersonaSettingsInput = {
  id: string;
  _version?: number | null;
};

export type CreateInputAssumptionInput = {
  id?: string | null;
  termValue: string;
  timeWorkedPerDay?: number | null;
  dailyDigitalPercentage?: number | null;
  payrollPerEmployee?: number | null;
  revenuePerEmployee?: number | null;
  numberOfEmployees?: number | null;
  _version?: number | null;
  personaSettingsInputAssumptionsId?: string | null;
};

export type ModelInputAssumptionConditionInput = {
  termValue?: ModelStringInput | null;
  timeWorkedPerDay?: ModelIntInput | null;
  dailyDigitalPercentage?: ModelFloatInput | null;
  payrollPerEmployee?: ModelIntInput | null;
  revenuePerEmployee?: ModelIntInput | null;
  numberOfEmployees?: ModelIntInput | null;
  and?: Array<ModelInputAssumptionConditionInput | null> | null;
  or?: Array<ModelInputAssumptionConditionInput | null> | null;
  not?: ModelInputAssumptionConditionInput | null;
  personaSettingsInputAssumptionsId?: ModelIDInput | null;
};

export type ModelIntInput = {
  ne?: number | null;
  eq?: number | null;
  le?: number | null;
  lt?: number | null;
  ge?: number | null;
  gt?: number | null;
  between?: Array<number | null> | null;
  attributeExists?: boolean | null;
  attributeType?: ModelAttributeTypes | null;
};

export type UpdateInputAssumptionInput = {
  id: string;
  termValue?: string | null;
  timeWorkedPerDay?: number | null;
  dailyDigitalPercentage?: number | null;
  payrollPerEmployee?: number | null;
  revenuePerEmployee?: number | null;
  numberOfEmployees?: number | null;
  _version?: number | null;
  personaSettingsInputAssumptionsId?: string | null;
};

export type DeleteInputAssumptionInput = {
  id: string;
  _version?: number | null;
};

export type CreateApplicationUsageInput = {
  id?: string | null;
  target: string;
  percent: number;
  _version?: number | null;
  inputAssumptionApplicationUsagesId?: string | null;
};

export type ModelApplicationUsageConditionInput = {
  target?: ModelStringInput | null;
  percent?: ModelFloatInput | null;
  and?: Array<ModelApplicationUsageConditionInput | null> | null;
  or?: Array<ModelApplicationUsageConditionInput | null> | null;
  not?: ModelApplicationUsageConditionInput | null;
  inputAssumptionApplicationUsagesId?: ModelIDInput | null;
};

export type UpdateApplicationUsageInput = {
  id: string;
  target?: string | null;
  percent?: number | null;
  _version?: number | null;
  inputAssumptionApplicationUsagesId?: string | null;
};

export type DeleteApplicationUsageInput = {
  id: string;
  _version?: number | null;
};

export type CreatePartnerInput = {
  id?: string | null;
  partnerId: string;
  partnerName?: string | null;
  status?: ContextStatus | null;
  _version?: number | null;
};

export type ModelPartnerConditionInput = {
  partnerId?: ModelStringInput | null;
  partnerName?: ModelStringInput | null;
  status?: ModelContextStatusInput | null;
  and?: Array<ModelPartnerConditionInput | null> | null;
  or?: Array<ModelPartnerConditionInput | null> | null;
  not?: ModelPartnerConditionInput | null;
};

export type UpdatePartnerInput = {
  id: string;
  partnerId?: string | null;
  partnerName?: string | null;
  status?: ContextStatus | null;
  _version?: number | null;
};

export type DeletePartnerInput = {
  id: string;
  _version?: number | null;
};

export type CreateOrganisationInput = {
  id?: string | null;
  organisationId: string;
  organisationName?: string | null;
  personaSettings?: string | null;
  status?: ContextStatus | null;
  _version?: number | null;
  partnerOrganisationsId?: string | null;
};

export type ModelOrganisationConditionInput = {
  organisationId?: ModelStringInput | null;
  organisationName?: ModelStringInput | null;
  personaSettings?: ModelStringInput | null;
  status?: ModelContextStatusInput | null;
  and?: Array<ModelOrganisationConditionInput | null> | null;
  or?: Array<ModelOrganisationConditionInput | null> | null;
  not?: ModelOrganisationConditionInput | null;
  partnerOrganisationsId?: ModelIDInput | null;
};

export type UpdateOrganisationInput = {
  id: string;
  organisationId?: string | null;
  organisationName?: string | null;
  personaSettings?: string | null;
  status?: ContextStatus | null;
  _version?: number | null;
  partnerOrganisationsId?: string | null;
};

export type DeleteOrganisationInput = {
  id: string;
  _version?: number | null;
};

export type CreateContextMapInput = {
  id?: string | null;
  context?: string | null;
  identityProvider?: string | null;
  defaultContext?: string | null;
  _version?: number | null;
};

export type ModelContextMapConditionInput = {
  context?: ModelStringInput | null;
  identityProvider?: ModelStringInput | null;
  defaultContext?: ModelStringInput | null;
  and?: Array<ModelContextMapConditionInput | null> | null;
  or?: Array<ModelContextMapConditionInput | null> | null;
  not?: ModelContextMapConditionInput | null;
};

export type ContextMap = {
  __typename: 'ContextMap';
  id: string;
  context?: string | null;
  identityProvider?: string | null;
  defaultContext?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type UpdateContextMapInput = {
  id: string;
  context?: string | null;
  identityProvider?: string | null;
  defaultContext?: string | null;
  _version?: number | null;
};

export type DeleteContextMapInput = {
  id: string;
  _version?: number | null;
};

export type CreateReportInput = {
  id?: string | null;
  context?: string | null;
  reportDate?: string | null;
  reportName?: string | null;
  accessLevel?: AccessLevel | null;
  s3Key?: string | null;
  projectIds?: Array<string | null> | null;
  insightIds?: Array<string | null> | null;
  customProjects?: string | null;
  reportStatus?: ReportStatus | null;
  reportData?: string | null;
  _version?: number | null;
};

export type ModelReportConditionInput = {
  context?: ModelStringInput | null;
  reportDate?: ModelStringInput | null;
  reportName?: ModelStringInput | null;
  accessLevel?: ModelAccessLevelInput | null;
  s3Key?: ModelStringInput | null;
  projectIds?: ModelStringInput | null;
  insightIds?: ModelStringInput | null;
  customProjects?: ModelStringInput | null;
  reportStatus?: ModelReportStatusInput | null;
  reportData?: ModelStringInput | null;
  and?: Array<ModelReportConditionInput | null> | null;
  or?: Array<ModelReportConditionInput | null> | null;
  not?: ModelReportConditionInput | null;
};

export type ModelAccessLevelInput = {
  eq?: AccessLevel | null;
  ne?: AccessLevel | null;
};

export type ModelReportStatusInput = {
  eq?: ReportStatus | null;
  ne?: ReportStatus | null;
};

export type UpdateReportInput = {
  id: string;
  context?: string | null;
  reportDate?: string | null;
  reportName?: string | null;
  accessLevel?: AccessLevel | null;
  s3Key?: string | null;
  projectIds?: Array<string | null> | null;
  insightIds?: Array<string | null> | null;
  customProjects?: string | null;
  reportStatus?: ReportStatus | null;
  reportData?: string | null;
  _version?: number | null;
};

export type DeleteReportInput = {
  id: string;
  _version?: number | null;
};

export type CreateProjectTemplateInput = {
  id?: string | null;
  context?: string | null;
  templateId?: string | null;
  name?: string | null;
  type?: ProjectType | null;
  body?: string | null;
  status?: ProjectStatus | null;
  _version?: number | null;
};

export type ModelProjectTemplateConditionInput = {
  context?: ModelStringInput | null;
  templateId?: ModelStringInput | null;
  name?: ModelStringInput | null;
  type?: ModelProjectTypeInput | null;
  body?: ModelStringInput | null;
  status?: ModelProjectStatusInput | null;
  and?: Array<ModelProjectTemplateConditionInput | null> | null;
  or?: Array<ModelProjectTemplateConditionInput | null> | null;
  not?: ModelProjectTemplateConditionInput | null;
};

export type ModelProjectTypeInput = {
  eq?: ProjectType | null;
  ne?: ProjectType | null;
};

export type ModelProjectStatusInput = {
  eq?: ProjectStatus | null;
  ne?: ProjectStatus | null;
};

export type ProjectTemplate = {
  __typename: 'ProjectTemplate';
  id: string;
  context?: string | null;
  templateId?: string | null;
  name?: string | null;
  type?: ProjectType | null;
  body?: string | null;
  status?: ProjectStatus | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type UpdateProjectTemplateInput = {
  id: string;
  context?: string | null;
  templateId?: string | null;
  name?: string | null;
  type?: ProjectType | null;
  body?: string | null;
  status?: ProjectStatus | null;
  _version?: number | null;
};

export type DeleteProjectTemplateInput = {
  id: string;
  _version?: number | null;
};

export type CreateProjectInput = {
  id?: string | null;
  context?: string | null;
  projectId?: string | null;
  projectDate?: string | null;
  projectName?: string | null;
  projectType?: ProjectType | null;
  projectStatus?: ProjectStatus | null;
  projectBody?: string | null;
  timeLost?: number | null;
  hxScore?: number | null;
  payroll?: number | null;
  employeeCount?: number | null;
  report?: string | null;
  _version?: number | null;
  reportProjectsId?: string | null;
};

export type ModelProjectConditionInput = {
  context?: ModelStringInput | null;
  projectId?: ModelStringInput | null;
  projectDate?: ModelStringInput | null;
  projectName?: ModelStringInput | null;
  projectType?: ModelProjectTypeInput | null;
  projectStatus?: ModelProjectStatusInput | null;
  projectBody?: ModelStringInput | null;
  timeLost?: ModelFloatInput | null;
  hxScore?: ModelFloatInput | null;
  payroll?: ModelFloatInput | null;
  employeeCount?: ModelIntInput | null;
  report?: ModelStringInput | null;
  and?: Array<ModelProjectConditionInput | null> | null;
  or?: Array<ModelProjectConditionInput | null> | null;
  not?: ModelProjectConditionInput | null;
  reportProjectsId?: ModelIDInput | null;
};

export type UpdateProjectInput = {
  id: string;
  context?: string | null;
  projectId?: string | null;
  projectDate?: string | null;
  projectName?: string | null;
  projectType?: ProjectType | null;
  projectStatus?: ProjectStatus | null;
  projectBody?: string | null;
  timeLost?: number | null;
  hxScore?: number | null;
  payroll?: number | null;
  employeeCount?: number | null;
  report?: string | null;
  _version?: number | null;
  reportProjectsId?: string | null;
};

export type DeleteProjectInput = {
  id: string;
  _version?: number | null;
};

export type CreateProjectInsightInput = {
  id?: string | null;
  name?: string | null;
  insightDate?: string | null;
  s3Key?: string | null;
  context?: string | null;
  fileName?: string | null;
  _version?: number | null;
  reportInsightsId?: string | null;
};

export type ModelProjectInsightConditionInput = {
  name?: ModelStringInput | null;
  insightDate?: ModelStringInput | null;
  s3Key?: ModelStringInput | null;
  context?: ModelStringInput | null;
  fileName?: ModelStringInput | null;
  and?: Array<ModelProjectInsightConditionInput | null> | null;
  or?: Array<ModelProjectInsightConditionInput | null> | null;
  not?: ModelProjectInsightConditionInput | null;
  reportInsightsId?: ModelIDInput | null;
};

export type UpdateProjectInsightInput = {
  id: string;
  name?: string | null;
  insightDate?: string | null;
  s3Key?: string | null;
  context?: string | null;
  fileName?: string | null;
  _version?: number | null;
  reportInsightsId?: string | null;
};

export type DeleteProjectInsightInput = {
  id: string;
  _version?: number | null;
};

export type CreateDUInput = {
  id?: string | null;
  name?: string | null;
  context?: string | null;
  hxScore?: number | null;
  persona?: string | null;
  timeLost?: number | null;
  payroll?: number | null;
  revenue?: number | null;
  locationType?: LocationType | null;
  hybridPercent?: number | null;
  applications?: Array<string | null> | null;
  reportId: string;
  office?: string | null;
  country?: string | null;
  officeHx?: number | null;
  remoteHx?: number | null;
  locations?: string | null;
  analytics?: string | null;
  _version?: number | null;
  reportDusId?: string | null;
};

export type ModelDUConditionInput = {
  name?: ModelStringInput | null;
  context?: ModelStringInput | null;
  hxScore?: ModelFloatInput | null;
  persona?: ModelStringInput | null;
  timeLost?: ModelFloatInput | null;
  payroll?: ModelFloatInput | null;
  revenue?: ModelFloatInput | null;
  locationType?: ModelLocationTypeInput | null;
  hybridPercent?: ModelFloatInput | null;
  applications?: ModelStringInput | null;
  reportId?: ModelIDInput | null;
  office?: ModelStringInput | null;
  country?: ModelStringInput | null;
  officeHx?: ModelFloatInput | null;
  remoteHx?: ModelFloatInput | null;
  locations?: ModelStringInput | null;
  analytics?: ModelStringInput | null;
  and?: Array<ModelDUConditionInput | null> | null;
  or?: Array<ModelDUConditionInput | null> | null;
  not?: ModelDUConditionInput | null;
  reportDusId?: ModelIDInput | null;
};

export type UpdateDUInput = {
  id: string;
  name?: string | null;
  context?: string | null;
  hxScore?: number | null;
  persona?: string | null;
  timeLost?: number | null;
  payroll?: number | null;
  revenue?: number | null;
  locationType?: LocationType | null;
  hybridPercent?: number | null;
  applications?: Array<string | null> | null;
  reportId?: string | null;
  office?: string | null;
  country?: string | null;
  officeHx?: number | null;
  remoteHx?: number | null;
  locations?: string | null;
  analytics?: string | null;
  _version?: number | null;
  reportDusId?: string | null;
};

export type DeleteDUInput = {
  id: string;
  _version?: number | null;
};

export type CreateParseInput = {
  id?: string | null;
  context?: string | null;
  inputAnalyticCsv?: string | null;
  inputProjectCsv?: string | null;
  previewS3?: string | null;
  levers?: string | null;
  startDateTime?: string | null;
  endDateTime?: string | null;
  status?: ParseStatus | null;
  warnings?: Array<string | null> | null;
  expectedDus?: number | null;
  processedDus?: number | null;
  personaSettings?: string | null;
  _version?: number | null;
  parseReportId?: string | null;
};

export enum ParseStatus {
  UPLOADING = 'UPLOADING',
  IN_PROGRESS = 'IN_PROGRESS',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',
}

export type ModelParseConditionInput = {
  context?: ModelStringInput | null;
  inputAnalyticCsv?: ModelStringInput | null;
  inputProjectCsv?: ModelStringInput | null;
  previewS3?: ModelStringInput | null;
  levers?: ModelStringInput | null;
  startDateTime?: ModelStringInput | null;
  endDateTime?: ModelStringInput | null;
  status?: ModelParseStatusInput | null;
  warnings?: ModelStringInput | null;
  expectedDus?: ModelIntInput | null;
  processedDus?: ModelIntInput | null;
  personaSettings?: ModelStringInput | null;
  and?: Array<ModelParseConditionInput | null> | null;
  or?: Array<ModelParseConditionInput | null> | null;
  not?: ModelParseConditionInput | null;
  parseReportId?: ModelIDInput | null;
};

export type ModelParseStatusInput = {
  eq?: ParseStatus | null;
  ne?: ParseStatus | null;
};

export type Parse = {
  __typename: 'Parse';
  id: string;
  context?: string | null;
  inputAnalyticCsv?: string | null;
  inputProjectCsv?: string | null;
  previewS3?: string | null;
  levers?: string | null;
  startDateTime?: string | null;
  endDateTime?: string | null;
  status?: ParseStatus | null;
  report?: Report | null;
  warnings?: Array<string | null> | null;
  expectedDus?: number | null;
  processedDus?: number | null;
  personaSettings?: string | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  parseReportId?: string | null;
};

export type UpdateParseInput = {
  id: string;
  context?: string | null;
  inputAnalyticCsv?: string | null;
  inputProjectCsv?: string | null;
  previewS3?: string | null;
  levers?: string | null;
  startDateTime?: string | null;
  endDateTime?: string | null;
  status?: ParseStatus | null;
  warnings?: Array<string | null> | null;
  expectedDus?: number | null;
  processedDus?: number | null;
  personaSettings?: string | null;
  _version?: number | null;
  parseReportId?: string | null;
};

export type DeleteParseInput = {
  id: string;
  _version?: number | null;
};

export type CreateProjectDusInput = {
  id?: string | null;
  projectID: string;
  dUID: string;
  _version?: number | null;
};

export type ModelProjectDusConditionInput = {
  projectID?: ModelIDInput | null;
  dUID?: ModelIDInput | null;
  and?: Array<ModelProjectDusConditionInput | null> | null;
  or?: Array<ModelProjectDusConditionInput | null> | null;
  not?: ModelProjectDusConditionInput | null;
};

export type UpdateProjectDusInput = {
  id: string;
  projectID?: string | null;
  dUID?: string | null;
  _version?: number | null;
};

export type DeleteProjectDusInput = {
  id: string;
  _version?: number | null;
};

export type ModelPersonaSettingsFilterInput = {
  createdAt?: ModelStringInput | null;
  id?: ModelIDInput | null;
  organisation?: ModelStringInput | null;
  termType?: ModelStringInput | null;
  term?: ModelStringInput | null;
  and?: Array<ModelPersonaSettingsFilterInput | null> | null;
  or?: Array<ModelPersonaSettingsFilterInput | null> | null;
  not?: ModelPersonaSettingsFilterInput | null;
};

export type ModelPersonaSettingsConnection = {
  __typename: 'ModelPersonaSettingsConnection';
  items: Array<PersonaSettings | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type ModelInputAssumptionFilterInput = {
  id?: ModelIDInput | null;
  termValue?: ModelStringInput | null;
  timeWorkedPerDay?: ModelIntInput | null;
  dailyDigitalPercentage?: ModelFloatInput | null;
  payrollPerEmployee?: ModelIntInput | null;
  revenuePerEmployee?: ModelIntInput | null;
  numberOfEmployees?: ModelIntInput | null;
  and?: Array<ModelInputAssumptionFilterInput | null> | null;
  or?: Array<ModelInputAssumptionFilterInput | null> | null;
  not?: ModelInputAssumptionFilterInput | null;
  personaSettingsInputAssumptionsId?: ModelIDInput | null;
};

export type ModelApplicationUsageFilterInput = {
  id?: ModelIDInput | null;
  target?: ModelStringInput | null;
  percent?: ModelFloatInput | null;
  and?: Array<ModelApplicationUsageFilterInput | null> | null;
  or?: Array<ModelApplicationUsageFilterInput | null> | null;
  not?: ModelApplicationUsageFilterInput | null;
  inputAssumptionApplicationUsagesId?: ModelIDInput | null;
};

export type ModelOrganisationFilterInput = {
  id?: ModelIDInput | null;
  organisationId?: ModelStringInput | null;
  organisationName?: ModelStringInput | null;
  personaSettings?: ModelStringInput | null;
  status?: ModelContextStatusInput | null;
  and?: Array<ModelOrganisationFilterInput | null> | null;
  or?: Array<ModelOrganisationFilterInput | null> | null;
  not?: ModelOrganisationFilterInput | null;
  partnerOrganisationsId?: ModelIDInput | null;
};

export type ModelContextMapFilterInput = {
  id?: ModelIDInput | null;
  context?: ModelStringInput | null;
  identityProvider?: ModelStringInput | null;
  defaultContext?: ModelStringInput | null;
  and?: Array<ModelContextMapFilterInput | null> | null;
  or?: Array<ModelContextMapFilterInput | null> | null;
  not?: ModelContextMapFilterInput | null;
};

export type ModelContextMapConnection = {
  __typename: 'ModelContextMapConnection';
  items: Array<ContextMap | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type ModelReportFilterInput = {
  id?: ModelIDInput | null;
  context?: ModelStringInput | null;
  reportDate?: ModelStringInput | null;
  reportName?: ModelStringInput | null;
  accessLevel?: ModelAccessLevelInput | null;
  s3Key?: ModelStringInput | null;
  projectIds?: ModelStringInput | null;
  insightIds?: ModelStringInput | null;
  customProjects?: ModelStringInput | null;
  reportStatus?: ModelReportStatusInput | null;
  reportData?: ModelStringInput | null;
  and?: Array<ModelReportFilterInput | null> | null;
  or?: Array<ModelReportFilterInput | null> | null;
  not?: ModelReportFilterInput | null;
};

export type ModelReportConnection = {
  __typename: 'ModelReportConnection';
  items: Array<Report | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type ModelProjectTemplateFilterInput = {
  id?: ModelIDInput | null;
  context?: ModelStringInput | null;
  templateId?: ModelStringInput | null;
  name?: ModelStringInput | null;
  type?: ModelProjectTypeInput | null;
  body?: ModelStringInput | null;
  status?: ModelProjectStatusInput | null;
  and?: Array<ModelProjectTemplateFilterInput | null> | null;
  or?: Array<ModelProjectTemplateFilterInput | null> | null;
  not?: ModelProjectTemplateFilterInput | null;
};

export type ModelProjectTemplateConnection = {
  __typename: 'ModelProjectTemplateConnection';
  items: Array<ProjectTemplate | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type ModelProjectFilterInput = {
  id?: ModelIDInput | null;
  context?: ModelStringInput | null;
  projectId?: ModelStringInput | null;
  projectDate?: ModelStringInput | null;
  projectName?: ModelStringInput | null;
  projectType?: ModelProjectTypeInput | null;
  projectStatus?: ModelProjectStatusInput | null;
  projectBody?: ModelStringInput | null;
  timeLost?: ModelFloatInput | null;
  hxScore?: ModelFloatInput | null;
  payroll?: ModelFloatInput | null;
  employeeCount?: ModelIntInput | null;
  report?: ModelStringInput | null;
  and?: Array<ModelProjectFilterInput | null> | null;
  or?: Array<ModelProjectFilterInput | null> | null;
  not?: ModelProjectFilterInput | null;
  reportProjectsId?: ModelIDInput | null;
};

export type ModelProjectInsightFilterInput = {
  id?: ModelIDInput | null;
  name?: ModelStringInput | null;
  insightDate?: ModelStringInput | null;
  s3Key?: ModelStringInput | null;
  context?: ModelStringInput | null;
  fileName?: ModelStringInput | null;
  and?: Array<ModelProjectInsightFilterInput | null> | null;
  or?: Array<ModelProjectInsightFilterInput | null> | null;
  not?: ModelProjectInsightFilterInput | null;
  reportInsightsId?: ModelIDInput | null;
};

export type ModelStringKeyConditionInput = {
  eq?: string | null;
  le?: string | null;
  lt?: string | null;
  ge?: string | null;
  gt?: string | null;
  between?: Array<string | null> | null;
  beginsWith?: string | null;
};

export type ModelParseFilterInput = {
  id?: ModelIDInput | null;
  context?: ModelStringInput | null;
  inputAnalyticCsv?: ModelStringInput | null;
  inputProjectCsv?: ModelStringInput | null;
  previewS3?: ModelStringInput | null;
  levers?: ModelStringInput | null;
  startDateTime?: ModelStringInput | null;
  endDateTime?: ModelStringInput | null;
  status?: ModelParseStatusInput | null;
  warnings?: ModelStringInput | null;
  expectedDus?: ModelIntInput | null;
  processedDus?: ModelIntInput | null;
  personaSettings?: ModelStringInput | null;
  and?: Array<ModelParseFilterInput | null> | null;
  or?: Array<ModelParseFilterInput | null> | null;
  not?: ModelParseFilterInput | null;
  parseReportId?: ModelIDInput | null;
};

export type ModelParseConnection = {
  __typename: 'ModelParseConnection';
  items: Array<Parse | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type ModelProjectDusFilterInput = {
  id?: ModelIDInput | null;
  projectID?: ModelIDInput | null;
  dUID?: ModelIDInput | null;
  and?: Array<ModelProjectDusFilterInput | null> | null;
  or?: Array<ModelProjectDusFilterInput | null> | null;
  not?: ModelProjectDusFilterInput | null;
};

export type ModelSubscriptionPersonaSettingsFilterInput = {
  createdAt?: ModelSubscriptionStringInput | null;
  id?: ModelSubscriptionIDInput | null;
  organisation?: ModelSubscriptionStringInput | null;
  termType?: ModelSubscriptionStringInput | null;
  term?: ModelSubscriptionStringInput | null;
  and?: Array<ModelSubscriptionPersonaSettingsFilterInput | null> | null;
  or?: Array<ModelSubscriptionPersonaSettingsFilterInput | null> | null;
};

export type ModelSubscriptionStringInput = {
  ne?: string | null;
  eq?: string | null;
  le?: string | null;
  lt?: string | null;
  ge?: string | null;
  gt?: string | null;
  contains?: string | null;
  notContains?: string | null;
  between?: Array<string | null> | null;
  beginsWith?: string | null;
  in?: Array<string | null> | null;
  notIn?: Array<string | null> | null;
};

export type ModelSubscriptionIDInput = {
  ne?: string | null;
  eq?: string | null;
  le?: string | null;
  lt?: string | null;
  ge?: string | null;
  gt?: string | null;
  contains?: string | null;
  notContains?: string | null;
  between?: Array<string | null> | null;
  beginsWith?: string | null;
  in?: Array<string | null> | null;
  notIn?: Array<string | null> | null;
};

export type ModelSubscriptionInputAssumptionFilterInput = {
  id?: ModelSubscriptionIDInput | null;
  termValue?: ModelSubscriptionStringInput | null;
  timeWorkedPerDay?: ModelSubscriptionIntInput | null;
  dailyDigitalPercentage?: ModelSubscriptionFloatInput | null;
  payrollPerEmployee?: ModelSubscriptionIntInput | null;
  revenuePerEmployee?: ModelSubscriptionIntInput | null;
  numberOfEmployees?: ModelSubscriptionIntInput | null;
  and?: Array<ModelSubscriptionInputAssumptionFilterInput | null> | null;
  or?: Array<ModelSubscriptionInputAssumptionFilterInput | null> | null;
};

export type ModelSubscriptionIntInput = {
  ne?: number | null;
  eq?: number | null;
  le?: number | null;
  lt?: number | null;
  ge?: number | null;
  gt?: number | null;
  between?: Array<number | null> | null;
  in?: Array<number | null> | null;
  notIn?: Array<number | null> | null;
};

export type ModelSubscriptionFloatInput = {
  ne?: number | null;
  eq?: number | null;
  le?: number | null;
  lt?: number | null;
  ge?: number | null;
  gt?: number | null;
  between?: Array<number | null> | null;
  in?: Array<number | null> | null;
  notIn?: Array<number | null> | null;
};

export type ModelSubscriptionApplicationUsageFilterInput = {
  id?: ModelSubscriptionIDInput | null;
  target?: ModelSubscriptionStringInput | null;
  percent?: ModelSubscriptionFloatInput | null;
  and?: Array<ModelSubscriptionApplicationUsageFilterInput | null> | null;
  or?: Array<ModelSubscriptionApplicationUsageFilterInput | null> | null;
};

export type ModelSubscriptionPartnerFilterInput = {
  id?: ModelSubscriptionIDInput | null;
  partnerId?: ModelSubscriptionStringInput | null;
  partnerName?: ModelSubscriptionStringInput | null;
  status?: ModelSubscriptionStringInput | null;
  and?: Array<ModelSubscriptionPartnerFilterInput | null> | null;
  or?: Array<ModelSubscriptionPartnerFilterInput | null> | null;
};

export type ModelSubscriptionOrganisationFilterInput = {
  id?: ModelSubscriptionIDInput | null;
  organisationId?: ModelSubscriptionStringInput | null;
  organisationName?: ModelSubscriptionStringInput | null;
  personaSettings?: ModelSubscriptionStringInput | null;
  status?: ModelSubscriptionStringInput | null;
  and?: Array<ModelSubscriptionOrganisationFilterInput | null> | null;
  or?: Array<ModelSubscriptionOrganisationFilterInput | null> | null;
};

export type ModelSubscriptionContextMapFilterInput = {
  id?: ModelSubscriptionIDInput | null;
  context?: ModelSubscriptionStringInput | null;
  identityProvider?: ModelSubscriptionStringInput | null;
  defaultContext?: ModelSubscriptionStringInput | null;
  and?: Array<ModelSubscriptionContextMapFilterInput | null> | null;
  or?: Array<ModelSubscriptionContextMapFilterInput | null> | null;
};

export type ModelSubscriptionReportFilterInput = {
  id?: ModelSubscriptionIDInput | null;
  context?: ModelSubscriptionStringInput | null;
  reportDate?: ModelSubscriptionStringInput | null;
  reportName?: ModelSubscriptionStringInput | null;
  accessLevel?: ModelSubscriptionStringInput | null;
  s3Key?: ModelSubscriptionStringInput | null;
  projectIds?: ModelSubscriptionStringInput | null;
  insightIds?: ModelSubscriptionStringInput | null;
  customProjects?: ModelSubscriptionStringInput | null;
  reportStatus?: ModelSubscriptionStringInput | null;
  reportData?: ModelSubscriptionStringInput | null;
  and?: Array<ModelSubscriptionReportFilterInput | null> | null;
  or?: Array<ModelSubscriptionReportFilterInput | null> | null;
};

export type ModelSubscriptionProjectTemplateFilterInput = {
  id?: ModelSubscriptionIDInput | null;
  context?: ModelSubscriptionStringInput | null;
  templateId?: ModelSubscriptionStringInput | null;
  name?: ModelSubscriptionStringInput | null;
  type?: ModelSubscriptionStringInput | null;
  body?: ModelSubscriptionStringInput | null;
  status?: ModelSubscriptionStringInput | null;
  and?: Array<ModelSubscriptionProjectTemplateFilterInput | null> | null;
  or?: Array<ModelSubscriptionProjectTemplateFilterInput | null> | null;
};

export type ModelSubscriptionProjectFilterInput = {
  id?: ModelSubscriptionIDInput | null;
  context?: ModelSubscriptionStringInput | null;
  projectId?: ModelSubscriptionStringInput | null;
  projectDate?: ModelSubscriptionStringInput | null;
  projectName?: ModelSubscriptionStringInput | null;
  projectType?: ModelSubscriptionStringInput | null;
  projectStatus?: ModelSubscriptionStringInput | null;
  projectBody?: ModelSubscriptionStringInput | null;
  timeLost?: ModelSubscriptionFloatInput | null;
  hxScore?: ModelSubscriptionFloatInput | null;
  payroll?: ModelSubscriptionFloatInput | null;
  employeeCount?: ModelSubscriptionIntInput | null;
  report?: ModelSubscriptionStringInput | null;
  and?: Array<ModelSubscriptionProjectFilterInput | null> | null;
  or?: Array<ModelSubscriptionProjectFilterInput | null> | null;
};

export type ModelSubscriptionProjectInsightFilterInput = {
  id?: ModelSubscriptionIDInput | null;
  name?: ModelSubscriptionStringInput | null;
  insightDate?: ModelSubscriptionStringInput | null;
  s3Key?: ModelSubscriptionStringInput | null;
  context?: ModelSubscriptionStringInput | null;
  fileName?: ModelSubscriptionStringInput | null;
  and?: Array<ModelSubscriptionProjectInsightFilterInput | null> | null;
  or?: Array<ModelSubscriptionProjectInsightFilterInput | null> | null;
};

export type ModelSubscriptionDUFilterInput = {
  id?: ModelSubscriptionIDInput | null;
  name?: ModelSubscriptionStringInput | null;
  context?: ModelSubscriptionStringInput | null;
  hxScore?: ModelSubscriptionFloatInput | null;
  persona?: ModelSubscriptionStringInput | null;
  timeLost?: ModelSubscriptionFloatInput | null;
  payroll?: ModelSubscriptionFloatInput | null;
  revenue?: ModelSubscriptionFloatInput | null;
  locationType?: ModelSubscriptionStringInput | null;
  hybridPercent?: ModelSubscriptionFloatInput | null;
  applications?: ModelSubscriptionStringInput | null;
  reportId?: ModelSubscriptionIDInput | null;
  office?: ModelSubscriptionStringInput | null;
  country?: ModelSubscriptionStringInput | null;
  officeHx?: ModelSubscriptionFloatInput | null;
  remoteHx?: ModelSubscriptionFloatInput | null;
  locations?: ModelSubscriptionStringInput | null;
  analytics?: ModelSubscriptionStringInput | null;
  and?: Array<ModelSubscriptionDUFilterInput | null> | null;
  or?: Array<ModelSubscriptionDUFilterInput | null> | null;
};

export type ModelSubscriptionParseFilterInput = {
  id?: ModelSubscriptionIDInput | null;
  context?: ModelSubscriptionStringInput | null;
  inputAnalyticCsv?: ModelSubscriptionStringInput | null;
  inputProjectCsv?: ModelSubscriptionStringInput | null;
  previewS3?: ModelSubscriptionStringInput | null;
  levers?: ModelSubscriptionStringInput | null;
  startDateTime?: ModelSubscriptionStringInput | null;
  endDateTime?: ModelSubscriptionStringInput | null;
  status?: ModelSubscriptionStringInput | null;
  warnings?: ModelSubscriptionStringInput | null;
  expectedDus?: ModelSubscriptionIntInput | null;
  processedDus?: ModelSubscriptionIntInput | null;
  personaSettings?: ModelSubscriptionStringInput | null;
  and?: Array<ModelSubscriptionParseFilterInput | null> | null;
  or?: Array<ModelSubscriptionParseFilterInput | null> | null;
};

export type ModelSubscriptionProjectDusFilterInput = {
  id?: ModelSubscriptionIDInput | null;
  projectID?: ModelSubscriptionIDInput | null;
  dUID?: ModelSubscriptionIDInput | null;
  and?: Array<ModelSubscriptionProjectDusFilterInput | null> | null;
  or?: Array<ModelSubscriptionProjectDusFilterInput | null> | null;
};

export type ListPartnersAndOrganisationsQueryVariables = {
  filter?: ModelPartnerFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListPartnersAndOrganisationsQuery = {
  listPartners?: {
    __typename: 'ModelPartnerConnection';
    items: Array<{
      __typename: 'Partner';
      id: string;
      partnerId: string;
      partnerName?: string | null;
      organisations?: {
        __typename: 'ModelOrganisationConnection';
        nextToken?: string | null;
        startedAt?: number | null;
        items: Array<{
          __typename: 'Organisation';
          id: string;
          organisationId: string;
          organisationName?: string | null;
          createdAt: string;
          updatedAt: string;
          _version: number;
          _deleted?: boolean | null;
          _lastChangedAt: number;
          partnerOrganisationsId?: string | null;
        } | null>;
      } | null;
      createdAt: string;
      updatedAt: string;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
    } | null>;
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
};

export type DuWithProjectsByReportQueryVariables = {
  reportId: string;
  sortDirection?: ModelSortDirection | null;
  filter?: ModelDUFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type DuWithProjectsByReportQuery = {
  duByReportId?: {
    __typename: 'ModelDUConnection';
    items: Array<{
      __typename: 'DU';
      id: string;
      name?: string | null;
      hxScore?: number | null;
      persona?: string | null;
      timeLost?: number | null;
      payroll?: number | null;
      revenue?: number | null;
      locationType?: LocationType | null;
      projects?: {
        __typename: 'ModelProjectDusConnection';
        startedAt?: number | null;
        nextToken?: string | null;
        items: Array<{
          __typename: 'ProjectDus';
          project: {
            __typename: 'Project';
            id: string;
            projectName?: string | null;
            projectType?: ProjectType | null;
          };
        } | null>;
      } | null;
      office?: string | null;
      country?: string | null;
      createdAt: string;
      updatedAt: string;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
      reportDusId?: string | null;
    } | null>;
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
};

export type CreatePersonaSettingsMutationVariables = {
  input: CreatePersonaSettingsInput;
  condition?: ModelPersonaSettingsConditionInput | null;
};

export type CreatePersonaSettingsMutation = {
  createPersonaSettings?: {
    __typename: 'PersonaSettings';
    createdAt: string;
    id: string;
    organisation: string;
    termType?: string | null;
    term?: string | null;
    inputAssumptions?: {
      __typename: 'ModelInputAssumptionConnection';
      items: Array<{
        __typename: 'InputAssumption';
        id: string;
        termValue: string;
        timeWorkedPerDay?: number | null;
        dailyDigitalPercentage?: number | null;
        payrollPerEmployee?: number | null;
        revenuePerEmployee?: number | null;
        numberOfEmployees?: number | null;
        createdAt: string;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
        personaSettingsInputAssumptionsId?: string | null;
      } | null>;
      nextToken?: string | null;
      startedAt?: number | null;
    } | null;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null;
};

export type UpdatePersonaSettingsMutationVariables = {
  input: UpdatePersonaSettingsInput;
  condition?: ModelPersonaSettingsConditionInput | null;
};

export type UpdatePersonaSettingsMutation = {
  updatePersonaSettings?: {
    __typename: 'PersonaSettings';
    createdAt: string;
    id: string;
    organisation: string;
    termType?: string | null;
    term?: string | null;
    inputAssumptions?: {
      __typename: 'ModelInputAssumptionConnection';
      items: Array<{
        __typename: 'InputAssumption';
        id: string;
        termValue: string;
        timeWorkedPerDay?: number | null;
        dailyDigitalPercentage?: number | null;
        payrollPerEmployee?: number | null;
        revenuePerEmployee?: number | null;
        numberOfEmployees?: number | null;
        createdAt: string;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
        personaSettingsInputAssumptionsId?: string | null;
      } | null>;
      nextToken?: string | null;
      startedAt?: number | null;
    } | null;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null;
};

export type DeletePersonaSettingsMutationVariables = {
  input: DeletePersonaSettingsInput;
  condition?: ModelPersonaSettingsConditionInput | null;
};

export type DeletePersonaSettingsMutation = {
  deletePersonaSettings?: {
    __typename: 'PersonaSettings';
    createdAt: string;
    id: string;
    organisation: string;
    termType?: string | null;
    term?: string | null;
    inputAssumptions?: {
      __typename: 'ModelInputAssumptionConnection';
      items: Array<{
        __typename: 'InputAssumption';
        id: string;
        termValue: string;
        timeWorkedPerDay?: number | null;
        dailyDigitalPercentage?: number | null;
        payrollPerEmployee?: number | null;
        revenuePerEmployee?: number | null;
        numberOfEmployees?: number | null;
        createdAt: string;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
        personaSettingsInputAssumptionsId?: string | null;
      } | null>;
      nextToken?: string | null;
      startedAt?: number | null;
    } | null;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null;
};

export type CreateInputAssumptionMutationVariables = {
  input: CreateInputAssumptionInput;
  condition?: ModelInputAssumptionConditionInput | null;
};

export type CreateInputAssumptionMutation = {
  createInputAssumption?: {
    __typename: 'InputAssumption';
    id: string;
    termValue: string;
    timeWorkedPerDay?: number | null;
    dailyDigitalPercentage?: number | null;
    payrollPerEmployee?: number | null;
    revenuePerEmployee?: number | null;
    numberOfEmployees?: number | null;
    applicationUsages?: {
      __typename: 'ModelApplicationUsageConnection';
      items: Array<{
        __typename: 'ApplicationUsage';
        id: string;
        target: string;
        percent: number;
        createdAt: string;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
        inputAssumptionApplicationUsagesId?: string | null;
      } | null>;
      nextToken?: string | null;
      startedAt?: number | null;
    } | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    personaSettingsInputAssumptionsId?: string | null;
  } | null;
};

export type UpdateInputAssumptionMutationVariables = {
  input: UpdateInputAssumptionInput;
  condition?: ModelInputAssumptionConditionInput | null;
};

export type UpdateInputAssumptionMutation = {
  updateInputAssumption?: {
    __typename: 'InputAssumption';
    id: string;
    termValue: string;
    timeWorkedPerDay?: number | null;
    dailyDigitalPercentage?: number | null;
    payrollPerEmployee?: number | null;
    revenuePerEmployee?: number | null;
    numberOfEmployees?: number | null;
    applicationUsages?: {
      __typename: 'ModelApplicationUsageConnection';
      items: Array<{
        __typename: 'ApplicationUsage';
        id: string;
        target: string;
        percent: number;
        createdAt: string;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
        inputAssumptionApplicationUsagesId?: string | null;
      } | null>;
      nextToken?: string | null;
      startedAt?: number | null;
    } | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    personaSettingsInputAssumptionsId?: string | null;
  } | null;
};

export type DeleteInputAssumptionMutationVariables = {
  input: DeleteInputAssumptionInput;
  condition?: ModelInputAssumptionConditionInput | null;
};

export type DeleteInputAssumptionMutation = {
  deleteInputAssumption?: {
    __typename: 'InputAssumption';
    id: string;
    termValue: string;
    timeWorkedPerDay?: number | null;
    dailyDigitalPercentage?: number | null;
    payrollPerEmployee?: number | null;
    revenuePerEmployee?: number | null;
    numberOfEmployees?: number | null;
    applicationUsages?: {
      __typename: 'ModelApplicationUsageConnection';
      items: Array<{
        __typename: 'ApplicationUsage';
        id: string;
        target: string;
        percent: number;
        createdAt: string;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
        inputAssumptionApplicationUsagesId?: string | null;
      } | null>;
      nextToken?: string | null;
      startedAt?: number | null;
    } | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    personaSettingsInputAssumptionsId?: string | null;
  } | null;
};

export type CreateApplicationUsageMutationVariables = {
  input: CreateApplicationUsageInput;
  condition?: ModelApplicationUsageConditionInput | null;
};

export type CreateApplicationUsageMutation = {
  createApplicationUsage?: {
    __typename: 'ApplicationUsage';
    id: string;
    target: string;
    percent: number;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    inputAssumptionApplicationUsagesId?: string | null;
  } | null;
};

export type UpdateApplicationUsageMutationVariables = {
  input: UpdateApplicationUsageInput;
  condition?: ModelApplicationUsageConditionInput | null;
};

export type UpdateApplicationUsageMutation = {
  updateApplicationUsage?: {
    __typename: 'ApplicationUsage';
    id: string;
    target: string;
    percent: number;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    inputAssumptionApplicationUsagesId?: string | null;
  } | null;
};

export type DeleteApplicationUsageMutationVariables = {
  input: DeleteApplicationUsageInput;
  condition?: ModelApplicationUsageConditionInput | null;
};

export type DeleteApplicationUsageMutation = {
  deleteApplicationUsage?: {
    __typename: 'ApplicationUsage';
    id: string;
    target: string;
    percent: number;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    inputAssumptionApplicationUsagesId?: string | null;
  } | null;
};

export type CreatePartnerMutationVariables = {
  input: CreatePartnerInput;
  condition?: ModelPartnerConditionInput | null;
};

export type CreatePartnerMutation = {
  createPartner?: {
    __typename: 'Partner';
    id: string;
    partnerId: string;
    partnerName?: string | null;
    organisations?: {
      __typename: 'ModelOrganisationConnection';
      items: Array<{
        __typename: 'Organisation';
        id: string;
        organisationId: string;
        organisationName?: string | null;
        personaSettings?: string | null;
        status?: ContextStatus | null;
        createdAt: string;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
        partnerOrganisationsId?: string | null;
      } | null>;
      nextToken?: string | null;
      startedAt?: number | null;
    } | null;
    status?: ContextStatus | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null;
};

export type UpdatePartnerMutationVariables = {
  input: UpdatePartnerInput;
  condition?: ModelPartnerConditionInput | null;
};

export type UpdatePartnerMutation = {
  updatePartner?: {
    __typename: 'Partner';
    id: string;
    partnerId: string;
    partnerName?: string | null;
    organisations?: {
      __typename: 'ModelOrganisationConnection';
      items: Array<{
        __typename: 'Organisation';
        id: string;
        organisationId: string;
        organisationName?: string | null;
        personaSettings?: string | null;
        status?: ContextStatus | null;
        createdAt: string;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
        partnerOrganisationsId?: string | null;
      } | null>;
      nextToken?: string | null;
      startedAt?: number | null;
    } | null;
    status?: ContextStatus | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null;
};

export type DeletePartnerMutationVariables = {
  input: DeletePartnerInput;
  condition?: ModelPartnerConditionInput | null;
};

export type DeletePartnerMutation = {
  deletePartner?: {
    __typename: 'Partner';
    id: string;
    partnerId: string;
    partnerName?: string | null;
    organisations?: {
      __typename: 'ModelOrganisationConnection';
      items: Array<{
        __typename: 'Organisation';
        id: string;
        organisationId: string;
        organisationName?: string | null;
        personaSettings?: string | null;
        status?: ContextStatus | null;
        createdAt: string;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
        partnerOrganisationsId?: string | null;
      } | null>;
      nextToken?: string | null;
      startedAt?: number | null;
    } | null;
    status?: ContextStatus | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null;
};

export type CreateOrganisationMutationVariables = {
  input: CreateOrganisationInput;
  condition?: ModelOrganisationConditionInput | null;
};

export type CreateOrganisationMutation = {
  createOrganisation?: {
    __typename: 'Organisation';
    id: string;
    organisationId: string;
    organisationName?: string | null;
    partner?: {
      __typename: 'Partner';
      id: string;
      partnerId: string;
      partnerName?: string | null;
      organisations?: {
        __typename: 'ModelOrganisationConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      status?: ContextStatus | null;
      createdAt: string;
      updatedAt: string;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
    } | null;
    personaSettings?: string | null;
    status?: ContextStatus | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    partnerOrganisationsId?: string | null;
  } | null;
};

export type UpdateOrganisationMutationVariables = {
  input: UpdateOrganisationInput;
  condition?: ModelOrganisationConditionInput | null;
};

export type UpdateOrganisationMutation = {
  updateOrganisation?: {
    __typename: 'Organisation';
    id: string;
    organisationId: string;
    organisationName?: string | null;
    partner?: {
      __typename: 'Partner';
      id: string;
      partnerId: string;
      partnerName?: string | null;
      organisations?: {
        __typename: 'ModelOrganisationConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      status?: ContextStatus | null;
      createdAt: string;
      updatedAt: string;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
    } | null;
    personaSettings?: string | null;
    status?: ContextStatus | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    partnerOrganisationsId?: string | null;
  } | null;
};

export type DeleteOrganisationMutationVariables = {
  input: DeleteOrganisationInput;
  condition?: ModelOrganisationConditionInput | null;
};

export type DeleteOrganisationMutation = {
  deleteOrganisation?: {
    __typename: 'Organisation';
    id: string;
    organisationId: string;
    organisationName?: string | null;
    partner?: {
      __typename: 'Partner';
      id: string;
      partnerId: string;
      partnerName?: string | null;
      organisations?: {
        __typename: 'ModelOrganisationConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      status?: ContextStatus | null;
      createdAt: string;
      updatedAt: string;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
    } | null;
    personaSettings?: string | null;
    status?: ContextStatus | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    partnerOrganisationsId?: string | null;
  } | null;
};

export type CreateContextMapMutationVariables = {
  input: CreateContextMapInput;
  condition?: ModelContextMapConditionInput | null;
};

export type CreateContextMapMutation = {
  createContextMap?: {
    __typename: 'ContextMap';
    id: string;
    context?: string | null;
    identityProvider?: string | null;
    defaultContext?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null;
};

export type UpdateContextMapMutationVariables = {
  input: UpdateContextMapInput;
  condition?: ModelContextMapConditionInput | null;
};

export type UpdateContextMapMutation = {
  updateContextMap?: {
    __typename: 'ContextMap';
    id: string;
    context?: string | null;
    identityProvider?: string | null;
    defaultContext?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null;
};

export type DeleteContextMapMutationVariables = {
  input: DeleteContextMapInput;
  condition?: ModelContextMapConditionInput | null;
};

export type DeleteContextMapMutation = {
  deleteContextMap?: {
    __typename: 'ContextMap';
    id: string;
    context?: string | null;
    identityProvider?: string | null;
    defaultContext?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null;
};

export type CreateReportMutationVariables = {
  input: CreateReportInput;
  condition?: ModelReportConditionInput | null;
};

export type CreateReportMutation = {
  createReport?: {
    __typename: 'Report';
    id: string;
    context?: string | null;
    reportDate?: string | null;
    reportName?: string | null;
    accessLevel?: AccessLevel | null;
    s3Key?: string | null;
    projects?: {
      __typename: 'ModelProjectConnection';
      items: Array<{
        __typename: 'Project';
        id: string;
        context?: string | null;
        projectId?: string | null;
        projectDate?: string | null;
        projectName?: string | null;
        projectType?: ProjectType | null;
        projectStatus?: ProjectStatus | null;
        projectBody?: string | null;
        timeLost?: number | null;
        hxScore?: number | null;
        payroll?: number | null;
        employeeCount?: number | null;
        report?: string | null;
        createdAt: string;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
        reportProjectsId?: string | null;
      } | null>;
      nextToken?: string | null;
      startedAt?: number | null;
    } | null;
    insights?: {
      __typename: 'ModelProjectInsightConnection';
      items: Array<{
        __typename: 'ProjectInsight';
        id: string;
        name?: string | null;
        insightDate?: string | null;
        s3Key?: string | null;
        context?: string | null;
        fileName?: string | null;
        createdAt: string;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
        reportInsightsId?: string | null;
      } | null>;
      nextToken?: string | null;
      startedAt?: number | null;
    } | null;
    projectIds?: Array<string | null> | null;
    insightIds?: Array<string | null> | null;
    customProjects?: string | null;
    reportStatus?: ReportStatus | null;
    dus?: {
      __typename: 'ModelDUConnection';
      items: Array<{
        __typename: 'DU';
        id: string;
        name?: string | null;
        context?: string | null;
        hxScore?: number | null;
        persona?: string | null;
        timeLost?: number | null;
        payroll?: number | null;
        revenue?: number | null;
        locationType?: LocationType | null;
        hybridPercent?: number | null;
        applications?: Array<string | null> | null;
        reportId: string;
        office?: string | null;
        country?: string | null;
        officeHx?: number | null;
        remoteHx?: number | null;
        locations?: string | null;
        analytics?: string | null;
        createdAt: string;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
        reportDusId?: string | null;
      } | null>;
      nextToken?: string | null;
      startedAt?: number | null;
    } | null;
    reportData?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null;
};

export type UpdateReportMutationVariables = {
  input: UpdateReportInput;
  condition?: ModelReportConditionInput | null;
};

export type UpdateReportMutation = {
  updateReport?: {
    __typename: 'Report';
    id: string;
    context?: string | null;
    reportDate?: string | null;
    reportName?: string | null;
    accessLevel?: AccessLevel | null;
    s3Key?: string | null;
    projects?: {
      __typename: 'ModelProjectConnection';
      items: Array<{
        __typename: 'Project';
        id: string;
        context?: string | null;
        projectId?: string | null;
        projectDate?: string | null;
        projectName?: string | null;
        projectType?: ProjectType | null;
        projectStatus?: ProjectStatus | null;
        projectBody?: string | null;
        timeLost?: number | null;
        hxScore?: number | null;
        payroll?: number | null;
        employeeCount?: number | null;
        report?: string | null;
        createdAt: string;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
        reportProjectsId?: string | null;
      } | null>;
      nextToken?: string | null;
      startedAt?: number | null;
    } | null;
    insights?: {
      __typename: 'ModelProjectInsightConnection';
      items: Array<{
        __typename: 'ProjectInsight';
        id: string;
        name?: string | null;
        insightDate?: string | null;
        s3Key?: string | null;
        context?: string | null;
        fileName?: string | null;
        createdAt: string;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
        reportInsightsId?: string | null;
      } | null>;
      nextToken?: string | null;
      startedAt?: number | null;
    } | null;
    projectIds?: Array<string | null> | null;
    insightIds?: Array<string | null> | null;
    customProjects?: string | null;
    reportStatus?: ReportStatus | null;
    dus?: {
      __typename: 'ModelDUConnection';
      items: Array<{
        __typename: 'DU';
        id: string;
        name?: string | null;
        context?: string | null;
        hxScore?: number | null;
        persona?: string | null;
        timeLost?: number | null;
        payroll?: number | null;
        revenue?: number | null;
        locationType?: LocationType | null;
        hybridPercent?: number | null;
        applications?: Array<string | null> | null;
        reportId: string;
        office?: string | null;
        country?: string | null;
        officeHx?: number | null;
        remoteHx?: number | null;
        locations?: string | null;
        analytics?: string | null;
        createdAt: string;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
        reportDusId?: string | null;
      } | null>;
      nextToken?: string | null;
      startedAt?: number | null;
    } | null;
    reportData?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null;
};

export type DeleteReportMutationVariables = {
  input: DeleteReportInput;
  condition?: ModelReportConditionInput | null;
};

export type DeleteReportMutation = {
  deleteReport?: {
    __typename: 'Report';
    id: string;
    context?: string | null;
    reportDate?: string | null;
    reportName?: string | null;
    accessLevel?: AccessLevel | null;
    s3Key?: string | null;
    projects?: {
      __typename: 'ModelProjectConnection';
      items: Array<{
        __typename: 'Project';
        id: string;
        context?: string | null;
        projectId?: string | null;
        projectDate?: string | null;
        projectName?: string | null;
        projectType?: ProjectType | null;
        projectStatus?: ProjectStatus | null;
        projectBody?: string | null;
        timeLost?: number | null;
        hxScore?: number | null;
        payroll?: number | null;
        employeeCount?: number | null;
        report?: string | null;
        createdAt: string;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
        reportProjectsId?: string | null;
      } | null>;
      nextToken?: string | null;
      startedAt?: number | null;
    } | null;
    insights?: {
      __typename: 'ModelProjectInsightConnection';
      items: Array<{
        __typename: 'ProjectInsight';
        id: string;
        name?: string | null;
        insightDate?: string | null;
        s3Key?: string | null;
        context?: string | null;
        fileName?: string | null;
        createdAt: string;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
        reportInsightsId?: string | null;
      } | null>;
      nextToken?: string | null;
      startedAt?: number | null;
    } | null;
    projectIds?: Array<string | null> | null;
    insightIds?: Array<string | null> | null;
    customProjects?: string | null;
    reportStatus?: ReportStatus | null;
    dus?: {
      __typename: 'ModelDUConnection';
      items: Array<{
        __typename: 'DU';
        id: string;
        name?: string | null;
        context?: string | null;
        hxScore?: number | null;
        persona?: string | null;
        timeLost?: number | null;
        payroll?: number | null;
        revenue?: number | null;
        locationType?: LocationType | null;
        hybridPercent?: number | null;
        applications?: Array<string | null> | null;
        reportId: string;
        office?: string | null;
        country?: string | null;
        officeHx?: number | null;
        remoteHx?: number | null;
        locations?: string | null;
        analytics?: string | null;
        createdAt: string;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
        reportDusId?: string | null;
      } | null>;
      nextToken?: string | null;
      startedAt?: number | null;
    } | null;
    reportData?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null;
};

export type CreateProjectTemplateMutationVariables = {
  input: CreateProjectTemplateInput;
  condition?: ModelProjectTemplateConditionInput | null;
};

export type CreateProjectTemplateMutation = {
  createProjectTemplate?: {
    __typename: 'ProjectTemplate';
    id: string;
    context?: string | null;
    templateId?: string | null;
    name?: string | null;
    type?: ProjectType | null;
    body?: string | null;
    status?: ProjectStatus | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null;
};

export type UpdateProjectTemplateMutationVariables = {
  input: UpdateProjectTemplateInput;
  condition?: ModelProjectTemplateConditionInput | null;
};

export type UpdateProjectTemplateMutation = {
  updateProjectTemplate?: {
    __typename: 'ProjectTemplate';
    id: string;
    context?: string | null;
    templateId?: string | null;
    name?: string | null;
    type?: ProjectType | null;
    body?: string | null;
    status?: ProjectStatus | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null;
};

export type DeleteProjectTemplateMutationVariables = {
  input: DeleteProjectTemplateInput;
  condition?: ModelProjectTemplateConditionInput | null;
};

export type DeleteProjectTemplateMutation = {
  deleteProjectTemplate?: {
    __typename: 'ProjectTemplate';
    id: string;
    context?: string | null;
    templateId?: string | null;
    name?: string | null;
    type?: ProjectType | null;
    body?: string | null;
    status?: ProjectStatus | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null;
};

export type CreateProjectMutationVariables = {
  input: CreateProjectInput;
  condition?: ModelProjectConditionInput | null;
};

export type CreateProjectMutation = {
  createProject?: {
    __typename: 'Project';
    id: string;
    context?: string | null;
    projectId?: string | null;
    projectDate?: string | null;
    projectName?: string | null;
    projectType?: ProjectType | null;
    projectStatus?: ProjectStatus | null;
    projectBody?: string | null;
    timeLost?: number | null;
    hxScore?: number | null;
    payroll?: number | null;
    employeeCount?: number | null;
    report?: string | null;
    dus?: {
      __typename: 'ModelProjectDusConnection';
      items: Array<{
        __typename: 'ProjectDus';
        id: string;
        projectID: string;
        dUID: string;
        createdAt: string;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
      } | null>;
      nextToken?: string | null;
      startedAt?: number | null;
    } | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    reportProjectsId?: string | null;
  } | null;
};

export type UpdateProjectMutationVariables = {
  input: UpdateProjectInput;
  condition?: ModelProjectConditionInput | null;
};

export type UpdateProjectMutation = {
  updateProject?: {
    __typename: 'Project';
    id: string;
    context?: string | null;
    projectId?: string | null;
    projectDate?: string | null;
    projectName?: string | null;
    projectType?: ProjectType | null;
    projectStatus?: ProjectStatus | null;
    projectBody?: string | null;
    timeLost?: number | null;
    hxScore?: number | null;
    payroll?: number | null;
    employeeCount?: number | null;
    report?: string | null;
    dus?: {
      __typename: 'ModelProjectDusConnection';
      items: Array<{
        __typename: 'ProjectDus';
        id: string;
        projectID: string;
        dUID: string;
        createdAt: string;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
      } | null>;
      nextToken?: string | null;
      startedAt?: number | null;
    } | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    reportProjectsId?: string | null;
  } | null;
};

export type DeleteProjectMutationVariables = {
  input: DeleteProjectInput;
  condition?: ModelProjectConditionInput | null;
};

export type DeleteProjectMutation = {
  deleteProject?: {
    __typename: 'Project';
    id: string;
    context?: string | null;
    projectId?: string | null;
    projectDate?: string | null;
    projectName?: string | null;
    projectType?: ProjectType | null;
    projectStatus?: ProjectStatus | null;
    projectBody?: string | null;
    timeLost?: number | null;
    hxScore?: number | null;
    payroll?: number | null;
    employeeCount?: number | null;
    report?: string | null;
    dus?: {
      __typename: 'ModelProjectDusConnection';
      items: Array<{
        __typename: 'ProjectDus';
        id: string;
        projectID: string;
        dUID: string;
        createdAt: string;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
      } | null>;
      nextToken?: string | null;
      startedAt?: number | null;
    } | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    reportProjectsId?: string | null;
  } | null;
};

export type CreateProjectInsightMutationVariables = {
  input: CreateProjectInsightInput;
  condition?: ModelProjectInsightConditionInput | null;
};

export type CreateProjectInsightMutation = {
  createProjectInsight?: {
    __typename: 'ProjectInsight';
    id: string;
    name?: string | null;
    insightDate?: string | null;
    s3Key?: string | null;
    context?: string | null;
    fileName?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    reportInsightsId?: string | null;
  } | null;
};

export type UpdateProjectInsightMutationVariables = {
  input: UpdateProjectInsightInput;
  condition?: ModelProjectInsightConditionInput | null;
};

export type UpdateProjectInsightMutation = {
  updateProjectInsight?: {
    __typename: 'ProjectInsight';
    id: string;
    name?: string | null;
    insightDate?: string | null;
    s3Key?: string | null;
    context?: string | null;
    fileName?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    reportInsightsId?: string | null;
  } | null;
};

export type DeleteProjectInsightMutationVariables = {
  input: DeleteProjectInsightInput;
  condition?: ModelProjectInsightConditionInput | null;
};

export type DeleteProjectInsightMutation = {
  deleteProjectInsight?: {
    __typename: 'ProjectInsight';
    id: string;
    name?: string | null;
    insightDate?: string | null;
    s3Key?: string | null;
    context?: string | null;
    fileName?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    reportInsightsId?: string | null;
  } | null;
};

export type CreateDUMutationVariables = {
  input: CreateDUInput;
  condition?: ModelDUConditionInput | null;
};

export type CreateDUMutation = {
  createDU?: {
    __typename: 'DU';
    id: string;
    name?: string | null;
    context?: string | null;
    hxScore?: number | null;
    persona?: string | null;
    timeLost?: number | null;
    payroll?: number | null;
    revenue?: number | null;
    locationType?: LocationType | null;
    hybridPercent?: number | null;
    applications?: Array<string | null> | null;
    projects?: {
      __typename: 'ModelProjectDusConnection';
      items: Array<{
        __typename: 'ProjectDus';
        id: string;
        projectID: string;
        dUID: string;
        createdAt: string;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
      } | null>;
      nextToken?: string | null;
      startedAt?: number | null;
    } | null;
    reportId: string;
    report?: {
      __typename: 'Report';
      id: string;
      context?: string | null;
      reportDate?: string | null;
      reportName?: string | null;
      accessLevel?: AccessLevel | null;
      s3Key?: string | null;
      projects?: {
        __typename: 'ModelProjectConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      insights?: {
        __typename: 'ModelProjectInsightConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      projectIds?: Array<string | null> | null;
      insightIds?: Array<string | null> | null;
      customProjects?: string | null;
      reportStatus?: ReportStatus | null;
      dus?: {
        __typename: 'ModelDUConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      reportData?: string | null;
      createdAt: string;
      updatedAt: string;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
    } | null;
    office?: string | null;
    country?: string | null;
    officeHx?: number | null;
    remoteHx?: number | null;
    locations?: string | null;
    analytics?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    reportDusId?: string | null;
  } | null;
};

export type UpdateDUMutationVariables = {
  input: UpdateDUInput;
  condition?: ModelDUConditionInput | null;
};

export type UpdateDUMutation = {
  updateDU?: {
    __typename: 'DU';
    id: string;
    name?: string | null;
    context?: string | null;
    hxScore?: number | null;
    persona?: string | null;
    timeLost?: number | null;
    payroll?: number | null;
    revenue?: number | null;
    locationType?: LocationType | null;
    hybridPercent?: number | null;
    applications?: Array<string | null> | null;
    projects?: {
      __typename: 'ModelProjectDusConnection';
      items: Array<{
        __typename: 'ProjectDus';
        id: string;
        projectID: string;
        dUID: string;
        createdAt: string;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
      } | null>;
      nextToken?: string | null;
      startedAt?: number | null;
    } | null;
    reportId: string;
    report?: {
      __typename: 'Report';
      id: string;
      context?: string | null;
      reportDate?: string | null;
      reportName?: string | null;
      accessLevel?: AccessLevel | null;
      s3Key?: string | null;
      projects?: {
        __typename: 'ModelProjectConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      insights?: {
        __typename: 'ModelProjectInsightConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      projectIds?: Array<string | null> | null;
      insightIds?: Array<string | null> | null;
      customProjects?: string | null;
      reportStatus?: ReportStatus | null;
      dus?: {
        __typename: 'ModelDUConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      reportData?: string | null;
      createdAt: string;
      updatedAt: string;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
    } | null;
    office?: string | null;
    country?: string | null;
    officeHx?: number | null;
    remoteHx?: number | null;
    locations?: string | null;
    analytics?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    reportDusId?: string | null;
  } | null;
};

export type DeleteDUMutationVariables = {
  input: DeleteDUInput;
  condition?: ModelDUConditionInput | null;
};

export type DeleteDUMutation = {
  deleteDU?: {
    __typename: 'DU';
    id: string;
    name?: string | null;
    context?: string | null;
    hxScore?: number | null;
    persona?: string | null;
    timeLost?: number | null;
    payroll?: number | null;
    revenue?: number | null;
    locationType?: LocationType | null;
    hybridPercent?: number | null;
    applications?: Array<string | null> | null;
    projects?: {
      __typename: 'ModelProjectDusConnection';
      items: Array<{
        __typename: 'ProjectDus';
        id: string;
        projectID: string;
        dUID: string;
        createdAt: string;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
      } | null>;
      nextToken?: string | null;
      startedAt?: number | null;
    } | null;
    reportId: string;
    report?: {
      __typename: 'Report';
      id: string;
      context?: string | null;
      reportDate?: string | null;
      reportName?: string | null;
      accessLevel?: AccessLevel | null;
      s3Key?: string | null;
      projects?: {
        __typename: 'ModelProjectConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      insights?: {
        __typename: 'ModelProjectInsightConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      projectIds?: Array<string | null> | null;
      insightIds?: Array<string | null> | null;
      customProjects?: string | null;
      reportStatus?: ReportStatus | null;
      dus?: {
        __typename: 'ModelDUConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      reportData?: string | null;
      createdAt: string;
      updatedAt: string;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
    } | null;
    office?: string | null;
    country?: string | null;
    officeHx?: number | null;
    remoteHx?: number | null;
    locations?: string | null;
    analytics?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    reportDusId?: string | null;
  } | null;
};

export type CreateParseMutationVariables = {
  input: CreateParseInput;
  condition?: ModelParseConditionInput | null;
};

export type CreateParseMutation = {
  createParse?: {
    __typename: 'Parse';
    id: string;
    context?: string | null;
    inputAnalyticCsv?: string | null;
    inputProjectCsv?: string | null;
    previewS3?: string | null;
    levers?: string | null;
    startDateTime?: string | null;
    endDateTime?: string | null;
    status?: ParseStatus | null;
    report?: {
      __typename: 'Report';
      id: string;
      context?: string | null;
      reportDate?: string | null;
      reportName?: string | null;
      accessLevel?: AccessLevel | null;
      s3Key?: string | null;
      projects?: {
        __typename: 'ModelProjectConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      insights?: {
        __typename: 'ModelProjectInsightConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      projectIds?: Array<string | null> | null;
      insightIds?: Array<string | null> | null;
      customProjects?: string | null;
      reportStatus?: ReportStatus | null;
      dus?: {
        __typename: 'ModelDUConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      reportData?: string | null;
      createdAt: string;
      updatedAt: string;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
    } | null;
    warnings?: Array<string | null> | null;
    expectedDus?: number | null;
    processedDus?: number | null;
    personaSettings?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    parseReportId?: string | null;
  } | null;
};

export type UpdateParseMutationVariables = {
  input: UpdateParseInput;
  condition?: ModelParseConditionInput | null;
};

export type UpdateParseMutation = {
  updateParse?: {
    __typename: 'Parse';
    id: string;
    context?: string | null;
    inputAnalyticCsv?: string | null;
    inputProjectCsv?: string | null;
    previewS3?: string | null;
    levers?: string | null;
    startDateTime?: string | null;
    endDateTime?: string | null;
    status?: ParseStatus | null;
    report?: {
      __typename: 'Report';
      id: string;
      context?: string | null;
      reportDate?: string | null;
      reportName?: string | null;
      accessLevel?: AccessLevel | null;
      s3Key?: string | null;
      projects?: {
        __typename: 'ModelProjectConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      insights?: {
        __typename: 'ModelProjectInsightConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      projectIds?: Array<string | null> | null;
      insightIds?: Array<string | null> | null;
      customProjects?: string | null;
      reportStatus?: ReportStatus | null;
      dus?: {
        __typename: 'ModelDUConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      reportData?: string | null;
      createdAt: string;
      updatedAt: string;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
    } | null;
    warnings?: Array<string | null> | null;
    expectedDus?: number | null;
    processedDus?: number | null;
    personaSettings?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    parseReportId?: string | null;
  } | null;
};

export type DeleteParseMutationVariables = {
  input: DeleteParseInput;
  condition?: ModelParseConditionInput | null;
};

export type DeleteParseMutation = {
  deleteParse?: {
    __typename: 'Parse';
    id: string;
    context?: string | null;
    inputAnalyticCsv?: string | null;
    inputProjectCsv?: string | null;
    previewS3?: string | null;
    levers?: string | null;
    startDateTime?: string | null;
    endDateTime?: string | null;
    status?: ParseStatus | null;
    report?: {
      __typename: 'Report';
      id: string;
      context?: string | null;
      reportDate?: string | null;
      reportName?: string | null;
      accessLevel?: AccessLevel | null;
      s3Key?: string | null;
      projects?: {
        __typename: 'ModelProjectConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      insights?: {
        __typename: 'ModelProjectInsightConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      projectIds?: Array<string | null> | null;
      insightIds?: Array<string | null> | null;
      customProjects?: string | null;
      reportStatus?: ReportStatus | null;
      dus?: {
        __typename: 'ModelDUConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      reportData?: string | null;
      createdAt: string;
      updatedAt: string;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
    } | null;
    warnings?: Array<string | null> | null;
    expectedDus?: number | null;
    processedDus?: number | null;
    personaSettings?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    parseReportId?: string | null;
  } | null;
};

export type CreateProjectDusMutationVariables = {
  input: CreateProjectDusInput;
  condition?: ModelProjectDusConditionInput | null;
};

export type CreateProjectDusMutation = {
  createProjectDus?: {
    __typename: 'ProjectDus';
    id: string;
    projectID: string;
    dUID: string;
    project: {
      __typename: 'Project';
      id: string;
      context?: string | null;
      projectId?: string | null;
      projectDate?: string | null;
      projectName?: string | null;
      projectType?: ProjectType | null;
      projectStatus?: ProjectStatus | null;
      projectBody?: string | null;
      timeLost?: number | null;
      hxScore?: number | null;
      payroll?: number | null;
      employeeCount?: number | null;
      report?: string | null;
      dus?: {
        __typename: 'ModelProjectDusConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      createdAt: string;
      updatedAt: string;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
      reportProjectsId?: string | null;
    };
    dU: {
      __typename: 'DU';
      id: string;
      name?: string | null;
      context?: string | null;
      hxScore?: number | null;
      persona?: string | null;
      timeLost?: number | null;
      payroll?: number | null;
      revenue?: number | null;
      locationType?: LocationType | null;
      hybridPercent?: number | null;
      applications?: Array<string | null> | null;
      projects?: {
        __typename: 'ModelProjectDusConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      reportId: string;
      report?: {
        __typename: 'Report';
        id: string;
        context?: string | null;
        reportDate?: string | null;
        reportName?: string | null;
        accessLevel?: AccessLevel | null;
        s3Key?: string | null;
        projectIds?: Array<string | null> | null;
        insightIds?: Array<string | null> | null;
        customProjects?: string | null;
        reportStatus?: ReportStatus | null;
        reportData?: string | null;
        createdAt: string;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
      } | null;
      office?: string | null;
      country?: string | null;
      officeHx?: number | null;
      remoteHx?: number | null;
      locations?: string | null;
      analytics?: string | null;
      createdAt: string;
      updatedAt: string;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
      reportDusId?: string | null;
    };
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null;
};

export type UpdateProjectDusMutationVariables = {
  input: UpdateProjectDusInput;
  condition?: ModelProjectDusConditionInput | null;
};

export type UpdateProjectDusMutation = {
  updateProjectDus?: {
    __typename: 'ProjectDus';
    id: string;
    projectID: string;
    dUID: string;
    project: {
      __typename: 'Project';
      id: string;
      context?: string | null;
      projectId?: string | null;
      projectDate?: string | null;
      projectName?: string | null;
      projectType?: ProjectType | null;
      projectStatus?: ProjectStatus | null;
      projectBody?: string | null;
      timeLost?: number | null;
      hxScore?: number | null;
      payroll?: number | null;
      employeeCount?: number | null;
      report?: string | null;
      dus?: {
        __typename: 'ModelProjectDusConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      createdAt: string;
      updatedAt: string;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
      reportProjectsId?: string | null;
    };
    dU: {
      __typename: 'DU';
      id: string;
      name?: string | null;
      context?: string | null;
      hxScore?: number | null;
      persona?: string | null;
      timeLost?: number | null;
      payroll?: number | null;
      revenue?: number | null;
      locationType?: LocationType | null;
      hybridPercent?: number | null;
      applications?: Array<string | null> | null;
      projects?: {
        __typename: 'ModelProjectDusConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      reportId: string;
      report?: {
        __typename: 'Report';
        id: string;
        context?: string | null;
        reportDate?: string | null;
        reportName?: string | null;
        accessLevel?: AccessLevel | null;
        s3Key?: string | null;
        projectIds?: Array<string | null> | null;
        insightIds?: Array<string | null> | null;
        customProjects?: string | null;
        reportStatus?: ReportStatus | null;
        reportData?: string | null;
        createdAt: string;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
      } | null;
      office?: string | null;
      country?: string | null;
      officeHx?: number | null;
      remoteHx?: number | null;
      locations?: string | null;
      analytics?: string | null;
      createdAt: string;
      updatedAt: string;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
      reportDusId?: string | null;
    };
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null;
};

export type DeleteProjectDusMutationVariables = {
  input: DeleteProjectDusInput;
  condition?: ModelProjectDusConditionInput | null;
};

export type DeleteProjectDusMutation = {
  deleteProjectDus?: {
    __typename: 'ProjectDus';
    id: string;
    projectID: string;
    dUID: string;
    project: {
      __typename: 'Project';
      id: string;
      context?: string | null;
      projectId?: string | null;
      projectDate?: string | null;
      projectName?: string | null;
      projectType?: ProjectType | null;
      projectStatus?: ProjectStatus | null;
      projectBody?: string | null;
      timeLost?: number | null;
      hxScore?: number | null;
      payroll?: number | null;
      employeeCount?: number | null;
      report?: string | null;
      dus?: {
        __typename: 'ModelProjectDusConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      createdAt: string;
      updatedAt: string;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
      reportProjectsId?: string | null;
    };
    dU: {
      __typename: 'DU';
      id: string;
      name?: string | null;
      context?: string | null;
      hxScore?: number | null;
      persona?: string | null;
      timeLost?: number | null;
      payroll?: number | null;
      revenue?: number | null;
      locationType?: LocationType | null;
      hybridPercent?: number | null;
      applications?: Array<string | null> | null;
      projects?: {
        __typename: 'ModelProjectDusConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      reportId: string;
      report?: {
        __typename: 'Report';
        id: string;
        context?: string | null;
        reportDate?: string | null;
        reportName?: string | null;
        accessLevel?: AccessLevel | null;
        s3Key?: string | null;
        projectIds?: Array<string | null> | null;
        insightIds?: Array<string | null> | null;
        customProjects?: string | null;
        reportStatus?: ReportStatus | null;
        reportData?: string | null;
        createdAt: string;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
      } | null;
      office?: string | null;
      country?: string | null;
      officeHx?: number | null;
      remoteHx?: number | null;
      locations?: string | null;
      analytics?: string | null;
      createdAt: string;
      updatedAt: string;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
      reportDusId?: string | null;
    };
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null;
};

export type GetPersonaSettingsQueryVariables = {
  id: string;
};

export type GetPersonaSettingsQuery = {
  getPersonaSettings?: {
    __typename: 'PersonaSettings';
    createdAt: string;
    id: string;
    organisation: string;
    termType?: string | null;
    term?: string | null;
    inputAssumptions?: {
      __typename: 'ModelInputAssumptionConnection';
      items: Array<{
        __typename: 'InputAssumption';
        id: string;
        termValue: string;
        timeWorkedPerDay?: number | null;
        dailyDigitalPercentage?: number | null;
        payrollPerEmployee?: number | null;
        revenuePerEmployee?: number | null;
        numberOfEmployees?: number | null;
        createdAt: string;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
        personaSettingsInputAssumptionsId?: string | null;
      } | null>;
      nextToken?: string | null;
      startedAt?: number | null;
    } | null;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null;
};

export type ListPersonaSettingsQueryVariables = {
  filter?: ModelPersonaSettingsFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListPersonaSettingsQuery = {
  listPersonaSettings?: {
    __typename: 'ModelPersonaSettingsConnection';
    items: Array<{
      __typename: 'PersonaSettings';
      createdAt: string;
      id: string;
      organisation: string;
      termType?: string | null;
      term?: string | null;
      inputAssumptions?: {
        __typename: 'ModelInputAssumptionConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      updatedAt: string;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
    } | null>;
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
};

export type SyncPersonaSettingsQueryVariables = {
  filter?: ModelPersonaSettingsFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
  lastSync?: number | null;
};

export type SyncPersonaSettingsQuery = {
  syncPersonaSettings?: {
    __typename: 'ModelPersonaSettingsConnection';
    items: Array<{
      __typename: 'PersonaSettings';
      createdAt: string;
      id: string;
      organisation: string;
      termType?: string | null;
      term?: string | null;
      inputAssumptions?: {
        __typename: 'ModelInputAssumptionConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      updatedAt: string;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
    } | null>;
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
};

export type GetInputAssumptionQueryVariables = {
  id: string;
};

export type GetInputAssumptionQuery = {
  getInputAssumption?: {
    __typename: 'InputAssumption';
    id: string;
    termValue: string;
    timeWorkedPerDay?: number | null;
    dailyDigitalPercentage?: number | null;
    payrollPerEmployee?: number | null;
    revenuePerEmployee?: number | null;
    numberOfEmployees?: number | null;
    applicationUsages?: {
      __typename: 'ModelApplicationUsageConnection';
      items: Array<{
        __typename: 'ApplicationUsage';
        id: string;
        target: string;
        percent: number;
        createdAt: string;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
        inputAssumptionApplicationUsagesId?: string | null;
      } | null>;
      nextToken?: string | null;
      startedAt?: number | null;
    } | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    personaSettingsInputAssumptionsId?: string | null;
  } | null;
};

export type ListInputAssumptionsQueryVariables = {
  filter?: ModelInputAssumptionFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListInputAssumptionsQuery = {
  listInputAssumptions?: {
    __typename: 'ModelInputAssumptionConnection';
    items: Array<{
      __typename: 'InputAssumption';
      id: string;
      termValue: string;
      timeWorkedPerDay?: number | null;
      dailyDigitalPercentage?: number | null;
      payrollPerEmployee?: number | null;
      revenuePerEmployee?: number | null;
      numberOfEmployees?: number | null;
      applicationUsages?: {
        __typename: 'ModelApplicationUsageConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      createdAt: string;
      updatedAt: string;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
      personaSettingsInputAssumptionsId?: string | null;
    } | null>;
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
};

export type SyncInputAssumptionsQueryVariables = {
  filter?: ModelInputAssumptionFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
  lastSync?: number | null;
};

export type SyncInputAssumptionsQuery = {
  syncInputAssumptions?: {
    __typename: 'ModelInputAssumptionConnection';
    items: Array<{
      __typename: 'InputAssumption';
      id: string;
      termValue: string;
      timeWorkedPerDay?: number | null;
      dailyDigitalPercentage?: number | null;
      payrollPerEmployee?: number | null;
      revenuePerEmployee?: number | null;
      numberOfEmployees?: number | null;
      applicationUsages?: {
        __typename: 'ModelApplicationUsageConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      createdAt: string;
      updatedAt: string;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
      personaSettingsInputAssumptionsId?: string | null;
    } | null>;
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
};

export type GetApplicationUsageQueryVariables = {
  id: string;
};

export type GetApplicationUsageQuery = {
  getApplicationUsage?: {
    __typename: 'ApplicationUsage';
    id: string;
    target: string;
    percent: number;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    inputAssumptionApplicationUsagesId?: string | null;
  } | null;
};

export type ListApplicationUsagesQueryVariables = {
  filter?: ModelApplicationUsageFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListApplicationUsagesQuery = {
  listApplicationUsages?: {
    __typename: 'ModelApplicationUsageConnection';
    items: Array<{
      __typename: 'ApplicationUsage';
      id: string;
      target: string;
      percent: number;
      createdAt: string;
      updatedAt: string;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
      inputAssumptionApplicationUsagesId?: string | null;
    } | null>;
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
};

export type SyncApplicationUsagesQueryVariables = {
  filter?: ModelApplicationUsageFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
  lastSync?: number | null;
};

export type SyncApplicationUsagesQuery = {
  syncApplicationUsages?: {
    __typename: 'ModelApplicationUsageConnection';
    items: Array<{
      __typename: 'ApplicationUsage';
      id: string;
      target: string;
      percent: number;
      createdAt: string;
      updatedAt: string;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
      inputAssumptionApplicationUsagesId?: string | null;
    } | null>;
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
};

export type UsageByTargetQueryVariables = {
  target: string;
  sortDirection?: ModelSortDirection | null;
  filter?: ModelApplicationUsageFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type UsageByTargetQuery = {
  usageByTarget?: {
    __typename: 'ModelApplicationUsageConnection';
    items: Array<{
      __typename: 'ApplicationUsage';
      id: string;
      target: string;
      percent: number;
      createdAt: string;
      updatedAt: string;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
      inputAssumptionApplicationUsagesId?: string | null;
    } | null>;
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
};

export type GetPartnerQueryVariables = {
  id: string;
};

export type GetPartnerQuery = {
  getPartner?: {
    __typename: 'Partner';
    id: string;
    partnerId: string;
    partnerName?: string | null;
    organisations?: {
      __typename: 'ModelOrganisationConnection';
      items: Array<{
        __typename: 'Organisation';
        id: string;
        organisationId: string;
        organisationName?: string | null;
        personaSettings?: string | null;
        status?: ContextStatus | null;
        createdAt: string;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
        partnerOrganisationsId?: string | null;
      } | null>;
      nextToken?: string | null;
      startedAt?: number | null;
    } | null;
    status?: ContextStatus | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null;
};

export type ListPartnersQueryVariables = {
  filter?: ModelPartnerFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListPartnersQuery = {
  listPartners?: {
    __typename: 'ModelPartnerConnection';
    items: Array<{
      __typename: 'Partner';
      id: string;
      partnerId: string;
      partnerName?: string | null;
      organisations?: {
        __typename: 'ModelOrganisationConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      status?: ContextStatus | null;
      createdAt: string;
      updatedAt: string;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
    } | null>;
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
};

export type SyncPartnersQueryVariables = {
  filter?: ModelPartnerFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
  lastSync?: number | null;
};

export type SyncPartnersQuery = {
  syncPartners?: {
    __typename: 'ModelPartnerConnection';
    items: Array<{
      __typename: 'Partner';
      id: string;
      partnerId: string;
      partnerName?: string | null;
      organisations?: {
        __typename: 'ModelOrganisationConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      status?: ContextStatus | null;
      createdAt: string;
      updatedAt: string;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
    } | null>;
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
};

export type PartnerByPartnerIdQueryVariables = {
  partnerId: string;
  sortDirection?: ModelSortDirection | null;
  filter?: ModelPartnerFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type PartnerByPartnerIdQuery = {
  partnerByPartnerId?: {
    __typename: 'ModelPartnerConnection';
    items: Array<{
      __typename: 'Partner';
      id: string;
      partnerId: string;
      partnerName?: string | null;
      organisations?: {
        __typename: 'ModelOrganisationConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      status?: ContextStatus | null;
      createdAt: string;
      updatedAt: string;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
    } | null>;
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
};

export type GetOrganisationQueryVariables = {
  id: string;
};

export type GetOrganisationQuery = {
  getOrganisation?: {
    __typename: 'Organisation';
    id: string;
    organisationId: string;
    organisationName?: string | null;
    partner?: {
      __typename: 'Partner';
      id: string;
      partnerId: string;
      partnerName?: string | null;
      organisations?: {
        __typename: 'ModelOrganisationConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      status?: ContextStatus | null;
      createdAt: string;
      updatedAt: string;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
    } | null;
    personaSettings?: string | null;
    status?: ContextStatus | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    partnerOrganisationsId?: string | null;
  } | null;
};

export type ListOrganisationsQueryVariables = {
  filter?: ModelOrganisationFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListOrganisationsQuery = {
  listOrganisations?: {
    __typename: 'ModelOrganisationConnection';
    items: Array<{
      __typename: 'Organisation';
      id: string;
      organisationId: string;
      organisationName?: string | null;
      partner?: {
        __typename: 'Partner';
        id: string;
        partnerId: string;
        partnerName?: string | null;
        status?: ContextStatus | null;
        createdAt: string;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
      } | null;
      personaSettings?: string | null;
      status?: ContextStatus | null;
      createdAt: string;
      updatedAt: string;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
      partnerOrganisationsId?: string | null;
    } | null>;
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
};

export type SyncOrganisationsQueryVariables = {
  filter?: ModelOrganisationFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
  lastSync?: number | null;
};

export type SyncOrganisationsQuery = {
  syncOrganisations?: {
    __typename: 'ModelOrganisationConnection';
    items: Array<{
      __typename: 'Organisation';
      id: string;
      organisationId: string;
      organisationName?: string | null;
      partner?: {
        __typename: 'Partner';
        id: string;
        partnerId: string;
        partnerName?: string | null;
        status?: ContextStatus | null;
        createdAt: string;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
      } | null;
      personaSettings?: string | null;
      status?: ContextStatus | null;
      createdAt: string;
      updatedAt: string;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
      partnerOrganisationsId?: string | null;
    } | null>;
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
};

export type OrganisationByOrganisationIdQueryVariables = {
  organisationId: string;
  sortDirection?: ModelSortDirection | null;
  filter?: ModelOrganisationFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type OrganisationByOrganisationIdQuery = {
  organisationByOrganisationId?: {
    __typename: 'ModelOrganisationConnection';
    items: Array<{
      __typename: 'Organisation';
      id: string;
      organisationId: string;
      organisationName?: string | null;
      partner?: {
        __typename: 'Partner';
        id: string;
        partnerId: string;
        partnerName?: string | null;
        status?: ContextStatus | null;
        createdAt: string;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
      } | null;
      personaSettings?: string | null;
      status?: ContextStatus | null;
      createdAt: string;
      updatedAt: string;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
      partnerOrganisationsId?: string | null;
    } | null>;
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
};

export type GetContextMapQueryVariables = {
  id: string;
};

export type GetContextMapQuery = {
  getContextMap?: {
    __typename: 'ContextMap';
    id: string;
    context?: string | null;
    identityProvider?: string | null;
    defaultContext?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null;
};

export type ListContextMapsQueryVariables = {
  filter?: ModelContextMapFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListContextMapsQuery = {
  listContextMaps?: {
    __typename: 'ModelContextMapConnection';
    items: Array<{
      __typename: 'ContextMap';
      id: string;
      context?: string | null;
      identityProvider?: string | null;
      defaultContext?: string | null;
      createdAt: string;
      updatedAt: string;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
    } | null>;
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
};

export type SyncContextMapsQueryVariables = {
  filter?: ModelContextMapFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
  lastSync?: number | null;
};

export type SyncContextMapsQuery = {
  syncContextMaps?: {
    __typename: 'ModelContextMapConnection';
    items: Array<{
      __typename: 'ContextMap';
      id: string;
      context?: string | null;
      identityProvider?: string | null;
      defaultContext?: string | null;
      createdAt: string;
      updatedAt: string;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
    } | null>;
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
};

export type ContextByIdentityProviderQueryVariables = {
  identityProvider: string;
  sortDirection?: ModelSortDirection | null;
  filter?: ModelContextMapFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ContextByIdentityProviderQuery = {
  contextByIdentityProvider?: {
    __typename: 'ModelContextMapConnection';
    items: Array<{
      __typename: 'ContextMap';
      id: string;
      context?: string | null;
      identityProvider?: string | null;
      defaultContext?: string | null;
      createdAt: string;
      updatedAt: string;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
    } | null>;
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
};

export type GetReportQueryVariables = {
  id: string;
};

export type GetReportQuery = {
  getReport?: {
    __typename: 'Report';
    id: string;
    context?: string | null;
    reportDate?: string | null;
    reportName?: string | null;
    accessLevel?: AccessLevel | null;
    s3Key?: string | null;
    projects?: {
      __typename: 'ModelProjectConnection';
      items: Array<{
        __typename: 'Project';
        id: string;
        context?: string | null;
        projectId?: string | null;
        projectDate?: string | null;
        projectName?: string | null;
        projectType?: ProjectType | null;
        projectStatus?: ProjectStatus | null;
        projectBody?: string | null;
        timeLost?: number | null;
        hxScore?: number | null;
        payroll?: number | null;
        employeeCount?: number | null;
        report?: string | null;
        createdAt: string;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
        reportProjectsId?: string | null;
      } | null>;
      nextToken?: string | null;
      startedAt?: number | null;
    } | null;
    insights?: {
      __typename: 'ModelProjectInsightConnection';
      items: Array<{
        __typename: 'ProjectInsight';
        id: string;
        name?: string | null;
        insightDate?: string | null;
        s3Key?: string | null;
        context?: string | null;
        fileName?: string | null;
        createdAt: string;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
        reportInsightsId?: string | null;
      } | null>;
      nextToken?: string | null;
      startedAt?: number | null;
    } | null;
    projectIds?: Array<string | null> | null;
    insightIds?: Array<string | null> | null;
    customProjects?: string | null;
    reportStatus?: ReportStatus | null;
    dus?: {
      __typename: 'ModelDUConnection';
      items: Array<{
        __typename: 'DU';
        id: string;
        name?: string | null;
        context?: string | null;
        hxScore?: number | null;
        persona?: string | null;
        timeLost?: number | null;
        payroll?: number | null;
        revenue?: number | null;
        locationType?: LocationType | null;
        hybridPercent?: number | null;
        applications?: Array<string | null> | null;
        reportId: string;
        office?: string | null;
        country?: string | null;
        officeHx?: number | null;
        remoteHx?: number | null;
        locations?: string | null;
        analytics?: string | null;
        createdAt: string;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
        reportDusId?: string | null;
      } | null>;
      nextToken?: string | null;
      startedAt?: number | null;
    } | null;
    reportData?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null;
};

export type ListReportsQueryVariables = {
  filter?: ModelReportFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListReportsQuery = {
  listReports?: {
    __typename: 'ModelReportConnection';
    items: Array<{
      __typename: 'Report';
      id: string;
      context?: string | null;
      reportDate?: string | null;
      reportName?: string | null;
      accessLevel?: AccessLevel | null;
      s3Key?: string | null;
      projects?: {
        __typename: 'ModelProjectConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      insights?: {
        __typename: 'ModelProjectInsightConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      projectIds?: Array<string | null> | null;
      insightIds?: Array<string | null> | null;
      customProjects?: string | null;
      reportStatus?: ReportStatus | null;
      dus?: {
        __typename: 'ModelDUConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      reportData?: string | null;
      createdAt: string;
      updatedAt: string;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
    } | null>;
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
};

export type SyncReportsQueryVariables = {
  filter?: ModelReportFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
  lastSync?: number | null;
};

export type SyncReportsQuery = {
  syncReports?: {
    __typename: 'ModelReportConnection';
    items: Array<{
      __typename: 'Report';
      id: string;
      context?: string | null;
      reportDate?: string | null;
      reportName?: string | null;
      accessLevel?: AccessLevel | null;
      s3Key?: string | null;
      projects?: {
        __typename: 'ModelProjectConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      insights?: {
        __typename: 'ModelProjectInsightConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      projectIds?: Array<string | null> | null;
      insightIds?: Array<string | null> | null;
      customProjects?: string | null;
      reportStatus?: ReportStatus | null;
      dus?: {
        __typename: 'ModelDUConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      reportData?: string | null;
      createdAt: string;
      updatedAt: string;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
    } | null>;
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
};

export type ReportByContextQueryVariables = {
  context: string;
  sortDirection?: ModelSortDirection | null;
  filter?: ModelReportFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ReportByContextQuery = {
  reportByContext?: {
    __typename: 'ModelReportConnection';
    items: Array<{
      __typename: 'Report';
      id: string;
      context?: string | null;
      reportDate?: string | null;
      reportName?: string | null;
      accessLevel?: AccessLevel | null;
      s3Key?: string | null;
      projects?: {
        __typename: 'ModelProjectConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      insights?: {
        __typename: 'ModelProjectInsightConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      projectIds?: Array<string | null> | null;
      insightIds?: Array<string | null> | null;
      customProjects?: string | null;
      reportStatus?: ReportStatus | null;
      dus?: {
        __typename: 'ModelDUConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      reportData?: string | null;
      createdAt: string;
      updatedAt: string;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
    } | null>;
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
};

export type ReportByReportDateQueryVariables = {
  reportDate: string;
  sortDirection?: ModelSortDirection | null;
  filter?: ModelReportFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ReportByReportDateQuery = {
  reportByReportDate?: {
    __typename: 'ModelReportConnection';
    items: Array<{
      __typename: 'Report';
      id: string;
      context?: string | null;
      reportDate?: string | null;
      reportName?: string | null;
      accessLevel?: AccessLevel | null;
      s3Key?: string | null;
      projects?: {
        __typename: 'ModelProjectConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      insights?: {
        __typename: 'ModelProjectInsightConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      projectIds?: Array<string | null> | null;
      insightIds?: Array<string | null> | null;
      customProjects?: string | null;
      reportStatus?: ReportStatus | null;
      dus?: {
        __typename: 'ModelDUConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      reportData?: string | null;
      createdAt: string;
      updatedAt: string;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
    } | null>;
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
};

export type GetProjectTemplateQueryVariables = {
  id: string;
};

export type GetProjectTemplateQuery = {
  getProjectTemplate?: {
    __typename: 'ProjectTemplate';
    id: string;
    context?: string | null;
    templateId?: string | null;
    name?: string | null;
    type?: ProjectType | null;
    body?: string | null;
    status?: ProjectStatus | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null;
};

export type ListProjectTemplatesQueryVariables = {
  filter?: ModelProjectTemplateFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListProjectTemplatesQuery = {
  listProjectTemplates?: {
    __typename: 'ModelProjectTemplateConnection';
    items: Array<{
      __typename: 'ProjectTemplate';
      id: string;
      context?: string | null;
      templateId?: string | null;
      name?: string | null;
      type?: ProjectType | null;
      body?: string | null;
      status?: ProjectStatus | null;
      createdAt: string;
      updatedAt: string;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
    } | null>;
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
};

export type SyncProjectTemplatesQueryVariables = {
  filter?: ModelProjectTemplateFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
  lastSync?: number | null;
};

export type SyncProjectTemplatesQuery = {
  syncProjectTemplates?: {
    __typename: 'ModelProjectTemplateConnection';
    items: Array<{
      __typename: 'ProjectTemplate';
      id: string;
      context?: string | null;
      templateId?: string | null;
      name?: string | null;
      type?: ProjectType | null;
      body?: string | null;
      status?: ProjectStatus | null;
      createdAt: string;
      updatedAt: string;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
    } | null>;
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
};

export type ProjectTemplateByContextQueryVariables = {
  context: string;
  sortDirection?: ModelSortDirection | null;
  filter?: ModelProjectTemplateFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ProjectTemplateByContextQuery = {
  projectTemplateByContext?: {
    __typename: 'ModelProjectTemplateConnection';
    items: Array<{
      __typename: 'ProjectTemplate';
      id: string;
      context?: string | null;
      templateId?: string | null;
      name?: string | null;
      type?: ProjectType | null;
      body?: string | null;
      status?: ProjectStatus | null;
      createdAt: string;
      updatedAt: string;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
    } | null>;
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
};

export type ProjectTemplateByTemplateIdQueryVariables = {
  templateId: string;
  sortDirection?: ModelSortDirection | null;
  filter?: ModelProjectTemplateFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ProjectTemplateByTemplateIdQuery = {
  projectTemplateByTemplateId?: {
    __typename: 'ModelProjectTemplateConnection';
    items: Array<{
      __typename: 'ProjectTemplate';
      id: string;
      context?: string | null;
      templateId?: string | null;
      name?: string | null;
      type?: ProjectType | null;
      body?: string | null;
      status?: ProjectStatus | null;
      createdAt: string;
      updatedAt: string;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
    } | null>;
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
};

export type GetProjectQueryVariables = {
  id: string;
};

export type GetProjectQuery = {
  getProject?: {
    __typename: 'Project';
    id: string;
    context?: string | null;
    projectId?: string | null;
    projectDate?: string | null;
    projectName?: string | null;
    projectType?: ProjectType | null;
    projectStatus?: ProjectStatus | null;
    projectBody?: string | null;
    timeLost?: number | null;
    hxScore?: number | null;
    payroll?: number | null;
    employeeCount?: number | null;
    report?: string | null;
    dus?: {
      __typename: 'ModelProjectDusConnection';
      items: Array<{
        __typename: 'ProjectDus';
        id: string;
        projectID: string;
        dUID: string;
        createdAt: string;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
      } | null>;
      nextToken?: string | null;
      startedAt?: number | null;
    } | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    reportProjectsId?: string | null;
  } | null;
};

export type ListProjectsQueryVariables = {
  filter?: ModelProjectFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListProjectsQuery = {
  listProjects?: {
    __typename: 'ModelProjectConnection';
    items: Array<{
      __typename: 'Project';
      id: string;
      context?: string | null;
      projectId?: string | null;
      projectDate?: string | null;
      projectName?: string | null;
      projectType?: ProjectType | null;
      projectStatus?: ProjectStatus | null;
      projectBody?: string | null;
      timeLost?: number | null;
      hxScore?: number | null;
      payroll?: number | null;
      employeeCount?: number | null;
      report?: string | null;
      dus?: {
        __typename: 'ModelProjectDusConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      createdAt: string;
      updatedAt: string;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
      reportProjectsId?: string | null;
    } | null>;
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
};

export type SyncProjectsQueryVariables = {
  filter?: ModelProjectFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
  lastSync?: number | null;
};

export type SyncProjectsQuery = {
  syncProjects?: {
    __typename: 'ModelProjectConnection';
    items: Array<{
      __typename: 'Project';
      id: string;
      context?: string | null;
      projectId?: string | null;
      projectDate?: string | null;
      projectName?: string | null;
      projectType?: ProjectType | null;
      projectStatus?: ProjectStatus | null;
      projectBody?: string | null;
      timeLost?: number | null;
      hxScore?: number | null;
      payroll?: number | null;
      employeeCount?: number | null;
      report?: string | null;
      dus?: {
        __typename: 'ModelProjectDusConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      createdAt: string;
      updatedAt: string;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
      reportProjectsId?: string | null;
    } | null>;
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
};

export type ProjectByContextQueryVariables = {
  context: string;
  sortDirection?: ModelSortDirection | null;
  filter?: ModelProjectFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ProjectByContextQuery = {
  projectByContext?: {
    __typename: 'ModelProjectConnection';
    items: Array<{
      __typename: 'Project';
      id: string;
      context?: string | null;
      projectId?: string | null;
      projectDate?: string | null;
      projectName?: string | null;
      projectType?: ProjectType | null;
      projectStatus?: ProjectStatus | null;
      projectBody?: string | null;
      timeLost?: number | null;
      hxScore?: number | null;
      payroll?: number | null;
      employeeCount?: number | null;
      report?: string | null;
      dus?: {
        __typename: 'ModelProjectDusConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      createdAt: string;
      updatedAt: string;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
      reportProjectsId?: string | null;
    } | null>;
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
};

export type ProjectByProjectIdQueryVariables = {
  projectId: string;
  sortDirection?: ModelSortDirection | null;
  filter?: ModelProjectFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ProjectByProjectIdQuery = {
  projectByProjectId?: {
    __typename: 'ModelProjectConnection';
    items: Array<{
      __typename: 'Project';
      id: string;
      context?: string | null;
      projectId?: string | null;
      projectDate?: string | null;
      projectName?: string | null;
      projectType?: ProjectType | null;
      projectStatus?: ProjectStatus | null;
      projectBody?: string | null;
      timeLost?: number | null;
      hxScore?: number | null;
      payroll?: number | null;
      employeeCount?: number | null;
      report?: string | null;
      dus?: {
        __typename: 'ModelProjectDusConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      createdAt: string;
      updatedAt: string;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
      reportProjectsId?: string | null;
    } | null>;
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
};

export type GetProjectInsightQueryVariables = {
  id: string;
};

export type GetProjectInsightQuery = {
  getProjectInsight?: {
    __typename: 'ProjectInsight';
    id: string;
    name?: string | null;
    insightDate?: string | null;
    s3Key?: string | null;
    context?: string | null;
    fileName?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    reportInsightsId?: string | null;
  } | null;
};

export type ListProjectInsightsQueryVariables = {
  filter?: ModelProjectInsightFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListProjectInsightsQuery = {
  listProjectInsights?: {
    __typename: 'ModelProjectInsightConnection';
    items: Array<{
      __typename: 'ProjectInsight';
      id: string;
      name?: string | null;
      insightDate?: string | null;
      s3Key?: string | null;
      context?: string | null;
      fileName?: string | null;
      createdAt: string;
      updatedAt: string;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
      reportInsightsId?: string | null;
    } | null>;
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
};

export type SyncProjectInsightsQueryVariables = {
  filter?: ModelProjectInsightFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
  lastSync?: number | null;
};

export type SyncProjectInsightsQuery = {
  syncProjectInsights?: {
    __typename: 'ModelProjectInsightConnection';
    items: Array<{
      __typename: 'ProjectInsight';
      id: string;
      name?: string | null;
      insightDate?: string | null;
      s3Key?: string | null;
      context?: string | null;
      fileName?: string | null;
      createdAt: string;
      updatedAt: string;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
      reportInsightsId?: string | null;
    } | null>;
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
};

export type ProjectInsightByContextQueryVariables = {
  context: string;
  sortDirection?: ModelSortDirection | null;
  filter?: ModelProjectInsightFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ProjectInsightByContextQuery = {
  projectInsightByContext?: {
    __typename: 'ModelProjectInsightConnection';
    items: Array<{
      __typename: 'ProjectInsight';
      id: string;
      name?: string | null;
      insightDate?: string | null;
      s3Key?: string | null;
      context?: string | null;
      fileName?: string | null;
      createdAt: string;
      updatedAt: string;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
      reportInsightsId?: string | null;
    } | null>;
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
};

export type GetDUQueryVariables = {
  id: string;
};

export type GetDUQuery = {
  getDU?: {
    __typename: 'DU';
    id: string;
    name?: string | null;
    context?: string | null;
    hxScore?: number | null;
    persona?: string | null;
    timeLost?: number | null;
    payroll?: number | null;
    revenue?: number | null;
    locationType?: LocationType | null;
    hybridPercent?: number | null;
    applications?: Array<string | null> | null;
    projects?: {
      __typename: 'ModelProjectDusConnection';
      items: Array<{
        __typename: 'ProjectDus';
        id: string;
        projectID: string;
        dUID: string;
        createdAt: string;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
      } | null>;
      nextToken?: string | null;
      startedAt?: number | null;
    } | null;
    reportId: string;
    report?: {
      __typename: 'Report';
      id: string;
      context?: string | null;
      reportDate?: string | null;
      reportName?: string | null;
      accessLevel?: AccessLevel | null;
      s3Key?: string | null;
      projects?: {
        __typename: 'ModelProjectConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      insights?: {
        __typename: 'ModelProjectInsightConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      projectIds?: Array<string | null> | null;
      insightIds?: Array<string | null> | null;
      customProjects?: string | null;
      reportStatus?: ReportStatus | null;
      dus?: {
        __typename: 'ModelDUConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      reportData?: string | null;
      createdAt: string;
      updatedAt: string;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
    } | null;
    office?: string | null;
    country?: string | null;
    officeHx?: number | null;
    remoteHx?: number | null;
    locations?: string | null;
    analytics?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    reportDusId?: string | null;
  } | null;
};

export type ListDUSQueryVariables = {
  filter?: ModelDUFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListDUSQuery = {
  listDUS?: {
    __typename: 'ModelDUConnection';
    items: Array<{
      __typename: 'DU';
      id: string;
      name?: string | null;
      context?: string | null;
      hxScore?: number | null;
      persona?: string | null;
      timeLost?: number | null;
      payroll?: number | null;
      revenue?: number | null;
      locationType?: LocationType | null;
      hybridPercent?: number | null;
      applications?: Array<string | null> | null;
      projects?: {
        __typename: 'ModelProjectDusConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      reportId: string;
      report?: {
        __typename: 'Report';
        id: string;
        context?: string | null;
        reportDate?: string | null;
        reportName?: string | null;
        accessLevel?: AccessLevel | null;
        s3Key?: string | null;
        projectIds?: Array<string | null> | null;
        insightIds?: Array<string | null> | null;
        customProjects?: string | null;
        reportStatus?: ReportStatus | null;
        reportData?: string | null;
        createdAt: string;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
      } | null;
      office?: string | null;
      country?: string | null;
      officeHx?: number | null;
      remoteHx?: number | null;
      locations?: string | null;
      analytics?: string | null;
      createdAt: string;
      updatedAt: string;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
      reportDusId?: string | null;
    } | null>;
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
};

export type SyncDUSQueryVariables = {
  filter?: ModelDUFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
  lastSync?: number | null;
};

export type SyncDUSQuery = {
  syncDUS?: {
    __typename: 'ModelDUConnection';
    items: Array<{
      __typename: 'DU';
      id: string;
      name?: string | null;
      context?: string | null;
      hxScore?: number | null;
      persona?: string | null;
      timeLost?: number | null;
      payroll?: number | null;
      revenue?: number | null;
      locationType?: LocationType | null;
      hybridPercent?: number | null;
      applications?: Array<string | null> | null;
      projects?: {
        __typename: 'ModelProjectDusConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      reportId: string;
      report?: {
        __typename: 'Report';
        id: string;
        context?: string | null;
        reportDate?: string | null;
        reportName?: string | null;
        accessLevel?: AccessLevel | null;
        s3Key?: string | null;
        projectIds?: Array<string | null> | null;
        insightIds?: Array<string | null> | null;
        customProjects?: string | null;
        reportStatus?: ReportStatus | null;
        reportData?: string | null;
        createdAt: string;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
      } | null;
      office?: string | null;
      country?: string | null;
      officeHx?: number | null;
      remoteHx?: number | null;
      locations?: string | null;
      analytics?: string | null;
      createdAt: string;
      updatedAt: string;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
      reportDusId?: string | null;
    } | null>;
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
};

export type DuByNameQueryVariables = {
  name: string;
  sortDirection?: ModelSortDirection | null;
  filter?: ModelDUFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type DuByNameQuery = {
  duByName?: {
    __typename: 'ModelDUConnection';
    items: Array<{
      __typename: 'DU';
      id: string;
      name?: string | null;
      context?: string | null;
      hxScore?: number | null;
      persona?: string | null;
      timeLost?: number | null;
      payroll?: number | null;
      revenue?: number | null;
      locationType?: LocationType | null;
      hybridPercent?: number | null;
      applications?: Array<string | null> | null;
      projects?: {
        __typename: 'ModelProjectDusConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      reportId: string;
      report?: {
        __typename: 'Report';
        id: string;
        context?: string | null;
        reportDate?: string | null;
        reportName?: string | null;
        accessLevel?: AccessLevel | null;
        s3Key?: string | null;
        projectIds?: Array<string | null> | null;
        insightIds?: Array<string | null> | null;
        customProjects?: string | null;
        reportStatus?: ReportStatus | null;
        reportData?: string | null;
        createdAt: string;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
      } | null;
      office?: string | null;
      country?: string | null;
      officeHx?: number | null;
      remoteHx?: number | null;
      locations?: string | null;
      analytics?: string | null;
      createdAt: string;
      updatedAt: string;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
      reportDusId?: string | null;
    } | null>;
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
};

export type DuByContextQueryVariables = {
  context: string;
  sortDirection?: ModelSortDirection | null;
  filter?: ModelDUFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type DuByContextQuery = {
  duByContext?: {
    __typename: 'ModelDUConnection';
    items: Array<{
      __typename: 'DU';
      id: string;
      name?: string | null;
      context?: string | null;
      hxScore?: number | null;
      persona?: string | null;
      timeLost?: number | null;
      payroll?: number | null;
      revenue?: number | null;
      locationType?: LocationType | null;
      hybridPercent?: number | null;
      applications?: Array<string | null> | null;
      projects?: {
        __typename: 'ModelProjectDusConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      reportId: string;
      report?: {
        __typename: 'Report';
        id: string;
        context?: string | null;
        reportDate?: string | null;
        reportName?: string | null;
        accessLevel?: AccessLevel | null;
        s3Key?: string | null;
        projectIds?: Array<string | null> | null;
        insightIds?: Array<string | null> | null;
        customProjects?: string | null;
        reportStatus?: ReportStatus | null;
        reportData?: string | null;
        createdAt: string;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
      } | null;
      office?: string | null;
      country?: string | null;
      officeHx?: number | null;
      remoteHx?: number | null;
      locations?: string | null;
      analytics?: string | null;
      createdAt: string;
      updatedAt: string;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
      reportDusId?: string | null;
    } | null>;
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
};

export type DuByPersonaQueryVariables = {
  persona: string;
  sortDirection?: ModelSortDirection | null;
  filter?: ModelDUFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type DuByPersonaQuery = {
  duByPersona?: {
    __typename: 'ModelDUConnection';
    items: Array<{
      __typename: 'DU';
      id: string;
      name?: string | null;
      context?: string | null;
      hxScore?: number | null;
      persona?: string | null;
      timeLost?: number | null;
      payroll?: number | null;
      revenue?: number | null;
      locationType?: LocationType | null;
      hybridPercent?: number | null;
      applications?: Array<string | null> | null;
      projects?: {
        __typename: 'ModelProjectDusConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      reportId: string;
      report?: {
        __typename: 'Report';
        id: string;
        context?: string | null;
        reportDate?: string | null;
        reportName?: string | null;
        accessLevel?: AccessLevel | null;
        s3Key?: string | null;
        projectIds?: Array<string | null> | null;
        insightIds?: Array<string | null> | null;
        customProjects?: string | null;
        reportStatus?: ReportStatus | null;
        reportData?: string | null;
        createdAt: string;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
      } | null;
      office?: string | null;
      country?: string | null;
      officeHx?: number | null;
      remoteHx?: number | null;
      locations?: string | null;
      analytics?: string | null;
      createdAt: string;
      updatedAt: string;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
      reportDusId?: string | null;
    } | null>;
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
};

export type DuByLocationTypeQueryVariables = {
  locationType: LocationType;
  sortDirection?: ModelSortDirection | null;
  filter?: ModelDUFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type DuByLocationTypeQuery = {
  duByLocationType?: {
    __typename: 'ModelDUConnection';
    items: Array<{
      __typename: 'DU';
      id: string;
      name?: string | null;
      context?: string | null;
      hxScore?: number | null;
      persona?: string | null;
      timeLost?: number | null;
      payroll?: number | null;
      revenue?: number | null;
      locationType?: LocationType | null;
      hybridPercent?: number | null;
      applications?: Array<string | null> | null;
      projects?: {
        __typename: 'ModelProjectDusConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      reportId: string;
      report?: {
        __typename: 'Report';
        id: string;
        context?: string | null;
        reportDate?: string | null;
        reportName?: string | null;
        accessLevel?: AccessLevel | null;
        s3Key?: string | null;
        projectIds?: Array<string | null> | null;
        insightIds?: Array<string | null> | null;
        customProjects?: string | null;
        reportStatus?: ReportStatus | null;
        reportData?: string | null;
        createdAt: string;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
      } | null;
      office?: string | null;
      country?: string | null;
      officeHx?: number | null;
      remoteHx?: number | null;
      locations?: string | null;
      analytics?: string | null;
      createdAt: string;
      updatedAt: string;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
      reportDusId?: string | null;
    } | null>;
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
};

export type DuByReportIdQueryVariables = {
  reportId: string;
  name?: ModelStringKeyConditionInput | null;
  sortDirection?: ModelSortDirection | null;
  filter?: ModelDUFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type DuByReportIdQuery = {
  duByReportId?: {
    __typename: 'ModelDUConnection';
    items: Array<{
      __typename: 'DU';
      id: string;
      name?: string | null;
      context?: string | null;
      hxScore?: number | null;
      persona?: string | null;
      timeLost?: number | null;
      payroll?: number | null;
      revenue?: number | null;
      locationType?: LocationType | null;
      hybridPercent?: number | null;
      applications?: Array<string | null> | null;
      projects?: {
        __typename: 'ModelProjectDusConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      reportId: string;
      report?: {
        __typename: 'Report';
        id: string;
        context?: string | null;
        reportDate?: string | null;
        reportName?: string | null;
        accessLevel?: AccessLevel | null;
        s3Key?: string | null;
        projectIds?: Array<string | null> | null;
        insightIds?: Array<string | null> | null;
        customProjects?: string | null;
        reportStatus?: ReportStatus | null;
        reportData?: string | null;
        createdAt: string;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
      } | null;
      office?: string | null;
      country?: string | null;
      officeHx?: number | null;
      remoteHx?: number | null;
      locations?: string | null;
      analytics?: string | null;
      createdAt: string;
      updatedAt: string;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
      reportDusId?: string | null;
    } | null>;
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
};

export type GetParseQueryVariables = {
  id: string;
};

export type GetParseQuery = {
  getParse?: {
    __typename: 'Parse';
    id: string;
    context?: string | null;
    inputAnalyticCsv?: string | null;
    inputProjectCsv?: string | null;
    previewS3?: string | null;
    levers?: string | null;
    startDateTime?: string | null;
    endDateTime?: string | null;
    status?: ParseStatus | null;
    report?: {
      __typename: 'Report';
      id: string;
      context?: string | null;
      reportDate?: string | null;
      reportName?: string | null;
      accessLevel?: AccessLevel | null;
      s3Key?: string | null;
      projects?: {
        __typename: 'ModelProjectConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      insights?: {
        __typename: 'ModelProjectInsightConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      projectIds?: Array<string | null> | null;
      insightIds?: Array<string | null> | null;
      customProjects?: string | null;
      reportStatus?: ReportStatus | null;
      dus?: {
        __typename: 'ModelDUConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      reportData?: string | null;
      createdAt: string;
      updatedAt: string;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
    } | null;
    warnings?: Array<string | null> | null;
    expectedDus?: number | null;
    processedDus?: number | null;
    personaSettings?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    parseReportId?: string | null;
  } | null;
};

export type ListParsesQueryVariables = {
  filter?: ModelParseFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListParsesQuery = {
  listParses?: {
    __typename: 'ModelParseConnection';
    items: Array<{
      __typename: 'Parse';
      id: string;
      context?: string | null;
      inputAnalyticCsv?: string | null;
      inputProjectCsv?: string | null;
      previewS3?: string | null;
      levers?: string | null;
      startDateTime?: string | null;
      endDateTime?: string | null;
      status?: ParseStatus | null;
      report?: {
        __typename: 'Report';
        id: string;
        context?: string | null;
        reportDate?: string | null;
        reportName?: string | null;
        accessLevel?: AccessLevel | null;
        s3Key?: string | null;
        projectIds?: Array<string | null> | null;
        insightIds?: Array<string | null> | null;
        customProjects?: string | null;
        reportStatus?: ReportStatus | null;
        reportData?: string | null;
        createdAt: string;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
      } | null;
      warnings?: Array<string | null> | null;
      expectedDus?: number | null;
      processedDus?: number | null;
      personaSettings?: string | null;
      createdAt: string;
      updatedAt: string;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
      parseReportId?: string | null;
    } | null>;
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
};

export type SyncParsesQueryVariables = {
  filter?: ModelParseFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
  lastSync?: number | null;
};

export type SyncParsesQuery = {
  syncParses?: {
    __typename: 'ModelParseConnection';
    items: Array<{
      __typename: 'Parse';
      id: string;
      context?: string | null;
      inputAnalyticCsv?: string | null;
      inputProjectCsv?: string | null;
      previewS3?: string | null;
      levers?: string | null;
      startDateTime?: string | null;
      endDateTime?: string | null;
      status?: ParseStatus | null;
      report?: {
        __typename: 'Report';
        id: string;
        context?: string | null;
        reportDate?: string | null;
        reportName?: string | null;
        accessLevel?: AccessLevel | null;
        s3Key?: string | null;
        projectIds?: Array<string | null> | null;
        insightIds?: Array<string | null> | null;
        customProjects?: string | null;
        reportStatus?: ReportStatus | null;
        reportData?: string | null;
        createdAt: string;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
      } | null;
      warnings?: Array<string | null> | null;
      expectedDus?: number | null;
      processedDus?: number | null;
      personaSettings?: string | null;
      createdAt: string;
      updatedAt: string;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
      parseReportId?: string | null;
    } | null>;
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
};

export type ParseByContextQueryVariables = {
  context: string;
  sortDirection?: ModelSortDirection | null;
  filter?: ModelParseFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ParseByContextQuery = {
  parseByContext?: {
    __typename: 'ModelParseConnection';
    items: Array<{
      __typename: 'Parse';
      id: string;
      context?: string | null;
      inputAnalyticCsv?: string | null;
      inputProjectCsv?: string | null;
      previewS3?: string | null;
      levers?: string | null;
      startDateTime?: string | null;
      endDateTime?: string | null;
      status?: ParseStatus | null;
      report?: {
        __typename: 'Report';
        id: string;
        context?: string | null;
        reportDate?: string | null;
        reportName?: string | null;
        accessLevel?: AccessLevel | null;
        s3Key?: string | null;
        projectIds?: Array<string | null> | null;
        insightIds?: Array<string | null> | null;
        customProjects?: string | null;
        reportStatus?: ReportStatus | null;
        reportData?: string | null;
        createdAt: string;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
      } | null;
      warnings?: Array<string | null> | null;
      expectedDus?: number | null;
      processedDus?: number | null;
      personaSettings?: string | null;
      createdAt: string;
      updatedAt: string;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
      parseReportId?: string | null;
    } | null>;
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
};

export type ParseByStatusQueryVariables = {
  status: ParseStatus;
  sortDirection?: ModelSortDirection | null;
  filter?: ModelParseFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ParseByStatusQuery = {
  parseByStatus?: {
    __typename: 'ModelParseConnection';
    items: Array<{
      __typename: 'Parse';
      id: string;
      context?: string | null;
      inputAnalyticCsv?: string | null;
      inputProjectCsv?: string | null;
      previewS3?: string | null;
      levers?: string | null;
      startDateTime?: string | null;
      endDateTime?: string | null;
      status?: ParseStatus | null;
      report?: {
        __typename: 'Report';
        id: string;
        context?: string | null;
        reportDate?: string | null;
        reportName?: string | null;
        accessLevel?: AccessLevel | null;
        s3Key?: string | null;
        projectIds?: Array<string | null> | null;
        insightIds?: Array<string | null> | null;
        customProjects?: string | null;
        reportStatus?: ReportStatus | null;
        reportData?: string | null;
        createdAt: string;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
      } | null;
      warnings?: Array<string | null> | null;
      expectedDus?: number | null;
      processedDus?: number | null;
      personaSettings?: string | null;
      createdAt: string;
      updatedAt: string;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
      parseReportId?: string | null;
    } | null>;
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
};

export type GetProjectDusQueryVariables = {
  id: string;
};

export type GetProjectDusQuery = {
  getProjectDus?: {
    __typename: 'ProjectDus';
    id: string;
    projectID: string;
    dUID: string;
    project: {
      __typename: 'Project';
      id: string;
      context?: string | null;
      projectId?: string | null;
      projectDate?: string | null;
      projectName?: string | null;
      projectType?: ProjectType | null;
      projectStatus?: ProjectStatus | null;
      projectBody?: string | null;
      timeLost?: number | null;
      hxScore?: number | null;
      payroll?: number | null;
      employeeCount?: number | null;
      report?: string | null;
      dus?: {
        __typename: 'ModelProjectDusConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      createdAt: string;
      updatedAt: string;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
      reportProjectsId?: string | null;
    };
    dU: {
      __typename: 'DU';
      id: string;
      name?: string | null;
      context?: string | null;
      hxScore?: number | null;
      persona?: string | null;
      timeLost?: number | null;
      payroll?: number | null;
      revenue?: number | null;
      locationType?: LocationType | null;
      hybridPercent?: number | null;
      applications?: Array<string | null> | null;
      projects?: {
        __typename: 'ModelProjectDusConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      reportId: string;
      report?: {
        __typename: 'Report';
        id: string;
        context?: string | null;
        reportDate?: string | null;
        reportName?: string | null;
        accessLevel?: AccessLevel | null;
        s3Key?: string | null;
        projectIds?: Array<string | null> | null;
        insightIds?: Array<string | null> | null;
        customProjects?: string | null;
        reportStatus?: ReportStatus | null;
        reportData?: string | null;
        createdAt: string;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
      } | null;
      office?: string | null;
      country?: string | null;
      officeHx?: number | null;
      remoteHx?: number | null;
      locations?: string | null;
      analytics?: string | null;
      createdAt: string;
      updatedAt: string;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
      reportDusId?: string | null;
    };
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null;
};

export type ListProjectDusesQueryVariables = {
  filter?: ModelProjectDusFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListProjectDusesQuery = {
  listProjectDuses?: {
    __typename: 'ModelProjectDusConnection';
    items: Array<{
      __typename: 'ProjectDus';
      id: string;
      projectID: string;
      dUID: string;
      project: {
        __typename: 'Project';
        id: string;
        context?: string | null;
        projectId?: string | null;
        projectDate?: string | null;
        projectName?: string | null;
        projectType?: ProjectType | null;
        projectStatus?: ProjectStatus | null;
        projectBody?: string | null;
        timeLost?: number | null;
        hxScore?: number | null;
        payroll?: number | null;
        employeeCount?: number | null;
        report?: string | null;
        createdAt: string;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
        reportProjectsId?: string | null;
      };
      dU: {
        __typename: 'DU';
        id: string;
        name?: string | null;
        context?: string | null;
        hxScore?: number | null;
        persona?: string | null;
        timeLost?: number | null;
        payroll?: number | null;
        revenue?: number | null;
        locationType?: LocationType | null;
        hybridPercent?: number | null;
        applications?: Array<string | null> | null;
        reportId: string;
        office?: string | null;
        country?: string | null;
        officeHx?: number | null;
        remoteHx?: number | null;
        locations?: string | null;
        analytics?: string | null;
        createdAt: string;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
        reportDusId?: string | null;
      };
      createdAt: string;
      updatedAt: string;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
    } | null>;
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
};

export type SyncProjectDusesQueryVariables = {
  filter?: ModelProjectDusFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
  lastSync?: number | null;
};

export type SyncProjectDusesQuery = {
  syncProjectDuses?: {
    __typename: 'ModelProjectDusConnection';
    items: Array<{
      __typename: 'ProjectDus';
      id: string;
      projectID: string;
      dUID: string;
      project: {
        __typename: 'Project';
        id: string;
        context?: string | null;
        projectId?: string | null;
        projectDate?: string | null;
        projectName?: string | null;
        projectType?: ProjectType | null;
        projectStatus?: ProjectStatus | null;
        projectBody?: string | null;
        timeLost?: number | null;
        hxScore?: number | null;
        payroll?: number | null;
        employeeCount?: number | null;
        report?: string | null;
        createdAt: string;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
        reportProjectsId?: string | null;
      };
      dU: {
        __typename: 'DU';
        id: string;
        name?: string | null;
        context?: string | null;
        hxScore?: number | null;
        persona?: string | null;
        timeLost?: number | null;
        payroll?: number | null;
        revenue?: number | null;
        locationType?: LocationType | null;
        hybridPercent?: number | null;
        applications?: Array<string | null> | null;
        reportId: string;
        office?: string | null;
        country?: string | null;
        officeHx?: number | null;
        remoteHx?: number | null;
        locations?: string | null;
        analytics?: string | null;
        createdAt: string;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
        reportDusId?: string | null;
      };
      createdAt: string;
      updatedAt: string;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
    } | null>;
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
};

export type OnCreatePersonaSettingsSubscriptionVariables = {
  filter?: ModelSubscriptionPersonaSettingsFilterInput | null;
};

export type OnCreatePersonaSettingsSubscription = {
  onCreatePersonaSettings?: {
    __typename: 'PersonaSettings';
    createdAt: string;
    id: string;
    organisation: string;
    termType?: string | null;
    term?: string | null;
    inputAssumptions?: {
      __typename: 'ModelInputAssumptionConnection';
      items: Array<{
        __typename: 'InputAssumption';
        id: string;
        termValue: string;
        timeWorkedPerDay?: number | null;
        dailyDigitalPercentage?: number | null;
        payrollPerEmployee?: number | null;
        revenuePerEmployee?: number | null;
        numberOfEmployees?: number | null;
        createdAt: string;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
        personaSettingsInputAssumptionsId?: string | null;
      } | null>;
      nextToken?: string | null;
      startedAt?: number | null;
    } | null;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null;
};

export type OnUpdatePersonaSettingsSubscriptionVariables = {
  filter?: ModelSubscriptionPersonaSettingsFilterInput | null;
};

export type OnUpdatePersonaSettingsSubscription = {
  onUpdatePersonaSettings?: {
    __typename: 'PersonaSettings';
    createdAt: string;
    id: string;
    organisation: string;
    termType?: string | null;
    term?: string | null;
    inputAssumptions?: {
      __typename: 'ModelInputAssumptionConnection';
      items: Array<{
        __typename: 'InputAssumption';
        id: string;
        termValue: string;
        timeWorkedPerDay?: number | null;
        dailyDigitalPercentage?: number | null;
        payrollPerEmployee?: number | null;
        revenuePerEmployee?: number | null;
        numberOfEmployees?: number | null;
        createdAt: string;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
        personaSettingsInputAssumptionsId?: string | null;
      } | null>;
      nextToken?: string | null;
      startedAt?: number | null;
    } | null;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null;
};

export type OnDeletePersonaSettingsSubscriptionVariables = {
  filter?: ModelSubscriptionPersonaSettingsFilterInput | null;
};

export type OnDeletePersonaSettingsSubscription = {
  onDeletePersonaSettings?: {
    __typename: 'PersonaSettings';
    createdAt: string;
    id: string;
    organisation: string;
    termType?: string | null;
    term?: string | null;
    inputAssumptions?: {
      __typename: 'ModelInputAssumptionConnection';
      items: Array<{
        __typename: 'InputAssumption';
        id: string;
        termValue: string;
        timeWorkedPerDay?: number | null;
        dailyDigitalPercentage?: number | null;
        payrollPerEmployee?: number | null;
        revenuePerEmployee?: number | null;
        numberOfEmployees?: number | null;
        createdAt: string;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
        personaSettingsInputAssumptionsId?: string | null;
      } | null>;
      nextToken?: string | null;
      startedAt?: number | null;
    } | null;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null;
};

export type OnCreateInputAssumptionSubscriptionVariables = {
  filter?: ModelSubscriptionInputAssumptionFilterInput | null;
};

export type OnCreateInputAssumptionSubscription = {
  onCreateInputAssumption?: {
    __typename: 'InputAssumption';
    id: string;
    termValue: string;
    timeWorkedPerDay?: number | null;
    dailyDigitalPercentage?: number | null;
    payrollPerEmployee?: number | null;
    revenuePerEmployee?: number | null;
    numberOfEmployees?: number | null;
    applicationUsages?: {
      __typename: 'ModelApplicationUsageConnection';
      items: Array<{
        __typename: 'ApplicationUsage';
        id: string;
        target: string;
        percent: number;
        createdAt: string;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
        inputAssumptionApplicationUsagesId?: string | null;
      } | null>;
      nextToken?: string | null;
      startedAt?: number | null;
    } | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    personaSettingsInputAssumptionsId?: string | null;
  } | null;
};

export type OnUpdateInputAssumptionSubscriptionVariables = {
  filter?: ModelSubscriptionInputAssumptionFilterInput | null;
};

export type OnUpdateInputAssumptionSubscription = {
  onUpdateInputAssumption?: {
    __typename: 'InputAssumption';
    id: string;
    termValue: string;
    timeWorkedPerDay?: number | null;
    dailyDigitalPercentage?: number | null;
    payrollPerEmployee?: number | null;
    revenuePerEmployee?: number | null;
    numberOfEmployees?: number | null;
    applicationUsages?: {
      __typename: 'ModelApplicationUsageConnection';
      items: Array<{
        __typename: 'ApplicationUsage';
        id: string;
        target: string;
        percent: number;
        createdAt: string;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
        inputAssumptionApplicationUsagesId?: string | null;
      } | null>;
      nextToken?: string | null;
      startedAt?: number | null;
    } | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    personaSettingsInputAssumptionsId?: string | null;
  } | null;
};

export type OnDeleteInputAssumptionSubscriptionVariables = {
  filter?: ModelSubscriptionInputAssumptionFilterInput | null;
};

export type OnDeleteInputAssumptionSubscription = {
  onDeleteInputAssumption?: {
    __typename: 'InputAssumption';
    id: string;
    termValue: string;
    timeWorkedPerDay?: number | null;
    dailyDigitalPercentage?: number | null;
    payrollPerEmployee?: number | null;
    revenuePerEmployee?: number | null;
    numberOfEmployees?: number | null;
    applicationUsages?: {
      __typename: 'ModelApplicationUsageConnection';
      items: Array<{
        __typename: 'ApplicationUsage';
        id: string;
        target: string;
        percent: number;
        createdAt: string;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
        inputAssumptionApplicationUsagesId?: string | null;
      } | null>;
      nextToken?: string | null;
      startedAt?: number | null;
    } | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    personaSettingsInputAssumptionsId?: string | null;
  } | null;
};

export type OnCreateApplicationUsageSubscriptionVariables = {
  filter?: ModelSubscriptionApplicationUsageFilterInput | null;
};

export type OnCreateApplicationUsageSubscription = {
  onCreateApplicationUsage?: {
    __typename: 'ApplicationUsage';
    id: string;
    target: string;
    percent: number;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    inputAssumptionApplicationUsagesId?: string | null;
  } | null;
};

export type OnUpdateApplicationUsageSubscriptionVariables = {
  filter?: ModelSubscriptionApplicationUsageFilterInput | null;
};

export type OnUpdateApplicationUsageSubscription = {
  onUpdateApplicationUsage?: {
    __typename: 'ApplicationUsage';
    id: string;
    target: string;
    percent: number;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    inputAssumptionApplicationUsagesId?: string | null;
  } | null;
};

export type OnDeleteApplicationUsageSubscriptionVariables = {
  filter?: ModelSubscriptionApplicationUsageFilterInput | null;
};

export type OnDeleteApplicationUsageSubscription = {
  onDeleteApplicationUsage?: {
    __typename: 'ApplicationUsage';
    id: string;
    target: string;
    percent: number;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    inputAssumptionApplicationUsagesId?: string | null;
  } | null;
};

export type OnCreatePartnerSubscriptionVariables = {
  filter?: ModelSubscriptionPartnerFilterInput | null;
};

export type OnCreatePartnerSubscription = {
  onCreatePartner?: {
    __typename: 'Partner';
    id: string;
    partnerId: string;
    partnerName?: string | null;
    organisations?: {
      __typename: 'ModelOrganisationConnection';
      items: Array<{
        __typename: 'Organisation';
        id: string;
        organisationId: string;
        organisationName?: string | null;
        personaSettings?: string | null;
        status?: ContextStatus | null;
        createdAt: string;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
        partnerOrganisationsId?: string | null;
      } | null>;
      nextToken?: string | null;
      startedAt?: number | null;
    } | null;
    status?: ContextStatus | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null;
};

export type OnUpdatePartnerSubscriptionVariables = {
  filter?: ModelSubscriptionPartnerFilterInput | null;
};

export type OnUpdatePartnerSubscription = {
  onUpdatePartner?: {
    __typename: 'Partner';
    id: string;
    partnerId: string;
    partnerName?: string | null;
    organisations?: {
      __typename: 'ModelOrganisationConnection';
      items: Array<{
        __typename: 'Organisation';
        id: string;
        organisationId: string;
        organisationName?: string | null;
        personaSettings?: string | null;
        status?: ContextStatus | null;
        createdAt: string;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
        partnerOrganisationsId?: string | null;
      } | null>;
      nextToken?: string | null;
      startedAt?: number | null;
    } | null;
    status?: ContextStatus | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null;
};

export type OnDeletePartnerSubscriptionVariables = {
  filter?: ModelSubscriptionPartnerFilterInput | null;
};

export type OnDeletePartnerSubscription = {
  onDeletePartner?: {
    __typename: 'Partner';
    id: string;
    partnerId: string;
    partnerName?: string | null;
    organisations?: {
      __typename: 'ModelOrganisationConnection';
      items: Array<{
        __typename: 'Organisation';
        id: string;
        organisationId: string;
        organisationName?: string | null;
        personaSettings?: string | null;
        status?: ContextStatus | null;
        createdAt: string;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
        partnerOrganisationsId?: string | null;
      } | null>;
      nextToken?: string | null;
      startedAt?: number | null;
    } | null;
    status?: ContextStatus | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null;
};

export type OnCreateOrganisationSubscriptionVariables = {
  filter?: ModelSubscriptionOrganisationFilterInput | null;
};

export type OnCreateOrganisationSubscription = {
  onCreateOrganisation?: {
    __typename: 'Organisation';
    id: string;
    organisationId: string;
    organisationName?: string | null;
    partner?: {
      __typename: 'Partner';
      id: string;
      partnerId: string;
      partnerName?: string | null;
      organisations?: {
        __typename: 'ModelOrganisationConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      status?: ContextStatus | null;
      createdAt: string;
      updatedAt: string;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
    } | null;
    personaSettings?: string | null;
    status?: ContextStatus | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    partnerOrganisationsId?: string | null;
  } | null;
};

export type OnUpdateOrganisationSubscriptionVariables = {
  filter?: ModelSubscriptionOrganisationFilterInput | null;
};

export type OnUpdateOrganisationSubscription = {
  onUpdateOrganisation?: {
    __typename: 'Organisation';
    id: string;
    organisationId: string;
    organisationName?: string | null;
    partner?: {
      __typename: 'Partner';
      id: string;
      partnerId: string;
      partnerName?: string | null;
      organisations?: {
        __typename: 'ModelOrganisationConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      status?: ContextStatus | null;
      createdAt: string;
      updatedAt: string;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
    } | null;
    personaSettings?: string | null;
    status?: ContextStatus | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    partnerOrganisationsId?: string | null;
  } | null;
};

export type OnDeleteOrganisationSubscriptionVariables = {
  filter?: ModelSubscriptionOrganisationFilterInput | null;
};

export type OnDeleteOrganisationSubscription = {
  onDeleteOrganisation?: {
    __typename: 'Organisation';
    id: string;
    organisationId: string;
    organisationName?: string | null;
    partner?: {
      __typename: 'Partner';
      id: string;
      partnerId: string;
      partnerName?: string | null;
      organisations?: {
        __typename: 'ModelOrganisationConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      status?: ContextStatus | null;
      createdAt: string;
      updatedAt: string;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
    } | null;
    personaSettings?: string | null;
    status?: ContextStatus | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    partnerOrganisationsId?: string | null;
  } | null;
};

export type OnCreateContextMapSubscriptionVariables = {
  filter?: ModelSubscriptionContextMapFilterInput | null;
};

export type OnCreateContextMapSubscription = {
  onCreateContextMap?: {
    __typename: 'ContextMap';
    id: string;
    context?: string | null;
    identityProvider?: string | null;
    defaultContext?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null;
};

export type OnUpdateContextMapSubscriptionVariables = {
  filter?: ModelSubscriptionContextMapFilterInput | null;
};

export type OnUpdateContextMapSubscription = {
  onUpdateContextMap?: {
    __typename: 'ContextMap';
    id: string;
    context?: string | null;
    identityProvider?: string | null;
    defaultContext?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null;
};

export type OnDeleteContextMapSubscriptionVariables = {
  filter?: ModelSubscriptionContextMapFilterInput | null;
};

export type OnDeleteContextMapSubscription = {
  onDeleteContextMap?: {
    __typename: 'ContextMap';
    id: string;
    context?: string | null;
    identityProvider?: string | null;
    defaultContext?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null;
};

export type OnCreateReportSubscriptionVariables = {
  filter?: ModelSubscriptionReportFilterInput | null;
};

export type OnCreateReportSubscription = {
  onCreateReport?: {
    __typename: 'Report';
    id: string;
    context?: string | null;
    reportDate?: string | null;
    reportName?: string | null;
    accessLevel?: AccessLevel | null;
    s3Key?: string | null;
    projects?: {
      __typename: 'ModelProjectConnection';
      items: Array<{
        __typename: 'Project';
        id: string;
        context?: string | null;
        projectId?: string | null;
        projectDate?: string | null;
        projectName?: string | null;
        projectType?: ProjectType | null;
        projectStatus?: ProjectStatus | null;
        projectBody?: string | null;
        timeLost?: number | null;
        hxScore?: number | null;
        payroll?: number | null;
        employeeCount?: number | null;
        report?: string | null;
        createdAt: string;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
        reportProjectsId?: string | null;
      } | null>;
      nextToken?: string | null;
      startedAt?: number | null;
    } | null;
    insights?: {
      __typename: 'ModelProjectInsightConnection';
      items: Array<{
        __typename: 'ProjectInsight';
        id: string;
        name?: string | null;
        insightDate?: string | null;
        s3Key?: string | null;
        context?: string | null;
        fileName?: string | null;
        createdAt: string;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
        reportInsightsId?: string | null;
      } | null>;
      nextToken?: string | null;
      startedAt?: number | null;
    } | null;
    projectIds?: Array<string | null> | null;
    insightIds?: Array<string | null> | null;
    customProjects?: string | null;
    reportStatus?: ReportStatus | null;
    dus?: {
      __typename: 'ModelDUConnection';
      items: Array<{
        __typename: 'DU';
        id: string;
        name?: string | null;
        context?: string | null;
        hxScore?: number | null;
        persona?: string | null;
        timeLost?: number | null;
        payroll?: number | null;
        revenue?: number | null;
        locationType?: LocationType | null;
        hybridPercent?: number | null;
        applications?: Array<string | null> | null;
        reportId: string;
        office?: string | null;
        country?: string | null;
        officeHx?: number | null;
        remoteHx?: number | null;
        locations?: string | null;
        analytics?: string | null;
        createdAt: string;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
        reportDusId?: string | null;
      } | null>;
      nextToken?: string | null;
      startedAt?: number | null;
    } | null;
    reportData?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null;
};

export type OnUpdateReportSubscriptionVariables = {
  filter?: ModelSubscriptionReportFilterInput | null;
};

export type OnUpdateReportSubscription = {
  onUpdateReport?: {
    __typename: 'Report';
    id: string;
    context?: string | null;
    reportDate?: string | null;
    reportName?: string | null;
    accessLevel?: AccessLevel | null;
    s3Key?: string | null;
    projects?: {
      __typename: 'ModelProjectConnection';
      items: Array<{
        __typename: 'Project';
        id: string;
        context?: string | null;
        projectId?: string | null;
        projectDate?: string | null;
        projectName?: string | null;
        projectType?: ProjectType | null;
        projectStatus?: ProjectStatus | null;
        projectBody?: string | null;
        timeLost?: number | null;
        hxScore?: number | null;
        payroll?: number | null;
        employeeCount?: number | null;
        report?: string | null;
        createdAt: string;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
        reportProjectsId?: string | null;
      } | null>;
      nextToken?: string | null;
      startedAt?: number | null;
    } | null;
    insights?: {
      __typename: 'ModelProjectInsightConnection';
      items: Array<{
        __typename: 'ProjectInsight';
        id: string;
        name?: string | null;
        insightDate?: string | null;
        s3Key?: string | null;
        context?: string | null;
        fileName?: string | null;
        createdAt: string;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
        reportInsightsId?: string | null;
      } | null>;
      nextToken?: string | null;
      startedAt?: number | null;
    } | null;
    projectIds?: Array<string | null> | null;
    insightIds?: Array<string | null> | null;
    customProjects?: string | null;
    reportStatus?: ReportStatus | null;
    dus?: {
      __typename: 'ModelDUConnection';
      items: Array<{
        __typename: 'DU';
        id: string;
        name?: string | null;
        context?: string | null;
        hxScore?: number | null;
        persona?: string | null;
        timeLost?: number | null;
        payroll?: number | null;
        revenue?: number | null;
        locationType?: LocationType | null;
        hybridPercent?: number | null;
        applications?: Array<string | null> | null;
        reportId: string;
        office?: string | null;
        country?: string | null;
        officeHx?: number | null;
        remoteHx?: number | null;
        locations?: string | null;
        analytics?: string | null;
        createdAt: string;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
        reportDusId?: string | null;
      } | null>;
      nextToken?: string | null;
      startedAt?: number | null;
    } | null;
    reportData?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null;
};

export type OnDeleteReportSubscriptionVariables = {
  filter?: ModelSubscriptionReportFilterInput | null;
};

export type OnDeleteReportSubscription = {
  onDeleteReport?: {
    __typename: 'Report';
    id: string;
    context?: string | null;
    reportDate?: string | null;
    reportName?: string | null;
    accessLevel?: AccessLevel | null;
    s3Key?: string | null;
    projects?: {
      __typename: 'ModelProjectConnection';
      items: Array<{
        __typename: 'Project';
        id: string;
        context?: string | null;
        projectId?: string | null;
        projectDate?: string | null;
        projectName?: string | null;
        projectType?: ProjectType | null;
        projectStatus?: ProjectStatus | null;
        projectBody?: string | null;
        timeLost?: number | null;
        hxScore?: number | null;
        payroll?: number | null;
        employeeCount?: number | null;
        report?: string | null;
        createdAt: string;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
        reportProjectsId?: string | null;
      } | null>;
      nextToken?: string | null;
      startedAt?: number | null;
    } | null;
    insights?: {
      __typename: 'ModelProjectInsightConnection';
      items: Array<{
        __typename: 'ProjectInsight';
        id: string;
        name?: string | null;
        insightDate?: string | null;
        s3Key?: string | null;
        context?: string | null;
        fileName?: string | null;
        createdAt: string;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
        reportInsightsId?: string | null;
      } | null>;
      nextToken?: string | null;
      startedAt?: number | null;
    } | null;
    projectIds?: Array<string | null> | null;
    insightIds?: Array<string | null> | null;
    customProjects?: string | null;
    reportStatus?: ReportStatus | null;
    dus?: {
      __typename: 'ModelDUConnection';
      items: Array<{
        __typename: 'DU';
        id: string;
        name?: string | null;
        context?: string | null;
        hxScore?: number | null;
        persona?: string | null;
        timeLost?: number | null;
        payroll?: number | null;
        revenue?: number | null;
        locationType?: LocationType | null;
        hybridPercent?: number | null;
        applications?: Array<string | null> | null;
        reportId: string;
        office?: string | null;
        country?: string | null;
        officeHx?: number | null;
        remoteHx?: number | null;
        locations?: string | null;
        analytics?: string | null;
        createdAt: string;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
        reportDusId?: string | null;
      } | null>;
      nextToken?: string | null;
      startedAt?: number | null;
    } | null;
    reportData?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null;
};

export type OnCreateProjectTemplateSubscriptionVariables = {
  filter?: ModelSubscriptionProjectTemplateFilterInput | null;
};

export type OnCreateProjectTemplateSubscription = {
  onCreateProjectTemplate?: {
    __typename: 'ProjectTemplate';
    id: string;
    context?: string | null;
    templateId?: string | null;
    name?: string | null;
    type?: ProjectType | null;
    body?: string | null;
    status?: ProjectStatus | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null;
};

export type OnUpdateProjectTemplateSubscriptionVariables = {
  filter?: ModelSubscriptionProjectTemplateFilterInput | null;
};

export type OnUpdateProjectTemplateSubscription = {
  onUpdateProjectTemplate?: {
    __typename: 'ProjectTemplate';
    id: string;
    context?: string | null;
    templateId?: string | null;
    name?: string | null;
    type?: ProjectType | null;
    body?: string | null;
    status?: ProjectStatus | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null;
};

export type OnDeleteProjectTemplateSubscriptionVariables = {
  filter?: ModelSubscriptionProjectTemplateFilterInput | null;
};

export type OnDeleteProjectTemplateSubscription = {
  onDeleteProjectTemplate?: {
    __typename: 'ProjectTemplate';
    id: string;
    context?: string | null;
    templateId?: string | null;
    name?: string | null;
    type?: ProjectType | null;
    body?: string | null;
    status?: ProjectStatus | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null;
};

export type OnCreateProjectSubscriptionVariables = {
  filter?: ModelSubscriptionProjectFilterInput | null;
};

export type OnCreateProjectSubscription = {
  onCreateProject?: {
    __typename: 'Project';
    id: string;
    context?: string | null;
    projectId?: string | null;
    projectDate?: string | null;
    projectName?: string | null;
    projectType?: ProjectType | null;
    projectStatus?: ProjectStatus | null;
    projectBody?: string | null;
    timeLost?: number | null;
    hxScore?: number | null;
    payroll?: number | null;
    employeeCount?: number | null;
    report?: string | null;
    dus?: {
      __typename: 'ModelProjectDusConnection';
      items: Array<{
        __typename: 'ProjectDus';
        id: string;
        projectID: string;
        dUID: string;
        createdAt: string;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
      } | null>;
      nextToken?: string | null;
      startedAt?: number | null;
    } | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    reportProjectsId?: string | null;
  } | null;
};

export type OnUpdateProjectSubscriptionVariables = {
  filter?: ModelSubscriptionProjectFilterInput | null;
};

export type OnUpdateProjectSubscription = {
  onUpdateProject?: {
    __typename: 'Project';
    id: string;
    context?: string | null;
    projectId?: string | null;
    projectDate?: string | null;
    projectName?: string | null;
    projectType?: ProjectType | null;
    projectStatus?: ProjectStatus | null;
    projectBody?: string | null;
    timeLost?: number | null;
    hxScore?: number | null;
    payroll?: number | null;
    employeeCount?: number | null;
    report?: string | null;
    dus?: {
      __typename: 'ModelProjectDusConnection';
      items: Array<{
        __typename: 'ProjectDus';
        id: string;
        projectID: string;
        dUID: string;
        createdAt: string;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
      } | null>;
      nextToken?: string | null;
      startedAt?: number | null;
    } | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    reportProjectsId?: string | null;
  } | null;
};

export type OnDeleteProjectSubscriptionVariables = {
  filter?: ModelSubscriptionProjectFilterInput | null;
};

export type OnDeleteProjectSubscription = {
  onDeleteProject?: {
    __typename: 'Project';
    id: string;
    context?: string | null;
    projectId?: string | null;
    projectDate?: string | null;
    projectName?: string | null;
    projectType?: ProjectType | null;
    projectStatus?: ProjectStatus | null;
    projectBody?: string | null;
    timeLost?: number | null;
    hxScore?: number | null;
    payroll?: number | null;
    employeeCount?: number | null;
    report?: string | null;
    dus?: {
      __typename: 'ModelProjectDusConnection';
      items: Array<{
        __typename: 'ProjectDus';
        id: string;
        projectID: string;
        dUID: string;
        createdAt: string;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
      } | null>;
      nextToken?: string | null;
      startedAt?: number | null;
    } | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    reportProjectsId?: string | null;
  } | null;
};

export type OnCreateProjectInsightSubscriptionVariables = {
  filter?: ModelSubscriptionProjectInsightFilterInput | null;
};

export type OnCreateProjectInsightSubscription = {
  onCreateProjectInsight?: {
    __typename: 'ProjectInsight';
    id: string;
    name?: string | null;
    insightDate?: string | null;
    s3Key?: string | null;
    context?: string | null;
    fileName?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    reportInsightsId?: string | null;
  } | null;
};

export type OnUpdateProjectInsightSubscriptionVariables = {
  filter?: ModelSubscriptionProjectInsightFilterInput | null;
};

export type OnUpdateProjectInsightSubscription = {
  onUpdateProjectInsight?: {
    __typename: 'ProjectInsight';
    id: string;
    name?: string | null;
    insightDate?: string | null;
    s3Key?: string | null;
    context?: string | null;
    fileName?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    reportInsightsId?: string | null;
  } | null;
};

export type OnDeleteProjectInsightSubscriptionVariables = {
  filter?: ModelSubscriptionProjectInsightFilterInput | null;
};

export type OnDeleteProjectInsightSubscription = {
  onDeleteProjectInsight?: {
    __typename: 'ProjectInsight';
    id: string;
    name?: string | null;
    insightDate?: string | null;
    s3Key?: string | null;
    context?: string | null;
    fileName?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    reportInsightsId?: string | null;
  } | null;
};

export type OnCreateDUSubscriptionVariables = {
  filter?: ModelSubscriptionDUFilterInput | null;
};

export type OnCreateDUSubscription = {
  onCreateDU?: {
    __typename: 'DU';
    id: string;
    name?: string | null;
    context?: string | null;
    hxScore?: number | null;
    persona?: string | null;
    timeLost?: number | null;
    payroll?: number | null;
    revenue?: number | null;
    locationType?: LocationType | null;
    hybridPercent?: number | null;
    applications?: Array<string | null> | null;
    projects?: {
      __typename: 'ModelProjectDusConnection';
      items: Array<{
        __typename: 'ProjectDus';
        id: string;
        projectID: string;
        dUID: string;
        createdAt: string;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
      } | null>;
      nextToken?: string | null;
      startedAt?: number | null;
    } | null;
    reportId: string;
    report?: {
      __typename: 'Report';
      id: string;
      context?: string | null;
      reportDate?: string | null;
      reportName?: string | null;
      accessLevel?: AccessLevel | null;
      s3Key?: string | null;
      projects?: {
        __typename: 'ModelProjectConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      insights?: {
        __typename: 'ModelProjectInsightConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      projectIds?: Array<string | null> | null;
      insightIds?: Array<string | null> | null;
      customProjects?: string | null;
      reportStatus?: ReportStatus | null;
      dus?: {
        __typename: 'ModelDUConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      reportData?: string | null;
      createdAt: string;
      updatedAt: string;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
    } | null;
    office?: string | null;
    country?: string | null;
    officeHx?: number | null;
    remoteHx?: number | null;
    locations?: string | null;
    analytics?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    reportDusId?: string | null;
  } | null;
};

export type OnUpdateDUSubscriptionVariables = {
  filter?: ModelSubscriptionDUFilterInput | null;
};

export type OnUpdateDUSubscription = {
  onUpdateDU?: {
    __typename: 'DU';
    id: string;
    name?: string | null;
    context?: string | null;
    hxScore?: number | null;
    persona?: string | null;
    timeLost?: number | null;
    payroll?: number | null;
    revenue?: number | null;
    locationType?: LocationType | null;
    hybridPercent?: number | null;
    applications?: Array<string | null> | null;
    projects?: {
      __typename: 'ModelProjectDusConnection';
      items: Array<{
        __typename: 'ProjectDus';
        id: string;
        projectID: string;
        dUID: string;
        createdAt: string;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
      } | null>;
      nextToken?: string | null;
      startedAt?: number | null;
    } | null;
    reportId: string;
    report?: {
      __typename: 'Report';
      id: string;
      context?: string | null;
      reportDate?: string | null;
      reportName?: string | null;
      accessLevel?: AccessLevel | null;
      s3Key?: string | null;
      projects?: {
        __typename: 'ModelProjectConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      insights?: {
        __typename: 'ModelProjectInsightConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      projectIds?: Array<string | null> | null;
      insightIds?: Array<string | null> | null;
      customProjects?: string | null;
      reportStatus?: ReportStatus | null;
      dus?: {
        __typename: 'ModelDUConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      reportData?: string | null;
      createdAt: string;
      updatedAt: string;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
    } | null;
    office?: string | null;
    country?: string | null;
    officeHx?: number | null;
    remoteHx?: number | null;
    locations?: string | null;
    analytics?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    reportDusId?: string | null;
  } | null;
};

export type OnDeleteDUSubscriptionVariables = {
  filter?: ModelSubscriptionDUFilterInput | null;
};

export type OnDeleteDUSubscription = {
  onDeleteDU?: {
    __typename: 'DU';
    id: string;
    name?: string | null;
    context?: string | null;
    hxScore?: number | null;
    persona?: string | null;
    timeLost?: number | null;
    payroll?: number | null;
    revenue?: number | null;
    locationType?: LocationType | null;
    hybridPercent?: number | null;
    applications?: Array<string | null> | null;
    projects?: {
      __typename: 'ModelProjectDusConnection';
      items: Array<{
        __typename: 'ProjectDus';
        id: string;
        projectID: string;
        dUID: string;
        createdAt: string;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
      } | null>;
      nextToken?: string | null;
      startedAt?: number | null;
    } | null;
    reportId: string;
    report?: {
      __typename: 'Report';
      id: string;
      context?: string | null;
      reportDate?: string | null;
      reportName?: string | null;
      accessLevel?: AccessLevel | null;
      s3Key?: string | null;
      projects?: {
        __typename: 'ModelProjectConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      insights?: {
        __typename: 'ModelProjectInsightConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      projectIds?: Array<string | null> | null;
      insightIds?: Array<string | null> | null;
      customProjects?: string | null;
      reportStatus?: ReportStatus | null;
      dus?: {
        __typename: 'ModelDUConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      reportData?: string | null;
      createdAt: string;
      updatedAt: string;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
    } | null;
    office?: string | null;
    country?: string | null;
    officeHx?: number | null;
    remoteHx?: number | null;
    locations?: string | null;
    analytics?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    reportDusId?: string | null;
  } | null;
};

export type OnCreateParseSubscriptionVariables = {
  filter?: ModelSubscriptionParseFilterInput | null;
};

export type OnCreateParseSubscription = {
  onCreateParse?: {
    __typename: 'Parse';
    id: string;
    context?: string | null;
    inputAnalyticCsv?: string | null;
    inputProjectCsv?: string | null;
    previewS3?: string | null;
    levers?: string | null;
    startDateTime?: string | null;
    endDateTime?: string | null;
    status?: ParseStatus | null;
    report?: {
      __typename: 'Report';
      id: string;
      context?: string | null;
      reportDate?: string | null;
      reportName?: string | null;
      accessLevel?: AccessLevel | null;
      s3Key?: string | null;
      projects?: {
        __typename: 'ModelProjectConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      insights?: {
        __typename: 'ModelProjectInsightConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      projectIds?: Array<string | null> | null;
      insightIds?: Array<string | null> | null;
      customProjects?: string | null;
      reportStatus?: ReportStatus | null;
      dus?: {
        __typename: 'ModelDUConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      reportData?: string | null;
      createdAt: string;
      updatedAt: string;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
    } | null;
    warnings?: Array<string | null> | null;
    expectedDus?: number | null;
    processedDus?: number | null;
    personaSettings?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    parseReportId?: string | null;
  } | null;
};

export type OnUpdateParseSubscriptionVariables = {
  filter?: ModelSubscriptionParseFilterInput | null;
};

export type OnUpdateParseSubscription = {
  onUpdateParse?: {
    __typename: 'Parse';
    id: string;
    context?: string | null;
    inputAnalyticCsv?: string | null;
    inputProjectCsv?: string | null;
    previewS3?: string | null;
    levers?: string | null;
    startDateTime?: string | null;
    endDateTime?: string | null;
    status?: ParseStatus | null;
    report?: {
      __typename: 'Report';
      id: string;
      context?: string | null;
      reportDate?: string | null;
      reportName?: string | null;
      accessLevel?: AccessLevel | null;
      s3Key?: string | null;
      projects?: {
        __typename: 'ModelProjectConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      insights?: {
        __typename: 'ModelProjectInsightConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      projectIds?: Array<string | null> | null;
      insightIds?: Array<string | null> | null;
      customProjects?: string | null;
      reportStatus?: ReportStatus | null;
      dus?: {
        __typename: 'ModelDUConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      reportData?: string | null;
      createdAt: string;
      updatedAt: string;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
    } | null;
    warnings?: Array<string | null> | null;
    expectedDus?: number | null;
    processedDus?: number | null;
    personaSettings?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    parseReportId?: string | null;
  } | null;
};

export type OnDeleteParseSubscriptionVariables = {
  filter?: ModelSubscriptionParseFilterInput | null;
};

export type OnDeleteParseSubscription = {
  onDeleteParse?: {
    __typename: 'Parse';
    id: string;
    context?: string | null;
    inputAnalyticCsv?: string | null;
    inputProjectCsv?: string | null;
    previewS3?: string | null;
    levers?: string | null;
    startDateTime?: string | null;
    endDateTime?: string | null;
    status?: ParseStatus | null;
    report?: {
      __typename: 'Report';
      id: string;
      context?: string | null;
      reportDate?: string | null;
      reportName?: string | null;
      accessLevel?: AccessLevel | null;
      s3Key?: string | null;
      projects?: {
        __typename: 'ModelProjectConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      insights?: {
        __typename: 'ModelProjectInsightConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      projectIds?: Array<string | null> | null;
      insightIds?: Array<string | null> | null;
      customProjects?: string | null;
      reportStatus?: ReportStatus | null;
      dus?: {
        __typename: 'ModelDUConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      reportData?: string | null;
      createdAt: string;
      updatedAt: string;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
    } | null;
    warnings?: Array<string | null> | null;
    expectedDus?: number | null;
    processedDus?: number | null;
    personaSettings?: string | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    parseReportId?: string | null;
  } | null;
};

export type OnCreateProjectDusSubscriptionVariables = {
  filter?: ModelSubscriptionProjectDusFilterInput | null;
};

export type OnCreateProjectDusSubscription = {
  onCreateProjectDus?: {
    __typename: 'ProjectDus';
    id: string;
    projectID: string;
    dUID: string;
    project: {
      __typename: 'Project';
      id: string;
      context?: string | null;
      projectId?: string | null;
      projectDate?: string | null;
      projectName?: string | null;
      projectType?: ProjectType | null;
      projectStatus?: ProjectStatus | null;
      projectBody?: string | null;
      timeLost?: number | null;
      hxScore?: number | null;
      payroll?: number | null;
      employeeCount?: number | null;
      report?: string | null;
      dus?: {
        __typename: 'ModelProjectDusConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      createdAt: string;
      updatedAt: string;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
      reportProjectsId?: string | null;
    };
    dU: {
      __typename: 'DU';
      id: string;
      name?: string | null;
      context?: string | null;
      hxScore?: number | null;
      persona?: string | null;
      timeLost?: number | null;
      payroll?: number | null;
      revenue?: number | null;
      locationType?: LocationType | null;
      hybridPercent?: number | null;
      applications?: Array<string | null> | null;
      projects?: {
        __typename: 'ModelProjectDusConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      reportId: string;
      report?: {
        __typename: 'Report';
        id: string;
        context?: string | null;
        reportDate?: string | null;
        reportName?: string | null;
        accessLevel?: AccessLevel | null;
        s3Key?: string | null;
        projectIds?: Array<string | null> | null;
        insightIds?: Array<string | null> | null;
        customProjects?: string | null;
        reportStatus?: ReportStatus | null;
        reportData?: string | null;
        createdAt: string;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
      } | null;
      office?: string | null;
      country?: string | null;
      officeHx?: number | null;
      remoteHx?: number | null;
      locations?: string | null;
      analytics?: string | null;
      createdAt: string;
      updatedAt: string;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
      reportDusId?: string | null;
    };
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null;
};

export type OnUpdateProjectDusSubscriptionVariables = {
  filter?: ModelSubscriptionProjectDusFilterInput | null;
};

export type OnUpdateProjectDusSubscription = {
  onUpdateProjectDus?: {
    __typename: 'ProjectDus';
    id: string;
    projectID: string;
    dUID: string;
    project: {
      __typename: 'Project';
      id: string;
      context?: string | null;
      projectId?: string | null;
      projectDate?: string | null;
      projectName?: string | null;
      projectType?: ProjectType | null;
      projectStatus?: ProjectStatus | null;
      projectBody?: string | null;
      timeLost?: number | null;
      hxScore?: number | null;
      payroll?: number | null;
      employeeCount?: number | null;
      report?: string | null;
      dus?: {
        __typename: 'ModelProjectDusConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      createdAt: string;
      updatedAt: string;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
      reportProjectsId?: string | null;
    };
    dU: {
      __typename: 'DU';
      id: string;
      name?: string | null;
      context?: string | null;
      hxScore?: number | null;
      persona?: string | null;
      timeLost?: number | null;
      payroll?: number | null;
      revenue?: number | null;
      locationType?: LocationType | null;
      hybridPercent?: number | null;
      applications?: Array<string | null> | null;
      projects?: {
        __typename: 'ModelProjectDusConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      reportId: string;
      report?: {
        __typename: 'Report';
        id: string;
        context?: string | null;
        reportDate?: string | null;
        reportName?: string | null;
        accessLevel?: AccessLevel | null;
        s3Key?: string | null;
        projectIds?: Array<string | null> | null;
        insightIds?: Array<string | null> | null;
        customProjects?: string | null;
        reportStatus?: ReportStatus | null;
        reportData?: string | null;
        createdAt: string;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
      } | null;
      office?: string | null;
      country?: string | null;
      officeHx?: number | null;
      remoteHx?: number | null;
      locations?: string | null;
      analytics?: string | null;
      createdAt: string;
      updatedAt: string;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
      reportDusId?: string | null;
    };
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null;
};

export type OnDeleteProjectDusSubscriptionVariables = {
  filter?: ModelSubscriptionProjectDusFilterInput | null;
};

export type OnDeleteProjectDusSubscription = {
  onDeleteProjectDus?: {
    __typename: 'ProjectDus';
    id: string;
    projectID: string;
    dUID: string;
    project: {
      __typename: 'Project';
      id: string;
      context?: string | null;
      projectId?: string | null;
      projectDate?: string | null;
      projectName?: string | null;
      projectType?: ProjectType | null;
      projectStatus?: ProjectStatus | null;
      projectBody?: string | null;
      timeLost?: number | null;
      hxScore?: number | null;
      payroll?: number | null;
      employeeCount?: number | null;
      report?: string | null;
      dus?: {
        __typename: 'ModelProjectDusConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      createdAt: string;
      updatedAt: string;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
      reportProjectsId?: string | null;
    };
    dU: {
      __typename: 'DU';
      id: string;
      name?: string | null;
      context?: string | null;
      hxScore?: number | null;
      persona?: string | null;
      timeLost?: number | null;
      payroll?: number | null;
      revenue?: number | null;
      locationType?: LocationType | null;
      hybridPercent?: number | null;
      applications?: Array<string | null> | null;
      projects?: {
        __typename: 'ModelProjectDusConnection';
        nextToken?: string | null;
        startedAt?: number | null;
      } | null;
      reportId: string;
      report?: {
        __typename: 'Report';
        id: string;
        context?: string | null;
        reportDate?: string | null;
        reportName?: string | null;
        accessLevel?: AccessLevel | null;
        s3Key?: string | null;
        projectIds?: Array<string | null> | null;
        insightIds?: Array<string | null> | null;
        customProjects?: string | null;
        reportStatus?: ReportStatus | null;
        reportData?: string | null;
        createdAt: string;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
      } | null;
      office?: string | null;
      country?: string | null;
      officeHx?: number | null;
      remoteHx?: number | null;
      locations?: string | null;
      analytics?: string | null;
      createdAt: string;
      updatedAt: string;
      _version: number;
      _deleted?: boolean | null;
      _lastChangedAt: number;
      reportDusId?: string | null;
    };
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null;
};
