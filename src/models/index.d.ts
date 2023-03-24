import { ModelInit, MutableModel } from '@aws-amplify/datastore';
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled, AsyncCollection, AsyncItem } from '@aws-amplify/datastore';

export enum ProjectStatus {
  NOT_STARTED = 'NOT_STARTED',
  ON_HOLD = 'ON_HOLD',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED',
}

export enum ProjectType {
  APPLICATION = 'APPLICATION',
  NETWORK_REMOTE = 'NETWORK_REMOTE',
  NETWORK_OFFICE = 'NETWORK_OFFICE',
  WIDER_NETWORK = 'WIDER_NETWORK',
}

export enum AccessLevel {
  GLOBAL = 'GLOBAL',
  PARTNER = 'PARTNER',
  ORGANISATION = 'ORGANISATION',
}

export enum ReportStatus {
  UPLOADING = 'UPLOADING',
  PROCESSING = 'PROCESSING',
  PREVIEW = 'PREVIEW',
  PUBLISHED = 'PUBLISHED',
  FOR_DELETION = 'FOR_DELETION',
}

export enum ContextStatus {
  CREATED = 'CREATED',
  FOR_DELETION = 'FOR_DELETION',
}

export enum LocationType {
  OFFICE = 'OFFICE',
  HYBRID = 'HYBRID',
  REMOTE = 'REMOTE',
}

export enum ParseStatus {
  UPLOADING = 'UPLOADING',
  IN_PROGRESS = 'IN_PROGRESS',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',
}

type PersonaSettingsMetaData = {
  readOnlyFields: 'updatedAt';
};

type InputAssumptionMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
};

type ApplicationUsageMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
};

type PartnerMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
};

type OrganisationMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
};

type ContextMapMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
};

type ReportMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
};

type ProjectTemplateMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
};

type ProjectMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
};

type ProjectInsightMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
};

type DUMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
};

type ParseMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
};

type ProjectDusMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
};

type EagerPersonaSettings = {
  readonly id: string;
  readonly createdAt: string;
  readonly organisation: string;
  readonly termType?: string | null;
  readonly term?: string | null;
  readonly inputAssumptions?: (InputAssumption | null)[] | null;
  readonly updatedAt?: string | null;
};

type LazyPersonaSettings = {
  readonly id: string;
  readonly createdAt: string;
  readonly organisation: string;
  readonly termType?: string | null;
  readonly term?: string | null;
  readonly inputAssumptions: AsyncCollection<InputAssumption>;
  readonly updatedAt?: string | null;
};

export declare type PersonaSettings = LazyLoading extends LazyLoadingDisabled
  ? EagerPersonaSettings
  : LazyPersonaSettings;

export declare const PersonaSettings: (new (
  init: ModelInit<PersonaSettings, PersonaSettingsMetaData>
) => PersonaSettings) & {
  copyOf(
    source: PersonaSettings,
    mutator: (
      draft: MutableModel<PersonaSettings, PersonaSettingsMetaData>
    ) => MutableModel<PersonaSettings, PersonaSettingsMetaData> | void
  ): PersonaSettings;
};

type EagerInputAssumption = {
  readonly id: string;
  readonly termValue: string;
  readonly timeWorkedPerDay?: number | null;
  readonly dailyDigitalPercentage?: number | null;
  readonly payrollPerEmployee?: number | null;
  readonly revenuePerEmployee?: number | null;
  readonly numberOfEmployees?: number | null;
  readonly applicationUsages?: (ApplicationUsage | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly personaSettingsInputAssumptionsId?: string | null;
};

type LazyInputAssumption = {
  readonly id: string;
  readonly termValue: string;
  readonly timeWorkedPerDay?: number | null;
  readonly dailyDigitalPercentage?: number | null;
  readonly payrollPerEmployee?: number | null;
  readonly revenuePerEmployee?: number | null;
  readonly numberOfEmployees?: number | null;
  readonly applicationUsages: AsyncCollection<ApplicationUsage>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly personaSettingsInputAssumptionsId?: string | null;
};

export declare type InputAssumption = LazyLoading extends LazyLoadingDisabled
  ? EagerInputAssumption
  : LazyInputAssumption;

export declare const InputAssumption: (new (
  init: ModelInit<InputAssumption, InputAssumptionMetaData>
) => InputAssumption) & {
  copyOf(
    source: InputAssumption,
    mutator: (
      draft: MutableModel<InputAssumption, InputAssumptionMetaData>
    ) => MutableModel<InputAssumption, InputAssumptionMetaData> | void
  ): InputAssumption;
};

type EagerApplicationUsage = {
  readonly id: string;
  readonly target: string;
  readonly percent: number;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly inputAssumptionApplicationUsagesId?: string | null;
};

type LazyApplicationUsage = {
  readonly id: string;
  readonly target: string;
  readonly percent: number;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly inputAssumptionApplicationUsagesId?: string | null;
};

export declare type ApplicationUsage = LazyLoading extends LazyLoadingDisabled
  ? EagerApplicationUsage
  : LazyApplicationUsage;

export declare const ApplicationUsage: (new (
  init: ModelInit<ApplicationUsage, ApplicationUsageMetaData>
) => ApplicationUsage) & {
  copyOf(
    source: ApplicationUsage,
    mutator: (
      draft: MutableModel<ApplicationUsage, ApplicationUsageMetaData>
    ) => MutableModel<ApplicationUsage, ApplicationUsageMetaData> | void
  ): ApplicationUsage;
};

type EagerPartner = {
  readonly id: string;
  readonly partnerId: string;
  readonly partnerName?: string | null;
  readonly organisations?: (Organisation | null)[] | null;
  readonly status?: ContextStatus | keyof typeof ContextStatus | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
};

type LazyPartner = {
  readonly id: string;
  readonly partnerId: string;
  readonly partnerName?: string | null;
  readonly organisations: AsyncCollection<Organisation>;
  readonly status?: ContextStatus | keyof typeof ContextStatus | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
};

export declare type Partner = LazyLoading extends LazyLoadingDisabled ? EagerPartner : LazyPartner;

export declare const Partner: (new (init: ModelInit<Partner, PartnerMetaData>) => Partner) & {
  copyOf(
    source: Partner,
    mutator: (draft: MutableModel<Partner, PartnerMetaData>) => MutableModel<Partner, PartnerMetaData> | void
  ): Partner;
};

type EagerOrganisation = {
  readonly id: string;
  readonly organisationId: string;
  readonly organisationName?: string | null;
  readonly partner?: Partner | null;
  readonly personaSettings?: string | null;
  readonly status?: ContextStatus | keyof typeof ContextStatus | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
};

type LazyOrganisation = {
  readonly id: string;
  readonly organisationId: string;
  readonly organisationName?: string | null;
  readonly partner: AsyncItem<Partner | undefined>;
  readonly personaSettings?: string | null;
  readonly status?: ContextStatus | keyof typeof ContextStatus | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
};

export declare type Organisation = LazyLoading extends LazyLoadingDisabled ? EagerOrganisation : LazyOrganisation;

export declare const Organisation: (new (init: ModelInit<Organisation, OrganisationMetaData>) => Organisation) & {
  copyOf(
    source: Organisation,
    mutator: (
      draft: MutableModel<Organisation, OrganisationMetaData>
    ) => MutableModel<Organisation, OrganisationMetaData> | void
  ): Organisation;
};

type EagerContextMap = {
  readonly id: string;
  readonly context?: string | null;
  readonly identityProvider?: string | null;
  readonly defaultContext?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
};

type LazyContextMap = {
  readonly id: string;
  readonly context?: string | null;
  readonly identityProvider?: string | null;
  readonly defaultContext?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
};

export declare type ContextMap = LazyLoading extends LazyLoadingDisabled ? EagerContextMap : LazyContextMap;

export declare const ContextMap: (new (init: ModelInit<ContextMap, ContextMapMetaData>) => ContextMap) & {
  copyOf(
    source: ContextMap,
    mutator: (
      draft: MutableModel<ContextMap, ContextMapMetaData>
    ) => MutableModel<ContextMap, ContextMapMetaData> | void
  ): ContextMap;
};

type EagerReport = {
  readonly id: string;
  readonly context?: string | null;
  readonly reportDate?: string | null;
  readonly reportName?: string | null;
  readonly accessLevel?: AccessLevel | keyof typeof AccessLevel | null;
  readonly s3Key?: string | null;
  readonly projects?: (Project | null)[] | null;
  readonly insights?: (ProjectInsight | null)[] | null;
  readonly projectIds?: (string | null)[] | null;
  readonly insightIds?: (string | null)[] | null;
  readonly customProjects?: string | null;
  readonly reportStatus?: ReportStatus | keyof typeof ReportStatus | null;
  readonly dus?: (DU | null)[] | null;
  readonly reportData?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
};

type LazyReport = {
  readonly id: string;
  readonly context?: string | null;
  readonly reportDate?: string | null;
  readonly reportName?: string | null;
  readonly accessLevel?: AccessLevel | keyof typeof AccessLevel | null;
  readonly s3Key?: string | null;
  readonly projects: AsyncCollection<Project>;
  readonly insights: AsyncCollection<ProjectInsight>;
  readonly projectIds?: (string | null)[] | null;
  readonly insightIds?: (string | null)[] | null;
  readonly customProjects?: string | null;
  readonly reportStatus?: ReportStatus | keyof typeof ReportStatus | null;
  readonly dus: AsyncCollection<DU>;
  readonly reportData?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
};

export declare type Report = LazyLoading extends LazyLoadingDisabled ? EagerReport : LazyReport;

export declare const Report: (new (init: ModelInit<Report, ReportMetaData>) => Report) & {
  copyOf(
    source: Report,
    mutator: (draft: MutableModel<Report, ReportMetaData>) => MutableModel<Report, ReportMetaData> | void
  ): Report;
};

type EagerProjectTemplate = {
  readonly id: string;
  readonly context?: string | null;
  readonly templateId?: string | null;
  readonly name?: string | null;
  readonly type?: ProjectType | keyof typeof ProjectType | null;
  readonly body?: string | null;
  readonly status?: ProjectStatus | keyof typeof ProjectStatus | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
};

type LazyProjectTemplate = {
  readonly id: string;
  readonly context?: string | null;
  readonly templateId?: string | null;
  readonly name?: string | null;
  readonly type?: ProjectType | keyof typeof ProjectType | null;
  readonly body?: string | null;
  readonly status?: ProjectStatus | keyof typeof ProjectStatus | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
};

export declare type ProjectTemplate = LazyLoading extends LazyLoadingDisabled
  ? EagerProjectTemplate
  : LazyProjectTemplate;

export declare const ProjectTemplate: (new (
  init: ModelInit<ProjectTemplate, ProjectTemplateMetaData>
) => ProjectTemplate) & {
  copyOf(
    source: ProjectTemplate,
    mutator: (
      draft: MutableModel<ProjectTemplate, ProjectTemplateMetaData>
    ) => MutableModel<ProjectTemplate, ProjectTemplateMetaData> | void
  ): ProjectTemplate;
};

type EagerProject = {
  readonly id: string;
  readonly context?: string | null;
  readonly projectId?: string | null;
  readonly projectDate?: string | null;
  readonly projectName?: string | null;
  readonly projectType?: ProjectType | keyof typeof ProjectType | null;
  readonly projectStatus?: ProjectStatus | keyof typeof ProjectStatus | null;
  readonly projectBody?: string | null;
  readonly timeLost?: number | null;
  readonly hxScore?: number | null;
  readonly payroll?: number | null;
  readonly employeeCount?: number | null;
  readonly report?: string | null;
  readonly dus?: (ProjectDus | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly reportProjectsId?: string | null;
};

type LazyProject = {
  readonly id: string;
  readonly context?: string | null;
  readonly projectId?: string | null;
  readonly projectDate?: string | null;
  readonly projectName?: string | null;
  readonly projectType?: ProjectType | keyof typeof ProjectType | null;
  readonly projectStatus?: ProjectStatus | keyof typeof ProjectStatus | null;
  readonly projectBody?: string | null;
  readonly timeLost?: number | null;
  readonly hxScore?: number | null;
  readonly payroll?: number | null;
  readonly employeeCount?: number | null;
  readonly report?: string | null;
  readonly dus: AsyncCollection<ProjectDus>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly reportProjectsId?: string | null;
};

export declare type Project = LazyLoading extends LazyLoadingDisabled ? EagerProject : LazyProject;

export declare const Project: (new (init: ModelInit<Project, ProjectMetaData>) => Project) & {
  copyOf(
    source: Project,
    mutator: (draft: MutableModel<Project, ProjectMetaData>) => MutableModel<Project, ProjectMetaData> | void
  ): Project;
};

type EagerProjectInsight = {
  readonly id: string;
  readonly name?: string | null;
  readonly insightDate?: string | null;
  readonly s3Key?: string | null;
  readonly context?: string | null;
  readonly fileName?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly reportInsightsId?: string | null;
};

type LazyProjectInsight = {
  readonly id: string;
  readonly name?: string | null;
  readonly insightDate?: string | null;
  readonly s3Key?: string | null;
  readonly context?: string | null;
  readonly fileName?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly reportInsightsId?: string | null;
};

export declare type ProjectInsight = LazyLoading extends LazyLoadingDisabled ? EagerProjectInsight : LazyProjectInsight;

export declare const ProjectInsight: (new (
  init: ModelInit<ProjectInsight, ProjectInsightMetaData>
) => ProjectInsight) & {
  copyOf(
    source: ProjectInsight,
    mutator: (
      draft: MutableModel<ProjectInsight, ProjectInsightMetaData>
    ) => MutableModel<ProjectInsight, ProjectInsightMetaData> | void
  ): ProjectInsight;
};

type EagerDU = {
  readonly id: string;
  readonly name?: string | null;
  readonly context?: string | null;
  readonly hxScore?: number | null;
  readonly persona?: string | null;
  readonly timeLost?: number | null;
  readonly payroll?: number | null;
  readonly revenue?: number | null;
  readonly locationType?: LocationType | keyof typeof LocationType | null;
  readonly hybridPercent?: number | null;
  readonly applications?: (string | null)[] | null;
  readonly projects?: (ProjectDus | null)[] | null;
  readonly report?: Report | null;
  readonly office?: string | null;
  readonly country?: string | null;
  readonly officeHx?: number | null;
  readonly remoteHx?: number | null;
  readonly locations?: string | null;
  readonly analytics?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly reportDusId?: string | null;
};

type LazyDU = {
  readonly id: string;
  readonly name?: string | null;
  readonly context?: string | null;
  readonly hxScore?: number | null;
  readonly persona?: string | null;
  readonly timeLost?: number | null;
  readonly payroll?: number | null;
  readonly revenue?: number | null;
  readonly locationType?: LocationType | keyof typeof LocationType | null;
  readonly hybridPercent?: number | null;
  readonly applications?: (string | null)[] | null;
  readonly projects: AsyncCollection<ProjectDus>;
  readonly report: AsyncItem<Report | undefined>;
  readonly office?: string | null;
  readonly country?: string | null;
  readonly officeHx?: number | null;
  readonly remoteHx?: number | null;
  readonly locations?: string | null;
  readonly analytics?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly reportDusId?: string | null;
};

export declare type DU = LazyLoading extends LazyLoadingDisabled ? EagerDU : LazyDU;

export declare const DU: (new (init: ModelInit<DU, DUMetaData>) => DU) & {
  copyOf(source: DU, mutator: (draft: MutableModel<DU, DUMetaData>) => MutableModel<DU, DUMetaData> | void): DU;
};

type EagerParse = {
  readonly id: string;
  readonly context?: string | null;
  readonly inputAnalyticCsv?: string | null;
  readonly inputProjectCsv?: string | null;
  readonly previewS3?: string | null;
  readonly levers?: string | null;
  readonly startDateTime?: string | null;
  readonly endDateTime?: string | null;
  readonly status?: ParseStatus | keyof typeof ParseStatus | null;
  readonly report?: Report | null;
  readonly warnings?: (string | null)[] | null;
  readonly expectedDus?: number | null;
  readonly processedDus?: number | null;
  readonly personaSettings?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly parseReportId?: string | null;
};

type LazyParse = {
  readonly id: string;
  readonly context?: string | null;
  readonly inputAnalyticCsv?: string | null;
  readonly inputProjectCsv?: string | null;
  readonly previewS3?: string | null;
  readonly levers?: string | null;
  readonly startDateTime?: string | null;
  readonly endDateTime?: string | null;
  readonly status?: ParseStatus | keyof typeof ParseStatus | null;
  readonly report: AsyncItem<Report | undefined>;
  readonly warnings?: (string | null)[] | null;
  readonly expectedDus?: number | null;
  readonly processedDus?: number | null;
  readonly personaSettings?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly parseReportId?: string | null;
};

export declare type Parse = LazyLoading extends LazyLoadingDisabled ? EagerParse : LazyParse;

export declare const Parse: (new (init: ModelInit<Parse, ParseMetaData>) => Parse) & {
  copyOf(
    source: Parse,
    mutator: (draft: MutableModel<Parse, ParseMetaData>) => MutableModel<Parse, ParseMetaData> | void
  ): Parse;
};

type EagerProjectDus = {
  readonly id: string;
  readonly project: Project;
  readonly du: DU;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
};

type LazyProjectDus = {
  readonly id: string;
  readonly project: AsyncItem<Project>;
  readonly du: AsyncItem<DU>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
};

export declare type ProjectDus = LazyLoading extends LazyLoadingDisabled ? EagerProjectDus : LazyProjectDus;

export declare const ProjectDus: (new (init: ModelInit<ProjectDus, ProjectDusMetaData>) => ProjectDus) & {
  copyOf(
    source: ProjectDus,
    mutator: (
      draft: MutableModel<ProjectDus, ProjectDusMetaData>
    ) => MutableModel<ProjectDus, ProjectDusMetaData> | void
  ): ProjectDus;
};
