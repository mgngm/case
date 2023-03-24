/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getPersonaSettings = /* GraphQL */ `
  query GetPersonaSettings($id: ID!) {
    getPersonaSettings(id: $id) {
      createdAt
      id
      organisation
      termType
      term
      inputAssumptions {
        items {
          id
          termValue
          timeWorkedPerDay
          dailyDigitalPercentage
          payrollPerEmployee
          revenuePerEmployee
          numberOfEmployees
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          personaSettingsInputAssumptionsId
        }
        nextToken
        startedAt
      }
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const listPersonaSettings = /* GraphQL */ `
  query ListPersonaSettings($filter: ModelPersonaSettingsFilterInput, $limit: Int, $nextToken: String) {
    listPersonaSettings(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        createdAt
        id
        organisation
        termType
        term
        inputAssumptions {
          nextToken
          startedAt
        }
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const syncPersonaSettings = /* GraphQL */ `
  query SyncPersonaSettings(
    $filter: ModelPersonaSettingsFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncPersonaSettings(filter: $filter, limit: $limit, nextToken: $nextToken, lastSync: $lastSync) {
      items {
        createdAt
        id
        organisation
        termType
        term
        inputAssumptions {
          nextToken
          startedAt
        }
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const getInputAssumption = /* GraphQL */ `
  query GetInputAssumption($id: ID!) {
    getInputAssumption(id: $id) {
      id
      termValue
      timeWorkedPerDay
      dailyDigitalPercentage
      payrollPerEmployee
      revenuePerEmployee
      numberOfEmployees
      applicationUsages {
        items {
          id
          target
          percent
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          inputAssumptionApplicationUsagesId
        }
        nextToken
        startedAt
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      personaSettingsInputAssumptionsId
    }
  }
`;
export const listInputAssumptions = /* GraphQL */ `
  query ListInputAssumptions($filter: ModelInputAssumptionFilterInput, $limit: Int, $nextToken: String) {
    listInputAssumptions(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        termValue
        timeWorkedPerDay
        dailyDigitalPercentage
        payrollPerEmployee
        revenuePerEmployee
        numberOfEmployees
        applicationUsages {
          nextToken
          startedAt
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        personaSettingsInputAssumptionsId
      }
      nextToken
      startedAt
    }
  }
`;
export const syncInputAssumptions = /* GraphQL */ `
  query SyncInputAssumptions(
    $filter: ModelInputAssumptionFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncInputAssumptions(filter: $filter, limit: $limit, nextToken: $nextToken, lastSync: $lastSync) {
      items {
        id
        termValue
        timeWorkedPerDay
        dailyDigitalPercentage
        payrollPerEmployee
        revenuePerEmployee
        numberOfEmployees
        applicationUsages {
          nextToken
          startedAt
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        personaSettingsInputAssumptionsId
      }
      nextToken
      startedAt
    }
  }
`;
export const getApplicationUsage = /* GraphQL */ `
  query GetApplicationUsage($id: ID!) {
    getApplicationUsage(id: $id) {
      id
      target
      percent
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      inputAssumptionApplicationUsagesId
    }
  }
`;
export const listApplicationUsages = /* GraphQL */ `
  query ListApplicationUsages($filter: ModelApplicationUsageFilterInput, $limit: Int, $nextToken: String) {
    listApplicationUsages(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        target
        percent
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        inputAssumptionApplicationUsagesId
      }
      nextToken
      startedAt
    }
  }
`;
export const syncApplicationUsages = /* GraphQL */ `
  query SyncApplicationUsages(
    $filter: ModelApplicationUsageFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncApplicationUsages(filter: $filter, limit: $limit, nextToken: $nextToken, lastSync: $lastSync) {
      items {
        id
        target
        percent
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        inputAssumptionApplicationUsagesId
      }
      nextToken
      startedAt
    }
  }
`;
export const usageByTarget = /* GraphQL */ `
  query UsageByTarget(
    $target: String!
    $sortDirection: ModelSortDirection
    $filter: ModelApplicationUsageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    usageByTarget(
      target: $target
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        target
        percent
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        inputAssumptionApplicationUsagesId
      }
      nextToken
      startedAt
    }
  }
`;
export const getPartner = /* GraphQL */ `
  query GetPartner($id: ID!) {
    getPartner(id: $id) {
      id
      partnerId
      partnerName
      organisations {
        items {
          id
          organisationId
          organisationName
          personaSettings
          status
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          partnerOrganisationsId
        }
        nextToken
        startedAt
      }
      status
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const listPartners = /* GraphQL */ `
  query ListPartners($filter: ModelPartnerFilterInput, $limit: Int, $nextToken: String) {
    listPartners(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        partnerId
        partnerName
        organisations {
          nextToken
          startedAt
        }
        status
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const syncPartners = /* GraphQL */ `
  query SyncPartners($filter: ModelPartnerFilterInput, $limit: Int, $nextToken: String, $lastSync: AWSTimestamp) {
    syncPartners(filter: $filter, limit: $limit, nextToken: $nextToken, lastSync: $lastSync) {
      items {
        id
        partnerId
        partnerName
        organisations {
          nextToken
          startedAt
        }
        status
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const partnerByPartnerId = /* GraphQL */ `
  query PartnerByPartnerId(
    $partnerId: String!
    $sortDirection: ModelSortDirection
    $filter: ModelPartnerFilterInput
    $limit: Int
    $nextToken: String
  ) {
    partnerByPartnerId(
      partnerId: $partnerId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        partnerId
        partnerName
        organisations {
          nextToken
          startedAt
        }
        status
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const getOrganisation = /* GraphQL */ `
  query GetOrganisation($id: ID!) {
    getOrganisation(id: $id) {
      id
      organisationId
      organisationName
      partner {
        id
        partnerId
        partnerName
        organisations {
          nextToken
          startedAt
        }
        status
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      personaSettings
      status
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      partnerOrganisationsId
    }
  }
`;
export const listOrganisations = /* GraphQL */ `
  query ListOrganisations($filter: ModelOrganisationFilterInput, $limit: Int, $nextToken: String) {
    listOrganisations(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        organisationId
        organisationName
        partner {
          id
          partnerId
          partnerName
          status
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        personaSettings
        status
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        partnerOrganisationsId
      }
      nextToken
      startedAt
    }
  }
`;
export const syncOrganisations = /* GraphQL */ `
  query SyncOrganisations(
    $filter: ModelOrganisationFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncOrganisations(filter: $filter, limit: $limit, nextToken: $nextToken, lastSync: $lastSync) {
      items {
        id
        organisationId
        organisationName
        partner {
          id
          partnerId
          partnerName
          status
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        personaSettings
        status
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        partnerOrganisationsId
      }
      nextToken
      startedAt
    }
  }
`;
export const organisationByOrganisationId = /* GraphQL */ `
  query OrganisationByOrganisationId(
    $organisationId: String!
    $sortDirection: ModelSortDirection
    $filter: ModelOrganisationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    organisationByOrganisationId(
      organisationId: $organisationId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        organisationId
        organisationName
        partner {
          id
          partnerId
          partnerName
          status
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        personaSettings
        status
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        partnerOrganisationsId
      }
      nextToken
      startedAt
    }
  }
`;
export const getContextMap = /* GraphQL */ `
  query GetContextMap($id: ID!) {
    getContextMap(id: $id) {
      id
      context
      identityProvider
      defaultContext
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const listContextMaps = /* GraphQL */ `
  query ListContextMaps($filter: ModelContextMapFilterInput, $limit: Int, $nextToken: String) {
    listContextMaps(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        context
        identityProvider
        defaultContext
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const syncContextMaps = /* GraphQL */ `
  query SyncContextMaps($filter: ModelContextMapFilterInput, $limit: Int, $nextToken: String, $lastSync: AWSTimestamp) {
    syncContextMaps(filter: $filter, limit: $limit, nextToken: $nextToken, lastSync: $lastSync) {
      items {
        id
        context
        identityProvider
        defaultContext
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const contextByIdentityProvider = /* GraphQL */ `
  query ContextByIdentityProvider(
    $identityProvider: String!
    $sortDirection: ModelSortDirection
    $filter: ModelContextMapFilterInput
    $limit: Int
    $nextToken: String
  ) {
    contextByIdentityProvider(
      identityProvider: $identityProvider
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        context
        identityProvider
        defaultContext
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const getReport = /* GraphQL */ `
  query GetReport($id: ID!) {
    getReport(id: $id) {
      id
      context
      reportDate
      reportName
      accessLevel
      s3Key
      projects {
        items {
          id
          context
          projectId
          projectDate
          projectName
          projectType
          projectStatus
          projectBody
          timeLost
          hxScore
          payroll
          employeeCount
          report
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          reportProjectsId
        }
        nextToken
        startedAt
      }
      insights {
        items {
          id
          name
          insightDate
          s3Key
          context
          fileName
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          reportInsightsId
        }
        nextToken
        startedAt
      }
      projectIds
      insightIds
      customProjects
      reportStatus
      dus {
        items {
          id
          name
          context
          hxScore
          persona
          timeLost
          payroll
          revenue
          locationType
          hybridPercent
          applications
          reportId
          office
          country
          officeHx
          remoteHx
          locations
          analytics
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          reportDusId
        }
        nextToken
        startedAt
      }
      reportData
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const listReports = /* GraphQL */ `
  query ListReports($filter: ModelReportFilterInput, $limit: Int, $nextToken: String) {
    listReports(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        context
        reportDate
        reportName
        accessLevel
        s3Key
        projects {
          nextToken
          startedAt
        }
        insights {
          nextToken
          startedAt
        }
        projectIds
        insightIds
        customProjects
        reportStatus
        dus {
          nextToken
          startedAt
        }
        reportData
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const syncReports = /* GraphQL */ `
  query SyncReports($filter: ModelReportFilterInput, $limit: Int, $nextToken: String, $lastSync: AWSTimestamp) {
    syncReports(filter: $filter, limit: $limit, nextToken: $nextToken, lastSync: $lastSync) {
      items {
        id
        context
        reportDate
        reportName
        accessLevel
        s3Key
        projects {
          nextToken
          startedAt
        }
        insights {
          nextToken
          startedAt
        }
        projectIds
        insightIds
        customProjects
        reportStatus
        dus {
          nextToken
          startedAt
        }
        reportData
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const reportByContext = /* GraphQL */ `
  query ReportByContext(
    $context: String!
    $sortDirection: ModelSortDirection
    $filter: ModelReportFilterInput
    $limit: Int
    $nextToken: String
  ) {
    reportByContext(
      context: $context
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        context
        reportDate
        reportName
        accessLevel
        s3Key
        projects {
          nextToken
          startedAt
        }
        insights {
          nextToken
          startedAt
        }
        projectIds
        insightIds
        customProjects
        reportStatus
        dus {
          nextToken
          startedAt
        }
        reportData
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const reportByReportDate = /* GraphQL */ `
  query ReportByReportDate(
    $reportDate: AWSDate!
    $sortDirection: ModelSortDirection
    $filter: ModelReportFilterInput
    $limit: Int
    $nextToken: String
  ) {
    reportByReportDate(
      reportDate: $reportDate
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        context
        reportDate
        reportName
        accessLevel
        s3Key
        projects {
          nextToken
          startedAt
        }
        insights {
          nextToken
          startedAt
        }
        projectIds
        insightIds
        customProjects
        reportStatus
        dus {
          nextToken
          startedAt
        }
        reportData
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const getProjectTemplate = /* GraphQL */ `
  query GetProjectTemplate($id: ID!) {
    getProjectTemplate(id: $id) {
      id
      context
      templateId
      name
      type
      body
      status
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const listProjectTemplates = /* GraphQL */ `
  query ListProjectTemplates($filter: ModelProjectTemplateFilterInput, $limit: Int, $nextToken: String) {
    listProjectTemplates(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        context
        templateId
        name
        type
        body
        status
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const syncProjectTemplates = /* GraphQL */ `
  query SyncProjectTemplates(
    $filter: ModelProjectTemplateFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncProjectTemplates(filter: $filter, limit: $limit, nextToken: $nextToken, lastSync: $lastSync) {
      items {
        id
        context
        templateId
        name
        type
        body
        status
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const projectTemplateByContext = /* GraphQL */ `
  query ProjectTemplateByContext(
    $context: String!
    $sortDirection: ModelSortDirection
    $filter: ModelProjectTemplateFilterInput
    $limit: Int
    $nextToken: String
  ) {
    projectTemplateByContext(
      context: $context
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        context
        templateId
        name
        type
        body
        status
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const projectTemplateByTemplateId = /* GraphQL */ `
  query ProjectTemplateByTemplateId(
    $templateId: String!
    $sortDirection: ModelSortDirection
    $filter: ModelProjectTemplateFilterInput
    $limit: Int
    $nextToken: String
  ) {
    projectTemplateByTemplateId(
      templateId: $templateId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        context
        templateId
        name
        type
        body
        status
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const getProject = /* GraphQL */ `
  query GetProject($id: ID!) {
    getProject(id: $id) {
      id
      context
      projectId
      projectDate
      projectName
      projectType
      projectStatus
      projectBody
      timeLost
      hxScore
      payroll
      employeeCount
      report
      dus {
        items {
          id
          projectID
          dUID
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        nextToken
        startedAt
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      reportProjectsId
    }
  }
`;
export const listProjects = /* GraphQL */ `
  query ListProjects($filter: ModelProjectFilterInput, $limit: Int, $nextToken: String) {
    listProjects(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        context
        projectId
        projectDate
        projectName
        projectType
        projectStatus
        projectBody
        timeLost
        hxScore
        payroll
        employeeCount
        report
        dus {
          nextToken
          startedAt
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        reportProjectsId
      }
      nextToken
      startedAt
    }
  }
`;
export const syncProjects = /* GraphQL */ `
  query SyncProjects($filter: ModelProjectFilterInput, $limit: Int, $nextToken: String, $lastSync: AWSTimestamp) {
    syncProjects(filter: $filter, limit: $limit, nextToken: $nextToken, lastSync: $lastSync) {
      items {
        id
        context
        projectId
        projectDate
        projectName
        projectType
        projectStatus
        projectBody
        timeLost
        hxScore
        payroll
        employeeCount
        report
        dus {
          nextToken
          startedAt
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        reportProjectsId
      }
      nextToken
      startedAt
    }
  }
`;
export const projectByContext = /* GraphQL */ `
  query ProjectByContext(
    $context: String!
    $sortDirection: ModelSortDirection
    $filter: ModelProjectFilterInput
    $limit: Int
    $nextToken: String
  ) {
    projectByContext(
      context: $context
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        context
        projectId
        projectDate
        projectName
        projectType
        projectStatus
        projectBody
        timeLost
        hxScore
        payroll
        employeeCount
        report
        dus {
          nextToken
          startedAt
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        reportProjectsId
      }
      nextToken
      startedAt
    }
  }
`;
export const projectByProjectId = /* GraphQL */ `
  query ProjectByProjectId(
    $projectId: String!
    $sortDirection: ModelSortDirection
    $filter: ModelProjectFilterInput
    $limit: Int
    $nextToken: String
  ) {
    projectByProjectId(
      projectId: $projectId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        context
        projectId
        projectDate
        projectName
        projectType
        projectStatus
        projectBody
        timeLost
        hxScore
        payroll
        employeeCount
        report
        dus {
          nextToken
          startedAt
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        reportProjectsId
      }
      nextToken
      startedAt
    }
  }
`;
export const getProjectInsight = /* GraphQL */ `
  query GetProjectInsight($id: ID!) {
    getProjectInsight(id: $id) {
      id
      name
      insightDate
      s3Key
      context
      fileName
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      reportInsightsId
    }
  }
`;
export const listProjectInsights = /* GraphQL */ `
  query ListProjectInsights($filter: ModelProjectInsightFilterInput, $limit: Int, $nextToken: String) {
    listProjectInsights(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        insightDate
        s3Key
        context
        fileName
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        reportInsightsId
      }
      nextToken
      startedAt
    }
  }
`;
export const syncProjectInsights = /* GraphQL */ `
  query SyncProjectInsights(
    $filter: ModelProjectInsightFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncProjectInsights(filter: $filter, limit: $limit, nextToken: $nextToken, lastSync: $lastSync) {
      items {
        id
        name
        insightDate
        s3Key
        context
        fileName
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        reportInsightsId
      }
      nextToken
      startedAt
    }
  }
`;
export const projectInsightByContext = /* GraphQL */ `
  query ProjectInsightByContext(
    $context: String!
    $sortDirection: ModelSortDirection
    $filter: ModelProjectInsightFilterInput
    $limit: Int
    $nextToken: String
  ) {
    projectInsightByContext(
      context: $context
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        name
        insightDate
        s3Key
        context
        fileName
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        reportInsightsId
      }
      nextToken
      startedAt
    }
  }
`;
export const getDU = /* GraphQL */ `
  query GetDU($id: ID!) {
    getDU(id: $id) {
      id
      name
      context
      hxScore
      persona
      timeLost
      payroll
      revenue
      locationType
      hybridPercent
      applications
      projects {
        items {
          id
          projectID
          dUID
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        nextToken
        startedAt
      }
      reportId
      report {
        id
        context
        reportDate
        reportName
        accessLevel
        s3Key
        projects {
          nextToken
          startedAt
        }
        insights {
          nextToken
          startedAt
        }
        projectIds
        insightIds
        customProjects
        reportStatus
        dus {
          nextToken
          startedAt
        }
        reportData
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      office
      country
      officeHx
      remoteHx
      locations
      analytics
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      reportDusId
    }
  }
`;
export const listDUS = /* GraphQL */ `
  query ListDUS($filter: ModelDUFilterInput, $limit: Int, $nextToken: String) {
    listDUS(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        context
        hxScore
        persona
        timeLost
        payroll
        revenue
        locationType
        hybridPercent
        applications
        projects {
          nextToken
          startedAt
        }
        reportId
        report {
          id
          context
          reportDate
          reportName
          accessLevel
          s3Key
          projectIds
          insightIds
          customProjects
          reportStatus
          reportData
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        office
        country
        officeHx
        remoteHx
        locations
        analytics
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        reportDusId
      }
      nextToken
      startedAt
    }
  }
`;
export const syncDUS = /* GraphQL */ `
  query SyncDUS($filter: ModelDUFilterInput, $limit: Int, $nextToken: String, $lastSync: AWSTimestamp) {
    syncDUS(filter: $filter, limit: $limit, nextToken: $nextToken, lastSync: $lastSync) {
      items {
        id
        name
        context
        hxScore
        persona
        timeLost
        payroll
        revenue
        locationType
        hybridPercent
        applications
        projects {
          nextToken
          startedAt
        }
        reportId
        report {
          id
          context
          reportDate
          reportName
          accessLevel
          s3Key
          projectIds
          insightIds
          customProjects
          reportStatus
          reportData
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        office
        country
        officeHx
        remoteHx
        locations
        analytics
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        reportDusId
      }
      nextToken
      startedAt
    }
  }
`;
export const duByName = /* GraphQL */ `
  query DuByName(
    $name: String!
    $sortDirection: ModelSortDirection
    $filter: ModelDUFilterInput
    $limit: Int
    $nextToken: String
  ) {
    duByName(name: $name, sortDirection: $sortDirection, filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        context
        hxScore
        persona
        timeLost
        payroll
        revenue
        locationType
        hybridPercent
        applications
        projects {
          nextToken
          startedAt
        }
        reportId
        report {
          id
          context
          reportDate
          reportName
          accessLevel
          s3Key
          projectIds
          insightIds
          customProjects
          reportStatus
          reportData
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        office
        country
        officeHx
        remoteHx
        locations
        analytics
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        reportDusId
      }
      nextToken
      startedAt
    }
  }
`;
export const duByContext = /* GraphQL */ `
  query DuByContext(
    $context: String!
    $sortDirection: ModelSortDirection
    $filter: ModelDUFilterInput
    $limit: Int
    $nextToken: String
  ) {
    duByContext(
      context: $context
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        name
        context
        hxScore
        persona
        timeLost
        payroll
        revenue
        locationType
        hybridPercent
        applications
        projects {
          nextToken
          startedAt
        }
        reportId
        report {
          id
          context
          reportDate
          reportName
          accessLevel
          s3Key
          projectIds
          insightIds
          customProjects
          reportStatus
          reportData
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        office
        country
        officeHx
        remoteHx
        locations
        analytics
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        reportDusId
      }
      nextToken
      startedAt
    }
  }
`;
export const duByPersona = /* GraphQL */ `
  query DuByPersona(
    $persona: String!
    $sortDirection: ModelSortDirection
    $filter: ModelDUFilterInput
    $limit: Int
    $nextToken: String
  ) {
    duByPersona(
      persona: $persona
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        name
        context
        hxScore
        persona
        timeLost
        payroll
        revenue
        locationType
        hybridPercent
        applications
        projects {
          nextToken
          startedAt
        }
        reportId
        report {
          id
          context
          reportDate
          reportName
          accessLevel
          s3Key
          projectIds
          insightIds
          customProjects
          reportStatus
          reportData
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        office
        country
        officeHx
        remoteHx
        locations
        analytics
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        reportDusId
      }
      nextToken
      startedAt
    }
  }
`;
export const duByLocationType = /* GraphQL */ `
  query DuByLocationType(
    $locationType: LocationType!
    $sortDirection: ModelSortDirection
    $filter: ModelDUFilterInput
    $limit: Int
    $nextToken: String
  ) {
    duByLocationType(
      locationType: $locationType
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        name
        context
        hxScore
        persona
        timeLost
        payroll
        revenue
        locationType
        hybridPercent
        applications
        projects {
          nextToken
          startedAt
        }
        reportId
        report {
          id
          context
          reportDate
          reportName
          accessLevel
          s3Key
          projectIds
          insightIds
          customProjects
          reportStatus
          reportData
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        office
        country
        officeHx
        remoteHx
        locations
        analytics
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        reportDusId
      }
      nextToken
      startedAt
    }
  }
`;
export const duByReportId = /* GraphQL */ `
  query DuByReportId(
    $reportId: ID!
    $name: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelDUFilterInput
    $limit: Int
    $nextToken: String
  ) {
    duByReportId(
      reportId: $reportId
      name: $name
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        name
        context
        hxScore
        persona
        timeLost
        payroll
        revenue
        locationType
        hybridPercent
        applications
        projects {
          nextToken
          startedAt
        }
        reportId
        report {
          id
          context
          reportDate
          reportName
          accessLevel
          s3Key
          projectIds
          insightIds
          customProjects
          reportStatus
          reportData
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        office
        country
        officeHx
        remoteHx
        locations
        analytics
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        reportDusId
      }
      nextToken
      startedAt
    }
  }
`;
export const getParse = /* GraphQL */ `
  query GetParse($id: ID!) {
    getParse(id: $id) {
      id
      context
      inputAnalyticCsv
      inputProjectCsv
      previewS3
      levers
      startDateTime
      endDateTime
      status
      report {
        id
        context
        reportDate
        reportName
        accessLevel
        s3Key
        projects {
          nextToken
          startedAt
        }
        insights {
          nextToken
          startedAt
        }
        projectIds
        insightIds
        customProjects
        reportStatus
        dus {
          nextToken
          startedAt
        }
        reportData
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      warnings
      expectedDus
      processedDus
      personaSettings
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      parseReportId
    }
  }
`;
export const listParses = /* GraphQL */ `
  query ListParses($filter: ModelParseFilterInput, $limit: Int, $nextToken: String) {
    listParses(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        context
        inputAnalyticCsv
        inputProjectCsv
        previewS3
        levers
        startDateTime
        endDateTime
        status
        report {
          id
          context
          reportDate
          reportName
          accessLevel
          s3Key
          projectIds
          insightIds
          customProjects
          reportStatus
          reportData
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        warnings
        expectedDus
        processedDus
        personaSettings
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        parseReportId
      }
      nextToken
      startedAt
    }
  }
`;
export const syncParses = /* GraphQL */ `
  query SyncParses($filter: ModelParseFilterInput, $limit: Int, $nextToken: String, $lastSync: AWSTimestamp) {
    syncParses(filter: $filter, limit: $limit, nextToken: $nextToken, lastSync: $lastSync) {
      items {
        id
        context
        inputAnalyticCsv
        inputProjectCsv
        previewS3
        levers
        startDateTime
        endDateTime
        status
        report {
          id
          context
          reportDate
          reportName
          accessLevel
          s3Key
          projectIds
          insightIds
          customProjects
          reportStatus
          reportData
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        warnings
        expectedDus
        processedDus
        personaSettings
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        parseReportId
      }
      nextToken
      startedAt
    }
  }
`;
export const parseByContext = /* GraphQL */ `
  query ParseByContext(
    $context: String!
    $sortDirection: ModelSortDirection
    $filter: ModelParseFilterInput
    $limit: Int
    $nextToken: String
  ) {
    parseByContext(
      context: $context
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        context
        inputAnalyticCsv
        inputProjectCsv
        previewS3
        levers
        startDateTime
        endDateTime
        status
        report {
          id
          context
          reportDate
          reportName
          accessLevel
          s3Key
          projectIds
          insightIds
          customProjects
          reportStatus
          reportData
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        warnings
        expectedDus
        processedDus
        personaSettings
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        parseReportId
      }
      nextToken
      startedAt
    }
  }
`;
export const parseByStatus = /* GraphQL */ `
  query ParseByStatus(
    $status: ParseStatus!
    $sortDirection: ModelSortDirection
    $filter: ModelParseFilterInput
    $limit: Int
    $nextToken: String
  ) {
    parseByStatus(
      status: $status
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        context
        inputAnalyticCsv
        inputProjectCsv
        previewS3
        levers
        startDateTime
        endDateTime
        status
        report {
          id
          context
          reportDate
          reportName
          accessLevel
          s3Key
          projectIds
          insightIds
          customProjects
          reportStatus
          reportData
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        warnings
        expectedDus
        processedDus
        personaSettings
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        parseReportId
      }
      nextToken
      startedAt
    }
  }
`;
export const getProjectDus = /* GraphQL */ `
  query GetProjectDus($id: ID!) {
    getProjectDus(id: $id) {
      id
      projectID
      dUID
      project {
        id
        context
        projectId
        projectDate
        projectName
        projectType
        projectStatus
        projectBody
        timeLost
        hxScore
        payroll
        employeeCount
        report
        dus {
          nextToken
          startedAt
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        reportProjectsId
      }
      dU {
        id
        name
        context
        hxScore
        persona
        timeLost
        payroll
        revenue
        locationType
        hybridPercent
        applications
        projects {
          nextToken
          startedAt
        }
        reportId
        report {
          id
          context
          reportDate
          reportName
          accessLevel
          s3Key
          projectIds
          insightIds
          customProjects
          reportStatus
          reportData
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        office
        country
        officeHx
        remoteHx
        locations
        analytics
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        reportDusId
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const listProjectDuses = /* GraphQL */ `
  query ListProjectDuses($filter: ModelProjectDusFilterInput, $limit: Int, $nextToken: String) {
    listProjectDuses(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        projectID
        dUID
        project {
          id
          context
          projectId
          projectDate
          projectName
          projectType
          projectStatus
          projectBody
          timeLost
          hxScore
          payroll
          employeeCount
          report
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          reportProjectsId
        }
        dU {
          id
          name
          context
          hxScore
          persona
          timeLost
          payroll
          revenue
          locationType
          hybridPercent
          applications
          reportId
          office
          country
          officeHx
          remoteHx
          locations
          analytics
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          reportDusId
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const syncProjectDuses = /* GraphQL */ `
  query SyncProjectDuses(
    $filter: ModelProjectDusFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncProjectDuses(filter: $filter, limit: $limit, nextToken: $nextToken, lastSync: $lastSync) {
      items {
        id
        projectID
        dUID
        project {
          id
          context
          projectId
          projectDate
          projectName
          projectType
          projectStatus
          projectBody
          timeLost
          hxScore
          payroll
          employeeCount
          report
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          reportProjectsId
        }
        dU {
          id
          name
          context
          hxScore
          persona
          timeLost
          payroll
          revenue
          locationType
          hybridPercent
          applications
          reportId
          office
          country
          officeHx
          remoteHx
          locations
          analytics
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          reportDusId
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
