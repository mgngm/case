/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreatePersonaSettings = /* GraphQL */ `
  subscription OnCreatePersonaSettings($filter: ModelSubscriptionPersonaSettingsFilterInput) {
    onCreatePersonaSettings(filter: $filter) {
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
export const onUpdatePersonaSettings = /* GraphQL */ `
  subscription OnUpdatePersonaSettings($filter: ModelSubscriptionPersonaSettingsFilterInput) {
    onUpdatePersonaSettings(filter: $filter) {
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
export const onDeletePersonaSettings = /* GraphQL */ `
  subscription OnDeletePersonaSettings($filter: ModelSubscriptionPersonaSettingsFilterInput) {
    onDeletePersonaSettings(filter: $filter) {
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
export const onCreateInputAssumption = /* GraphQL */ `
  subscription OnCreateInputAssumption($filter: ModelSubscriptionInputAssumptionFilterInput) {
    onCreateInputAssumption(filter: $filter) {
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
export const onUpdateInputAssumption = /* GraphQL */ `
  subscription OnUpdateInputAssumption($filter: ModelSubscriptionInputAssumptionFilterInput) {
    onUpdateInputAssumption(filter: $filter) {
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
export const onDeleteInputAssumption = /* GraphQL */ `
  subscription OnDeleteInputAssumption($filter: ModelSubscriptionInputAssumptionFilterInput) {
    onDeleteInputAssumption(filter: $filter) {
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
export const onCreateApplicationUsage = /* GraphQL */ `
  subscription OnCreateApplicationUsage($filter: ModelSubscriptionApplicationUsageFilterInput) {
    onCreateApplicationUsage(filter: $filter) {
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
export const onUpdateApplicationUsage = /* GraphQL */ `
  subscription OnUpdateApplicationUsage($filter: ModelSubscriptionApplicationUsageFilterInput) {
    onUpdateApplicationUsage(filter: $filter) {
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
export const onDeleteApplicationUsage = /* GraphQL */ `
  subscription OnDeleteApplicationUsage($filter: ModelSubscriptionApplicationUsageFilterInput) {
    onDeleteApplicationUsage(filter: $filter) {
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
export const onCreatePartner = /* GraphQL */ `
  subscription OnCreatePartner($filter: ModelSubscriptionPartnerFilterInput) {
    onCreatePartner(filter: $filter) {
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
export const onUpdatePartner = /* GraphQL */ `
  subscription OnUpdatePartner($filter: ModelSubscriptionPartnerFilterInput) {
    onUpdatePartner(filter: $filter) {
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
export const onDeletePartner = /* GraphQL */ `
  subscription OnDeletePartner($filter: ModelSubscriptionPartnerFilterInput) {
    onDeletePartner(filter: $filter) {
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
export const onCreateOrganisation = /* GraphQL */ `
  subscription OnCreateOrganisation($filter: ModelSubscriptionOrganisationFilterInput) {
    onCreateOrganisation(filter: $filter) {
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
export const onUpdateOrganisation = /* GraphQL */ `
  subscription OnUpdateOrganisation($filter: ModelSubscriptionOrganisationFilterInput) {
    onUpdateOrganisation(filter: $filter) {
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
export const onDeleteOrganisation = /* GraphQL */ `
  subscription OnDeleteOrganisation($filter: ModelSubscriptionOrganisationFilterInput) {
    onDeleteOrganisation(filter: $filter) {
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
export const onCreateContextMap = /* GraphQL */ `
  subscription OnCreateContextMap($filter: ModelSubscriptionContextMapFilterInput) {
    onCreateContextMap(filter: $filter) {
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
export const onUpdateContextMap = /* GraphQL */ `
  subscription OnUpdateContextMap($filter: ModelSubscriptionContextMapFilterInput) {
    onUpdateContextMap(filter: $filter) {
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
export const onDeleteContextMap = /* GraphQL */ `
  subscription OnDeleteContextMap($filter: ModelSubscriptionContextMapFilterInput) {
    onDeleteContextMap(filter: $filter) {
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
export const onCreateReport = /* GraphQL */ `
  subscription OnCreateReport($filter: ModelSubscriptionReportFilterInput) {
    onCreateReport(filter: $filter) {
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
export const onUpdateReport = /* GraphQL */ `
  subscription OnUpdateReport($filter: ModelSubscriptionReportFilterInput) {
    onUpdateReport(filter: $filter) {
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
export const onDeleteReport = /* GraphQL */ `
  subscription OnDeleteReport($filter: ModelSubscriptionReportFilterInput) {
    onDeleteReport(filter: $filter) {
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
export const onCreateProjectTemplate = /* GraphQL */ `
  subscription OnCreateProjectTemplate($filter: ModelSubscriptionProjectTemplateFilterInput) {
    onCreateProjectTemplate(filter: $filter) {
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
export const onUpdateProjectTemplate = /* GraphQL */ `
  subscription OnUpdateProjectTemplate($filter: ModelSubscriptionProjectTemplateFilterInput) {
    onUpdateProjectTemplate(filter: $filter) {
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
export const onDeleteProjectTemplate = /* GraphQL */ `
  subscription OnDeleteProjectTemplate($filter: ModelSubscriptionProjectTemplateFilterInput) {
    onDeleteProjectTemplate(filter: $filter) {
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
export const onCreateProject = /* GraphQL */ `
  subscription OnCreateProject($filter: ModelSubscriptionProjectFilterInput) {
    onCreateProject(filter: $filter) {
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
export const onUpdateProject = /* GraphQL */ `
  subscription OnUpdateProject($filter: ModelSubscriptionProjectFilterInput) {
    onUpdateProject(filter: $filter) {
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
export const onDeleteProject = /* GraphQL */ `
  subscription OnDeleteProject($filter: ModelSubscriptionProjectFilterInput) {
    onDeleteProject(filter: $filter) {
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
export const onCreateProjectInsight = /* GraphQL */ `
  subscription OnCreateProjectInsight($filter: ModelSubscriptionProjectInsightFilterInput) {
    onCreateProjectInsight(filter: $filter) {
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
export const onUpdateProjectInsight = /* GraphQL */ `
  subscription OnUpdateProjectInsight($filter: ModelSubscriptionProjectInsightFilterInput) {
    onUpdateProjectInsight(filter: $filter) {
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
export const onDeleteProjectInsight = /* GraphQL */ `
  subscription OnDeleteProjectInsight($filter: ModelSubscriptionProjectInsightFilterInput) {
    onDeleteProjectInsight(filter: $filter) {
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
export const onCreateDU = /* GraphQL */ `
  subscription OnCreateDU($filter: ModelSubscriptionDUFilterInput) {
    onCreateDU(filter: $filter) {
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
export const onUpdateDU = /* GraphQL */ `
  subscription OnUpdateDU($filter: ModelSubscriptionDUFilterInput) {
    onUpdateDU(filter: $filter) {
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
export const onDeleteDU = /* GraphQL */ `
  subscription OnDeleteDU($filter: ModelSubscriptionDUFilterInput) {
    onDeleteDU(filter: $filter) {
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
export const onCreateParse = /* GraphQL */ `
  subscription OnCreateParse($filter: ModelSubscriptionParseFilterInput) {
    onCreateParse(filter: $filter) {
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
export const onUpdateParse = /* GraphQL */ `
  subscription OnUpdateParse($filter: ModelSubscriptionParseFilterInput) {
    onUpdateParse(filter: $filter) {
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
export const onDeleteParse = /* GraphQL */ `
  subscription OnDeleteParse($filter: ModelSubscriptionParseFilterInput) {
    onDeleteParse(filter: $filter) {
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
export const onCreateProjectDus = /* GraphQL */ `
  subscription OnCreateProjectDus($filter: ModelSubscriptionProjectDusFilterInput) {
    onCreateProjectDus(filter: $filter) {
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
export const onUpdateProjectDus = /* GraphQL */ `
  subscription OnUpdateProjectDus($filter: ModelSubscriptionProjectDusFilterInput) {
    onUpdateProjectDus(filter: $filter) {
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
export const onDeleteProjectDus = /* GraphQL */ `
  subscription OnDeleteProjectDus($filter: ModelSubscriptionProjectDusFilterInput) {
    onDeleteProjectDus(filter: $filter) {
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
