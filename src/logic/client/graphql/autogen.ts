/**
 *  WARNING: DO NOT EDIT. This file is automatically updated by running `npm run generate-graphql-map`. It will be overwritten.
 *  Add custom queries to GraphQLMapCustom in ./types.ts and custom subscriptions to GraphQLSubscriptionMapCustom instead.
 */
import type {
  DuWithProjectsByReportQuery,
  DuWithProjectsByReportQueryVariables,
  ListPartnersAndOrganisationsQuery,
  ListPartnersAndOrganisationsQueryVariables,
  ContextByIdentityProviderQuery,
  ContextByIdentityProviderQueryVariables,
  DuByContextQuery,
  DuByContextQueryVariables,
  DuByLocationTypeQuery,
  DuByLocationTypeQueryVariables,
  DuByNameQuery,
  DuByNameQueryVariables,
  DuByPersonaQuery,
  DuByPersonaQueryVariables,
  DuByReportIdQuery,
  DuByReportIdQueryVariables,
  GetApplicationUsageQuery,
  GetApplicationUsageQueryVariables,
  GetContextMapQuery,
  GetContextMapQueryVariables,
  GetDUQuery,
  GetDUQueryVariables,
  GetInputAssumptionQuery,
  GetInputAssumptionQueryVariables,
  GetOrganisationQuery,
  GetOrganisationQueryVariables,
  GetParseQuery,
  GetParseQueryVariables,
  GetPartnerQuery,
  GetPartnerQueryVariables,
  GetPersonaSettingsQuery,
  GetPersonaSettingsQueryVariables,
  GetProjectQuery,
  GetProjectQueryVariables,
  GetProjectDusQuery,
  GetProjectDusQueryVariables,
  GetProjectInsightQuery,
  GetProjectInsightQueryVariables,
  GetProjectTemplateQuery,
  GetProjectTemplateQueryVariables,
  GetReportQuery,
  GetReportQueryVariables,
  ListApplicationUsagesQuery,
  ListApplicationUsagesQueryVariables,
  ListContextMapsQuery,
  ListContextMapsQueryVariables,
  ListDUSQuery,
  ListDUSQueryVariables,
  ListInputAssumptionsQuery,
  ListInputAssumptionsQueryVariables,
  ListOrganisationsQuery,
  ListOrganisationsQueryVariables,
  ListParsesQuery,
  ListParsesQueryVariables,
  ListPartnersQuery,
  ListPartnersQueryVariables,
  ListPersonaSettingsQuery,
  ListPersonaSettingsQueryVariables,
  ListProjectDusesQuery,
  ListProjectDusesQueryVariables,
  ListProjectInsightsQuery,
  ListProjectInsightsQueryVariables,
  ListProjectTemplatesQuery,
  ListProjectTemplatesQueryVariables,
  ListProjectsQuery,
  ListProjectsQueryVariables,
  ListReportsQuery,
  ListReportsQueryVariables,
  OrganisationByOrganisationIdQuery,
  OrganisationByOrganisationIdQueryVariables,
  ParseByContextQuery,
  ParseByContextQueryVariables,
  ParseByStatusQuery,
  ParseByStatusQueryVariables,
  PartnerByPartnerIdQuery,
  PartnerByPartnerIdQueryVariables,
  ProjectByContextQuery,
  ProjectByContextQueryVariables,
  ProjectByProjectIdQuery,
  ProjectByProjectIdQueryVariables,
  ProjectInsightByContextQuery,
  ProjectInsightByContextQueryVariables,
  ProjectTemplateByContextQuery,
  ProjectTemplateByContextQueryVariables,
  ProjectTemplateByTemplateIdQuery,
  ProjectTemplateByTemplateIdQueryVariables,
  ReportByContextQuery,
  ReportByContextQueryVariables,
  ReportByReportDateQuery,
  ReportByReportDateQueryVariables,
  SyncApplicationUsagesQuery,
  SyncApplicationUsagesQueryVariables,
  SyncContextMapsQuery,
  SyncContextMapsQueryVariables,
  SyncDUSQuery,
  SyncDUSQueryVariables,
  SyncInputAssumptionsQuery,
  SyncInputAssumptionsQueryVariables,
  SyncOrganisationsQuery,
  SyncOrganisationsQueryVariables,
  SyncParsesQuery,
  SyncParsesQueryVariables,
  SyncPartnersQuery,
  SyncPartnersQueryVariables,
  SyncPersonaSettingsQuery,
  SyncPersonaSettingsQueryVariables,
  SyncProjectDusesQuery,
  SyncProjectDusesQueryVariables,
  SyncProjectInsightsQuery,
  SyncProjectInsightsQueryVariables,
  SyncProjectTemplatesQuery,
  SyncProjectTemplatesQueryVariables,
  SyncProjectsQuery,
  SyncProjectsQueryVariables,
  SyncReportsQuery,
  SyncReportsQueryVariables,
  UsageByTargetQuery,
  UsageByTargetQueryVariables,
  CreateApplicationUsageMutation,
  CreateApplicationUsageMutationVariables,
  CreateContextMapMutation,
  CreateContextMapMutationVariables,
  CreateDUMutation,
  CreateDUMutationVariables,
  CreateInputAssumptionMutation,
  CreateInputAssumptionMutationVariables,
  CreateOrganisationMutation,
  CreateOrganisationMutationVariables,
  CreateParseMutation,
  CreateParseMutationVariables,
  CreatePartnerMutation,
  CreatePartnerMutationVariables,
  CreatePersonaSettingsMutation,
  CreatePersonaSettingsMutationVariables,
  CreateProjectMutation,
  CreateProjectMutationVariables,
  CreateProjectDusMutation,
  CreateProjectDusMutationVariables,
  CreateProjectInsightMutation,
  CreateProjectInsightMutationVariables,
  CreateProjectTemplateMutation,
  CreateProjectTemplateMutationVariables,
  CreateReportMutation,
  CreateReportMutationVariables,
  DeleteApplicationUsageMutation,
  DeleteApplicationUsageMutationVariables,
  DeleteContextMapMutation,
  DeleteContextMapMutationVariables,
  DeleteDUMutation,
  DeleteDUMutationVariables,
  DeleteInputAssumptionMutation,
  DeleteInputAssumptionMutationVariables,
  DeleteOrganisationMutation,
  DeleteOrganisationMutationVariables,
  DeleteParseMutation,
  DeleteParseMutationVariables,
  DeletePartnerMutation,
  DeletePartnerMutationVariables,
  DeletePersonaSettingsMutation,
  DeletePersonaSettingsMutationVariables,
  DeleteProjectMutation,
  DeleteProjectMutationVariables,
  DeleteProjectDusMutation,
  DeleteProjectDusMutationVariables,
  DeleteProjectInsightMutation,
  DeleteProjectInsightMutationVariables,
  DeleteProjectTemplateMutation,
  DeleteProjectTemplateMutationVariables,
  DeleteReportMutation,
  DeleteReportMutationVariables,
  UpdateApplicationUsageMutation,
  UpdateApplicationUsageMutationVariables,
  UpdateContextMapMutation,
  UpdateContextMapMutationVariables,
  UpdateDUMutation,
  UpdateDUMutationVariables,
  UpdateInputAssumptionMutation,
  UpdateInputAssumptionMutationVariables,
  UpdateOrganisationMutation,
  UpdateOrganisationMutationVariables,
  UpdateParseMutation,
  UpdateParseMutationVariables,
  UpdatePartnerMutation,
  UpdatePartnerMutationVariables,
  UpdatePersonaSettingsMutation,
  UpdatePersonaSettingsMutationVariables,
  UpdateProjectMutation,
  UpdateProjectMutationVariables,
  UpdateProjectDusMutation,
  UpdateProjectDusMutationVariables,
  UpdateProjectInsightMutation,
  UpdateProjectInsightMutationVariables,
  UpdateProjectTemplateMutation,
  UpdateProjectTemplateMutationVariables,
  UpdateReportMutation,
  UpdateReportMutationVariables,
  OnCreateApplicationUsageSubscription,
  OnCreateApplicationUsageSubscriptionVariables,
  OnCreateContextMapSubscription,
  OnCreateContextMapSubscriptionVariables,
  OnCreateDUSubscription,
  OnCreateDUSubscriptionVariables,
  OnCreateInputAssumptionSubscription,
  OnCreateInputAssumptionSubscriptionVariables,
  OnCreateOrganisationSubscription,
  OnCreateOrganisationSubscriptionVariables,
  OnCreateParseSubscription,
  OnCreateParseSubscriptionVariables,
  OnCreatePartnerSubscription,
  OnCreatePartnerSubscriptionVariables,
  OnCreatePersonaSettingsSubscription,
  OnCreatePersonaSettingsSubscriptionVariables,
  OnCreateProjectSubscription,
  OnCreateProjectSubscriptionVariables,
  OnCreateProjectDusSubscription,
  OnCreateProjectDusSubscriptionVariables,
  OnCreateProjectInsightSubscription,
  OnCreateProjectInsightSubscriptionVariables,
  OnCreateProjectTemplateSubscription,
  OnCreateProjectTemplateSubscriptionVariables,
  OnCreateReportSubscription,
  OnCreateReportSubscriptionVariables,
  OnDeleteApplicationUsageSubscription,
  OnDeleteApplicationUsageSubscriptionVariables,
  OnDeleteContextMapSubscription,
  OnDeleteContextMapSubscriptionVariables,
  OnDeleteDUSubscription,
  OnDeleteDUSubscriptionVariables,
  OnDeleteInputAssumptionSubscription,
  OnDeleteInputAssumptionSubscriptionVariables,
  OnDeleteOrganisationSubscription,
  OnDeleteOrganisationSubscriptionVariables,
  OnDeleteParseSubscription,
  OnDeleteParseSubscriptionVariables,
  OnDeletePartnerSubscription,
  OnDeletePartnerSubscriptionVariables,
  OnDeletePersonaSettingsSubscription,
  OnDeletePersonaSettingsSubscriptionVariables,
  OnDeleteProjectSubscription,
  OnDeleteProjectSubscriptionVariables,
  OnDeleteProjectDusSubscription,
  OnDeleteProjectDusSubscriptionVariables,
  OnDeleteProjectInsightSubscription,
  OnDeleteProjectInsightSubscriptionVariables,
  OnDeleteProjectTemplateSubscription,
  OnDeleteProjectTemplateSubscriptionVariables,
  OnDeleteReportSubscription,
  OnDeleteReportSubscriptionVariables,
  OnUpdateApplicationUsageSubscription,
  OnUpdateApplicationUsageSubscriptionVariables,
  OnUpdateContextMapSubscription,
  OnUpdateContextMapSubscriptionVariables,
  OnUpdateDUSubscription,
  OnUpdateDUSubscriptionVariables,
  OnUpdateInputAssumptionSubscription,
  OnUpdateInputAssumptionSubscriptionVariables,
  OnUpdateOrganisationSubscription,
  OnUpdateOrganisationSubscriptionVariables,
  OnUpdateParseSubscription,
  OnUpdateParseSubscriptionVariables,
  OnUpdatePartnerSubscription,
  OnUpdatePartnerSubscriptionVariables,
  OnUpdatePersonaSettingsSubscription,
  OnUpdatePersonaSettingsSubscriptionVariables,
  OnUpdateProjectSubscription,
  OnUpdateProjectSubscriptionVariables,
  OnUpdateProjectDusSubscription,
  OnUpdateProjectDusSubscriptionVariables,
  OnUpdateProjectInsightSubscription,
  OnUpdateProjectInsightSubscriptionVariables,
  OnUpdateProjectTemplateSubscription,
  OnUpdateProjectTemplateSubscriptionVariables,
  OnUpdateReportSubscription,
  OnUpdateReportSubscriptionVariables,
} from 'src/graphql';

import type { duWithProjectsByReport, listPartnersAndOrganisations } from 'src/graphql/custom-queries';

import type {
  createApplicationUsage,
  createContextMap,
  createDU,
  createInputAssumption,
  createOrganisation,
  createParse,
  createPartner,
  createPersonaSettings,
  createProject,
  createProjectDus,
  createProjectInsight,
  createProjectTemplate,
  createReport,
  deleteApplicationUsage,
  deleteContextMap,
  deleteDU,
  deleteInputAssumption,
  deleteOrganisation,
  deleteParse,
  deletePartner,
  deletePersonaSettings,
  deleteProject,
  deleteProjectDus,
  deleteProjectInsight,
  deleteProjectTemplate,
  deleteReport,
  updateApplicationUsage,
  updateContextMap,
  updateDU,
  updateInputAssumption,
  updateOrganisation,
  updateParse,
  updatePartner,
  updatePersonaSettings,
  updateProject,
  updateProjectDus,
  updateProjectInsight,
  updateProjectTemplate,
  updateReport,
} from 'src/graphql/mutations';

import type {
  contextByIdentityProvider,
  duByContext,
  duByLocationType,
  duByName,
  duByPersona,
  duByReportId,
  getApplicationUsage,
  getContextMap,
  getDU,
  getInputAssumption,
  getOrganisation,
  getParse,
  getPartner,
  getPersonaSettings,
  getProject,
  getProjectDus,
  getProjectInsight,
  getProjectTemplate,
  getReport,
  listApplicationUsages,
  listContextMaps,
  listDUS,
  listInputAssumptions,
  listOrganisations,
  listParses,
  listPartners,
  listPersonaSettings,
  listProjectDuses,
  listProjectInsights,
  listProjectTemplates,
  listProjects,
  listReports,
  organisationByOrganisationId,
  parseByContext,
  parseByStatus,
  partnerByPartnerId,
  projectByContext,
  projectByProjectId,
  projectInsightByContext,
  projectTemplateByContext,
  projectTemplateByTemplateId,
  reportByContext,
  reportByReportDate,
  syncApplicationUsages,
  syncContextMaps,
  syncDUS,
  syncInputAssumptions,
  syncOrganisations,
  syncParses,
  syncPartners,
  syncPersonaSettings,
  syncProjectDuses,
  syncProjectInsights,
  syncProjectTemplates,
  syncProjects,
  syncReports,
  usageByTarget,
} from 'src/graphql/queries';

import type {
  onCreateApplicationUsage,
  onCreateContextMap,
  onCreateDU,
  onCreateInputAssumption,
  onCreateOrganisation,
  onCreateParse,
  onCreatePartner,
  onCreatePersonaSettings,
  onCreateProject,
  onCreateProjectDus,
  onCreateProjectInsight,
  onCreateProjectTemplate,
  onCreateReport,
  onDeleteApplicationUsage,
  onDeleteContextMap,
  onDeleteDU,
  onDeleteInputAssumption,
  onDeleteOrganisation,
  onDeleteParse,
  onDeletePartner,
  onDeletePersonaSettings,
  onDeleteProject,
  onDeleteProjectDus,
  onDeleteProjectInsight,
  onDeleteProjectTemplate,
  onDeleteReport,
  onUpdateApplicationUsage,
  onUpdateContextMap,
  onUpdateDU,
  onUpdateInputAssumption,
  onUpdateOrganisation,
  onUpdateParse,
  onUpdatePartner,
  onUpdatePersonaSettings,
  onUpdateProject,
  onUpdateProjectDus,
  onUpdateProjectInsight,
  onUpdateProjectTemplate,
  onUpdateReport,
} from 'src/graphql/subscriptions';

import type { GraphQLEntry } from './types';

export type GraphQLMap = {
  [duWithProjectsByReport]: GraphQLEntry<DuWithProjectsByReportQuery, DuWithProjectsByReportQueryVariables>;
  [listPartnersAndOrganisations]: GraphQLEntry<
    ListPartnersAndOrganisationsQuery,
    ListPartnersAndOrganisationsQueryVariables
  >;
  [contextByIdentityProvider]: GraphQLEntry<ContextByIdentityProviderQuery, ContextByIdentityProviderQueryVariables>;
  [duByContext]: GraphQLEntry<DuByContextQuery, DuByContextQueryVariables>;
  [duByLocationType]: GraphQLEntry<DuByLocationTypeQuery, DuByLocationTypeQueryVariables>;
  [duByName]: GraphQLEntry<DuByNameQuery, DuByNameQueryVariables>;
  [duByPersona]: GraphQLEntry<DuByPersonaQuery, DuByPersonaQueryVariables>;
  [duByReportId]: GraphQLEntry<DuByReportIdQuery, DuByReportIdQueryVariables>;
  [getApplicationUsage]: GraphQLEntry<GetApplicationUsageQuery, GetApplicationUsageQueryVariables>;
  [getContextMap]: GraphQLEntry<GetContextMapQuery, GetContextMapQueryVariables>;
  [getDU]: GraphQLEntry<GetDUQuery, GetDUQueryVariables>;
  [getInputAssumption]: GraphQLEntry<GetInputAssumptionQuery, GetInputAssumptionQueryVariables>;
  [getOrganisation]: GraphQLEntry<GetOrganisationQuery, GetOrganisationQueryVariables>;
  [getParse]: GraphQLEntry<GetParseQuery, GetParseQueryVariables>;
  [getPartner]: GraphQLEntry<GetPartnerQuery, GetPartnerQueryVariables>;
  [getPersonaSettings]: GraphQLEntry<GetPersonaSettingsQuery, GetPersonaSettingsQueryVariables>;
  [getProject]: GraphQLEntry<GetProjectQuery, GetProjectQueryVariables>;
  [getProjectDus]: GraphQLEntry<GetProjectDusQuery, GetProjectDusQueryVariables>;
  [getProjectInsight]: GraphQLEntry<GetProjectInsightQuery, GetProjectInsightQueryVariables>;
  [getProjectTemplate]: GraphQLEntry<GetProjectTemplateQuery, GetProjectTemplateQueryVariables>;
  [getReport]: GraphQLEntry<GetReportQuery, GetReportQueryVariables>;
  [listApplicationUsages]: GraphQLEntry<ListApplicationUsagesQuery, ListApplicationUsagesQueryVariables>;
  [listContextMaps]: GraphQLEntry<ListContextMapsQuery, ListContextMapsQueryVariables>;
  [listDUS]: GraphQLEntry<ListDUSQuery, ListDUSQueryVariables>;
  [listInputAssumptions]: GraphQLEntry<ListInputAssumptionsQuery, ListInputAssumptionsQueryVariables>;
  [listOrganisations]: GraphQLEntry<ListOrganisationsQuery, ListOrganisationsQueryVariables>;
  [listParses]: GraphQLEntry<ListParsesQuery, ListParsesQueryVariables>;
  [listPartners]: GraphQLEntry<ListPartnersQuery, ListPartnersQueryVariables>;
  [listPersonaSettings]: GraphQLEntry<ListPersonaSettingsQuery, ListPersonaSettingsQueryVariables>;
  [listProjectDuses]: GraphQLEntry<ListProjectDusesQuery, ListProjectDusesQueryVariables>;
  [listProjectInsights]: GraphQLEntry<ListProjectInsightsQuery, ListProjectInsightsQueryVariables>;
  [listProjectTemplates]: GraphQLEntry<ListProjectTemplatesQuery, ListProjectTemplatesQueryVariables>;
  [listProjects]: GraphQLEntry<ListProjectsQuery, ListProjectsQueryVariables>;
  [listReports]: GraphQLEntry<ListReportsQuery, ListReportsQueryVariables>;
  [organisationByOrganisationId]: GraphQLEntry<
    OrganisationByOrganisationIdQuery,
    OrganisationByOrganisationIdQueryVariables
  >;
  [parseByContext]: GraphQLEntry<ParseByContextQuery, ParseByContextQueryVariables>;
  [parseByStatus]: GraphQLEntry<ParseByStatusQuery, ParseByStatusQueryVariables>;
  [partnerByPartnerId]: GraphQLEntry<PartnerByPartnerIdQuery, PartnerByPartnerIdQueryVariables>;
  [projectByContext]: GraphQLEntry<ProjectByContextQuery, ProjectByContextQueryVariables>;
  [projectByProjectId]: GraphQLEntry<ProjectByProjectIdQuery, ProjectByProjectIdQueryVariables>;
  [projectInsightByContext]: GraphQLEntry<ProjectInsightByContextQuery, ProjectInsightByContextQueryVariables>;
  [projectTemplateByContext]: GraphQLEntry<ProjectTemplateByContextQuery, ProjectTemplateByContextQueryVariables>;
  [projectTemplateByTemplateId]: GraphQLEntry<
    ProjectTemplateByTemplateIdQuery,
    ProjectTemplateByTemplateIdQueryVariables
  >;
  [reportByContext]: GraphQLEntry<ReportByContextQuery, ReportByContextQueryVariables>;
  [reportByReportDate]: GraphQLEntry<ReportByReportDateQuery, ReportByReportDateQueryVariables>;
  [syncApplicationUsages]: GraphQLEntry<SyncApplicationUsagesQuery, SyncApplicationUsagesQueryVariables>;
  [syncContextMaps]: GraphQLEntry<SyncContextMapsQuery, SyncContextMapsQueryVariables>;
  [syncDUS]: GraphQLEntry<SyncDUSQuery, SyncDUSQueryVariables>;
  [syncInputAssumptions]: GraphQLEntry<SyncInputAssumptionsQuery, SyncInputAssumptionsQueryVariables>;
  [syncOrganisations]: GraphQLEntry<SyncOrganisationsQuery, SyncOrganisationsQueryVariables>;
  [syncParses]: GraphQLEntry<SyncParsesQuery, SyncParsesQueryVariables>;
  [syncPartners]: GraphQLEntry<SyncPartnersQuery, SyncPartnersQueryVariables>;
  [syncPersonaSettings]: GraphQLEntry<SyncPersonaSettingsQuery, SyncPersonaSettingsQueryVariables>;
  [syncProjectDuses]: GraphQLEntry<SyncProjectDusesQuery, SyncProjectDusesQueryVariables>;
  [syncProjectInsights]: GraphQLEntry<SyncProjectInsightsQuery, SyncProjectInsightsQueryVariables>;
  [syncProjectTemplates]: GraphQLEntry<SyncProjectTemplatesQuery, SyncProjectTemplatesQueryVariables>;
  [syncProjects]: GraphQLEntry<SyncProjectsQuery, SyncProjectsQueryVariables>;
  [syncReports]: GraphQLEntry<SyncReportsQuery, SyncReportsQueryVariables>;
  [usageByTarget]: GraphQLEntry<UsageByTargetQuery, UsageByTargetQueryVariables>;
  [createApplicationUsage]: GraphQLEntry<CreateApplicationUsageMutation, CreateApplicationUsageMutationVariables>;
  [createContextMap]: GraphQLEntry<CreateContextMapMutation, CreateContextMapMutationVariables>;
  [createDU]: GraphQLEntry<CreateDUMutation, CreateDUMutationVariables>;
  [createInputAssumption]: GraphQLEntry<CreateInputAssumptionMutation, CreateInputAssumptionMutationVariables>;
  [createOrganisation]: GraphQLEntry<CreateOrganisationMutation, CreateOrganisationMutationVariables>;
  [createParse]: GraphQLEntry<CreateParseMutation, CreateParseMutationVariables>;
  [createPartner]: GraphQLEntry<CreatePartnerMutation, CreatePartnerMutationVariables>;
  [createPersonaSettings]: GraphQLEntry<CreatePersonaSettingsMutation, CreatePersonaSettingsMutationVariables>;
  [createProject]: GraphQLEntry<CreateProjectMutation, CreateProjectMutationVariables>;
  [createProjectDus]: GraphQLEntry<CreateProjectDusMutation, CreateProjectDusMutationVariables>;
  [createProjectInsight]: GraphQLEntry<CreateProjectInsightMutation, CreateProjectInsightMutationVariables>;
  [createProjectTemplate]: GraphQLEntry<CreateProjectTemplateMutation, CreateProjectTemplateMutationVariables>;
  [createReport]: GraphQLEntry<CreateReportMutation, CreateReportMutationVariables>;
  [deleteApplicationUsage]: GraphQLEntry<DeleteApplicationUsageMutation, DeleteApplicationUsageMutationVariables>;
  [deleteContextMap]: GraphQLEntry<DeleteContextMapMutation, DeleteContextMapMutationVariables>;
  [deleteDU]: GraphQLEntry<DeleteDUMutation, DeleteDUMutationVariables>;
  [deleteInputAssumption]: GraphQLEntry<DeleteInputAssumptionMutation, DeleteInputAssumptionMutationVariables>;
  [deleteOrganisation]: GraphQLEntry<DeleteOrganisationMutation, DeleteOrganisationMutationVariables>;
  [deleteParse]: GraphQLEntry<DeleteParseMutation, DeleteParseMutationVariables>;
  [deletePartner]: GraphQLEntry<DeletePartnerMutation, DeletePartnerMutationVariables>;
  [deletePersonaSettings]: GraphQLEntry<DeletePersonaSettingsMutation, DeletePersonaSettingsMutationVariables>;
  [deleteProject]: GraphQLEntry<DeleteProjectMutation, DeleteProjectMutationVariables>;
  [deleteProjectDus]: GraphQLEntry<DeleteProjectDusMutation, DeleteProjectDusMutationVariables>;
  [deleteProjectInsight]: GraphQLEntry<DeleteProjectInsightMutation, DeleteProjectInsightMutationVariables>;
  [deleteProjectTemplate]: GraphQLEntry<DeleteProjectTemplateMutation, DeleteProjectTemplateMutationVariables>;
  [deleteReport]: GraphQLEntry<DeleteReportMutation, DeleteReportMutationVariables>;
  [updateApplicationUsage]: GraphQLEntry<UpdateApplicationUsageMutation, UpdateApplicationUsageMutationVariables>;
  [updateContextMap]: GraphQLEntry<UpdateContextMapMutation, UpdateContextMapMutationVariables>;
  [updateDU]: GraphQLEntry<UpdateDUMutation, UpdateDUMutationVariables>;
  [updateInputAssumption]: GraphQLEntry<UpdateInputAssumptionMutation, UpdateInputAssumptionMutationVariables>;
  [updateOrganisation]: GraphQLEntry<UpdateOrganisationMutation, UpdateOrganisationMutationVariables>;
  [updateParse]: GraphQLEntry<UpdateParseMutation, UpdateParseMutationVariables>;
  [updatePartner]: GraphQLEntry<UpdatePartnerMutation, UpdatePartnerMutationVariables>;
  [updatePersonaSettings]: GraphQLEntry<UpdatePersonaSettingsMutation, UpdatePersonaSettingsMutationVariables>;
  [updateProject]: GraphQLEntry<UpdateProjectMutation, UpdateProjectMutationVariables>;
  [updateProjectDus]: GraphQLEntry<UpdateProjectDusMutation, UpdateProjectDusMutationVariables>;
  [updateProjectInsight]: GraphQLEntry<UpdateProjectInsightMutation, UpdateProjectInsightMutationVariables>;
  [updateProjectTemplate]: GraphQLEntry<UpdateProjectTemplateMutation, UpdateProjectTemplateMutationVariables>;
  [updateReport]: GraphQLEntry<UpdateReportMutation, UpdateReportMutationVariables>;
};

export type GraphQLSubscriptionMap = {
  [onCreateApplicationUsage]: GraphQLEntry<
    OnCreateApplicationUsageSubscription,
    OnCreateApplicationUsageSubscriptionVariables
  >;
  [onCreateContextMap]: GraphQLEntry<OnCreateContextMapSubscription, OnCreateContextMapSubscriptionVariables>;
  [onCreateDU]: GraphQLEntry<OnCreateDUSubscription, OnCreateDUSubscriptionVariables>;
  [onCreateInputAssumption]: GraphQLEntry<
    OnCreateInputAssumptionSubscription,
    OnCreateInputAssumptionSubscriptionVariables
  >;
  [onCreateOrganisation]: GraphQLEntry<OnCreateOrganisationSubscription, OnCreateOrganisationSubscriptionVariables>;
  [onCreateParse]: GraphQLEntry<OnCreateParseSubscription, OnCreateParseSubscriptionVariables>;
  [onCreatePartner]: GraphQLEntry<OnCreatePartnerSubscription, OnCreatePartnerSubscriptionVariables>;
  [onCreatePersonaSettings]: GraphQLEntry<
    OnCreatePersonaSettingsSubscription,
    OnCreatePersonaSettingsSubscriptionVariables
  >;
  [onCreateProject]: GraphQLEntry<OnCreateProjectSubscription, OnCreateProjectSubscriptionVariables>;
  [onCreateProjectDus]: GraphQLEntry<OnCreateProjectDusSubscription, OnCreateProjectDusSubscriptionVariables>;
  [onCreateProjectInsight]: GraphQLEntry<
    OnCreateProjectInsightSubscription,
    OnCreateProjectInsightSubscriptionVariables
  >;
  [onCreateProjectTemplate]: GraphQLEntry<
    OnCreateProjectTemplateSubscription,
    OnCreateProjectTemplateSubscriptionVariables
  >;
  [onCreateReport]: GraphQLEntry<OnCreateReportSubscription, OnCreateReportSubscriptionVariables>;
  [onDeleteApplicationUsage]: GraphQLEntry<
    OnDeleteApplicationUsageSubscription,
    OnDeleteApplicationUsageSubscriptionVariables
  >;
  [onDeleteContextMap]: GraphQLEntry<OnDeleteContextMapSubscription, OnDeleteContextMapSubscriptionVariables>;
  [onDeleteDU]: GraphQLEntry<OnDeleteDUSubscription, OnDeleteDUSubscriptionVariables>;
  [onDeleteInputAssumption]: GraphQLEntry<
    OnDeleteInputAssumptionSubscription,
    OnDeleteInputAssumptionSubscriptionVariables
  >;
  [onDeleteOrganisation]: GraphQLEntry<OnDeleteOrganisationSubscription, OnDeleteOrganisationSubscriptionVariables>;
  [onDeleteParse]: GraphQLEntry<OnDeleteParseSubscription, OnDeleteParseSubscriptionVariables>;
  [onDeletePartner]: GraphQLEntry<OnDeletePartnerSubscription, OnDeletePartnerSubscriptionVariables>;
  [onDeletePersonaSettings]: GraphQLEntry<
    OnDeletePersonaSettingsSubscription,
    OnDeletePersonaSettingsSubscriptionVariables
  >;
  [onDeleteProject]: GraphQLEntry<OnDeleteProjectSubscription, OnDeleteProjectSubscriptionVariables>;
  [onDeleteProjectDus]: GraphQLEntry<OnDeleteProjectDusSubscription, OnDeleteProjectDusSubscriptionVariables>;
  [onDeleteProjectInsight]: GraphQLEntry<
    OnDeleteProjectInsightSubscription,
    OnDeleteProjectInsightSubscriptionVariables
  >;
  [onDeleteProjectTemplate]: GraphQLEntry<
    OnDeleteProjectTemplateSubscription,
    OnDeleteProjectTemplateSubscriptionVariables
  >;
  [onDeleteReport]: GraphQLEntry<OnDeleteReportSubscription, OnDeleteReportSubscriptionVariables>;
  [onUpdateApplicationUsage]: GraphQLEntry<
    OnUpdateApplicationUsageSubscription,
    OnUpdateApplicationUsageSubscriptionVariables
  >;
  [onUpdateContextMap]: GraphQLEntry<OnUpdateContextMapSubscription, OnUpdateContextMapSubscriptionVariables>;
  [onUpdateDU]: GraphQLEntry<OnUpdateDUSubscription, OnUpdateDUSubscriptionVariables>;
  [onUpdateInputAssumption]: GraphQLEntry<
    OnUpdateInputAssumptionSubscription,
    OnUpdateInputAssumptionSubscriptionVariables
  >;
  [onUpdateOrganisation]: GraphQLEntry<OnUpdateOrganisationSubscription, OnUpdateOrganisationSubscriptionVariables>;
  [onUpdateParse]: GraphQLEntry<OnUpdateParseSubscription, OnUpdateParseSubscriptionVariables>;
  [onUpdatePartner]: GraphQLEntry<OnUpdatePartnerSubscription, OnUpdatePartnerSubscriptionVariables>;
  [onUpdatePersonaSettings]: GraphQLEntry<
    OnUpdatePersonaSettingsSubscription,
    OnUpdatePersonaSettingsSubscriptionVariables
  >;
  [onUpdateProject]: GraphQLEntry<OnUpdateProjectSubscription, OnUpdateProjectSubscriptionVariables>;
  [onUpdateProjectDus]: GraphQLEntry<OnUpdateProjectDusSubscription, OnUpdateProjectDusSubscriptionVariables>;
  [onUpdateProjectInsight]: GraphQLEntry<
    OnUpdateProjectInsightSubscription,
    OnUpdateProjectInsightSubscriptionVariables
  >;
  [onUpdateProjectTemplate]: GraphQLEntry<
    OnUpdateProjectTemplateSubscription,
    OnUpdateProjectTemplateSubscriptionVariables
  >;
  [onUpdateReport]: GraphQLEntry<OnUpdateReportSubscription, OnUpdateReportSubscriptionVariables>;
};
