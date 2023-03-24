/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createPersonaSettings = /* GraphQL */ `
  mutation CreatePersonaSettings($input: CreatePersonaSettingsInput!, $condition: ModelPersonaSettingsConditionInput) {
    createPersonaSettings(input: $input, condition: $condition) {
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
export const updatePersonaSettings = /* GraphQL */ `
  mutation UpdatePersonaSettings($input: UpdatePersonaSettingsInput!, $condition: ModelPersonaSettingsConditionInput) {
    updatePersonaSettings(input: $input, condition: $condition) {
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
export const deletePersonaSettings = /* GraphQL */ `
  mutation DeletePersonaSettings($input: DeletePersonaSettingsInput!, $condition: ModelPersonaSettingsConditionInput) {
    deletePersonaSettings(input: $input, condition: $condition) {
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
export const createInputAssumption = /* GraphQL */ `
  mutation CreateInputAssumption($input: CreateInputAssumptionInput!, $condition: ModelInputAssumptionConditionInput) {
    createInputAssumption(input: $input, condition: $condition) {
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
export const updateInputAssumption = /* GraphQL */ `
  mutation UpdateInputAssumption($input: UpdateInputAssumptionInput!, $condition: ModelInputAssumptionConditionInput) {
    updateInputAssumption(input: $input, condition: $condition) {
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
export const deleteInputAssumption = /* GraphQL */ `
  mutation DeleteInputAssumption($input: DeleteInputAssumptionInput!, $condition: ModelInputAssumptionConditionInput) {
    deleteInputAssumption(input: $input, condition: $condition) {
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
export const createApplicationUsage = /* GraphQL */ `
  mutation CreateApplicationUsage(
    $input: CreateApplicationUsageInput!
    $condition: ModelApplicationUsageConditionInput
  ) {
    createApplicationUsage(input: $input, condition: $condition) {
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
export const updateApplicationUsage = /* GraphQL */ `
  mutation UpdateApplicationUsage(
    $input: UpdateApplicationUsageInput!
    $condition: ModelApplicationUsageConditionInput
  ) {
    updateApplicationUsage(input: $input, condition: $condition) {
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
export const deleteApplicationUsage = /* GraphQL */ `
  mutation DeleteApplicationUsage(
    $input: DeleteApplicationUsageInput!
    $condition: ModelApplicationUsageConditionInput
  ) {
    deleteApplicationUsage(input: $input, condition: $condition) {
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
export const createPartner = /* GraphQL */ `
  mutation CreatePartner($input: CreatePartnerInput!, $condition: ModelPartnerConditionInput) {
    createPartner(input: $input, condition: $condition) {
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
export const updatePartner = /* GraphQL */ `
  mutation UpdatePartner($input: UpdatePartnerInput!, $condition: ModelPartnerConditionInput) {
    updatePartner(input: $input, condition: $condition) {
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
export const deletePartner = /* GraphQL */ `
  mutation DeletePartner($input: DeletePartnerInput!, $condition: ModelPartnerConditionInput) {
    deletePartner(input: $input, condition: $condition) {
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
export const createOrganisation = /* GraphQL */ `
  mutation CreateOrganisation($input: CreateOrganisationInput!, $condition: ModelOrganisationConditionInput) {
    createOrganisation(input: $input, condition: $condition) {
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
export const updateOrganisation = /* GraphQL */ `
  mutation UpdateOrganisation($input: UpdateOrganisationInput!, $condition: ModelOrganisationConditionInput) {
    updateOrganisation(input: $input, condition: $condition) {
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
export const deleteOrganisation = /* GraphQL */ `
  mutation DeleteOrganisation($input: DeleteOrganisationInput!, $condition: ModelOrganisationConditionInput) {
    deleteOrganisation(input: $input, condition: $condition) {
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
export const createContextMap = /* GraphQL */ `
  mutation CreateContextMap($input: CreateContextMapInput!, $condition: ModelContextMapConditionInput) {
    createContextMap(input: $input, condition: $condition) {
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
export const updateContextMap = /* GraphQL */ `
  mutation UpdateContextMap($input: UpdateContextMapInput!, $condition: ModelContextMapConditionInput) {
    updateContextMap(input: $input, condition: $condition) {
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
export const deleteContextMap = /* GraphQL */ `
  mutation DeleteContextMap($input: DeleteContextMapInput!, $condition: ModelContextMapConditionInput) {
    deleteContextMap(input: $input, condition: $condition) {
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
export const createReport = /* GraphQL */ `
  mutation CreateReport($input: CreateReportInput!, $condition: ModelReportConditionInput) {
    createReport(input: $input, condition: $condition) {
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
export const updateReport = /* GraphQL */ `
  mutation UpdateReport($input: UpdateReportInput!, $condition: ModelReportConditionInput) {
    updateReport(input: $input, condition: $condition) {
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
export const deleteReport = /* GraphQL */ `
  mutation DeleteReport($input: DeleteReportInput!, $condition: ModelReportConditionInput) {
    deleteReport(input: $input, condition: $condition) {
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
export const createProjectTemplate = /* GraphQL */ `
  mutation CreateProjectTemplate($input: CreateProjectTemplateInput!, $condition: ModelProjectTemplateConditionInput) {
    createProjectTemplate(input: $input, condition: $condition) {
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
export const updateProjectTemplate = /* GraphQL */ `
  mutation UpdateProjectTemplate($input: UpdateProjectTemplateInput!, $condition: ModelProjectTemplateConditionInput) {
    updateProjectTemplate(input: $input, condition: $condition) {
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
export const deleteProjectTemplate = /* GraphQL */ `
  mutation DeleteProjectTemplate($input: DeleteProjectTemplateInput!, $condition: ModelProjectTemplateConditionInput) {
    deleteProjectTemplate(input: $input, condition: $condition) {
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
export const createProject = /* GraphQL */ `
  mutation CreateProject($input: CreateProjectInput!, $condition: ModelProjectConditionInput) {
    createProject(input: $input, condition: $condition) {
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
export const updateProject = /* GraphQL */ `
  mutation UpdateProject($input: UpdateProjectInput!, $condition: ModelProjectConditionInput) {
    updateProject(input: $input, condition: $condition) {
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
export const deleteProject = /* GraphQL */ `
  mutation DeleteProject($input: DeleteProjectInput!, $condition: ModelProjectConditionInput) {
    deleteProject(input: $input, condition: $condition) {
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
export const createProjectInsight = /* GraphQL */ `
  mutation CreateProjectInsight($input: CreateProjectInsightInput!, $condition: ModelProjectInsightConditionInput) {
    createProjectInsight(input: $input, condition: $condition) {
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
export const updateProjectInsight = /* GraphQL */ `
  mutation UpdateProjectInsight($input: UpdateProjectInsightInput!, $condition: ModelProjectInsightConditionInput) {
    updateProjectInsight(input: $input, condition: $condition) {
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
export const deleteProjectInsight = /* GraphQL */ `
  mutation DeleteProjectInsight($input: DeleteProjectInsightInput!, $condition: ModelProjectInsightConditionInput) {
    deleteProjectInsight(input: $input, condition: $condition) {
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
export const createDU = /* GraphQL */ `
  mutation CreateDU($input: CreateDUInput!, $condition: ModelDUConditionInput) {
    createDU(input: $input, condition: $condition) {
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
export const updateDU = /* GraphQL */ `
  mutation UpdateDU($input: UpdateDUInput!, $condition: ModelDUConditionInput) {
    updateDU(input: $input, condition: $condition) {
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
export const deleteDU = /* GraphQL */ `
  mutation DeleteDU($input: DeleteDUInput!, $condition: ModelDUConditionInput) {
    deleteDU(input: $input, condition: $condition) {
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
export const createParse = /* GraphQL */ `
  mutation CreateParse($input: CreateParseInput!, $condition: ModelParseConditionInput) {
    createParse(input: $input, condition: $condition) {
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
export const updateParse = /* GraphQL */ `
  mutation UpdateParse($input: UpdateParseInput!, $condition: ModelParseConditionInput) {
    updateParse(input: $input, condition: $condition) {
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
export const deleteParse = /* GraphQL */ `
  mutation DeleteParse($input: DeleteParseInput!, $condition: ModelParseConditionInput) {
    deleteParse(input: $input, condition: $condition) {
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
export const createProjectDus = /* GraphQL */ `
  mutation CreateProjectDus($input: CreateProjectDusInput!, $condition: ModelProjectDusConditionInput) {
    createProjectDus(input: $input, condition: $condition) {
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
export const updateProjectDus = /* GraphQL */ `
  mutation UpdateProjectDus($input: UpdateProjectDusInput!, $condition: ModelProjectDusConditionInput) {
    updateProjectDus(input: $input, condition: $condition) {
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
export const deleteProjectDus = /* GraphQL */ `
  mutation DeleteProjectDus($input: DeleteProjectDusInput!, $condition: ModelProjectDusConditionInput) {
    deleteProjectDus(input: $input, condition: $condition) {
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
