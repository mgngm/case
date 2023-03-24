export const schema = {
  models: {
    PersonaSettings: {
      name: 'PersonaSettings',
      fields: {
        id: {
          name: 'id',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        createdAt: {
          name: 'createdAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: true,
          attributes: [],
        },
        organisation: {
          name: 'organisation',
          isArray: false,
          type: 'String',
          isRequired: true,
          attributes: [],
        },
        termType: {
          name: 'termType',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: [],
        },
        term: {
          name: 'term',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: [],
        },
        inputAssumptions: {
          name: 'inputAssumptions',
          isArray: true,
          type: {
            model: 'InputAssumption',
          },
          isRequired: false,
          attributes: [],
          isArrayNullable: true,
          association: {
            connectionType: 'HAS_MANY',
            associatedWith: 'personaSettingsInputAssumptionsId',
          },
        },
        updatedAt: {
          name: 'updatedAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
      },
      syncable: true,
      pluralName: 'PersonaSettings',
      attributes: [
        {
          type: 'model',
          properties: {},
        },
        {
          type: 'aws_cognito_user_pools',
          properties: {},
        },
        {
          type: 'auth',
          properties: {
            rules: [
              {
                allow: 'private',
                operations: ['create', 'update', 'delete', 'read'],
              },
            ],
          },
        },
      ],
    },
    InputAssumption: {
      name: 'InputAssumption',
      fields: {
        id: {
          name: 'id',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        termValue: {
          name: 'termValue',
          isArray: false,
          type: 'String',
          isRequired: true,
          attributes: [],
        },
        timeWorkedPerDay: {
          name: 'timeWorkedPerDay',
          isArray: false,
          type: 'Int',
          isRequired: false,
          attributes: [],
        },
        dailyDigitalPercentage: {
          name: 'dailyDigitalPercentage',
          isArray: false,
          type: 'Float',
          isRequired: false,
          attributes: [],
        },
        payrollPerEmployee: {
          name: 'payrollPerEmployee',
          isArray: false,
          type: 'Int',
          isRequired: false,
          attributes: [],
        },
        revenuePerEmployee: {
          name: 'revenuePerEmployee',
          isArray: false,
          type: 'Int',
          isRequired: false,
          attributes: [],
        },
        numberOfEmployees: {
          name: 'numberOfEmployees',
          isArray: false,
          type: 'Int',
          isRequired: false,
          attributes: [],
        },
        applicationUsages: {
          name: 'applicationUsages',
          isArray: true,
          type: {
            model: 'ApplicationUsage',
          },
          isRequired: false,
          attributes: [],
          isArrayNullable: true,
          association: {
            connectionType: 'HAS_MANY',
            associatedWith: 'inputAssumptionApplicationUsagesId',
          },
        },
        createdAt: {
          name: 'createdAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
        updatedAt: {
          name: 'updatedAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
        personaSettingsInputAssumptionsId: {
          name: 'personaSettingsInputAssumptionsId',
          isArray: false,
          type: 'ID',
          isRequired: false,
          attributes: [],
        },
      },
      syncable: true,
      pluralName: 'InputAssumptions',
      attributes: [
        {
          type: 'model',
          properties: {},
        },
        {
          type: 'aws_cognito_user_pools',
          properties: {},
        },
        {
          type: 'key',
          properties: {
            name: 'gsi-PersonaSettings.inputAssumptions',
            fields: ['personaSettingsInputAssumptionsId'],
          },
        },
        {
          type: 'auth',
          properties: {
            rules: [
              {
                allow: 'private',
                operations: ['create', 'update', 'delete', 'read'],
              },
            ],
          },
        },
      ],
    },
    ApplicationUsage: {
      name: 'ApplicationUsage',
      fields: {
        id: {
          name: 'id',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        target: {
          name: 'target',
          isArray: false,
          type: 'String',
          isRequired: true,
          attributes: [],
        },
        percent: {
          name: 'percent',
          isArray: false,
          type: 'Float',
          isRequired: true,
          attributes: [],
        },
        createdAt: {
          name: 'createdAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
        updatedAt: {
          name: 'updatedAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
        inputAssumptionApplicationUsagesId: {
          name: 'inputAssumptionApplicationUsagesId',
          isArray: false,
          type: 'ID',
          isRequired: false,
          attributes: [],
        },
      },
      syncable: true,
      pluralName: 'ApplicationUsages',
      attributes: [
        {
          type: 'model',
          properties: {},
        },
        {
          type: 'aws_cognito_user_pools',
          properties: {},
        },
        {
          type: 'key',
          properties: {
            name: 'byTarget',
            queryField: 'usageByTarget',
            fields: ['target'],
          },
        },
        {
          type: 'key',
          properties: {
            name: 'gsi-InputAssumption.applicationUsages',
            fields: ['inputAssumptionApplicationUsagesId'],
          },
        },
        {
          type: 'auth',
          properties: {
            rules: [
              {
                allow: 'private',
                operations: ['create', 'update', 'delete', 'read'],
              },
            ],
          },
        },
      ],
    },
    Partner: {
      name: 'Partner',
      fields: {
        id: {
          name: 'id',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        partnerId: {
          name: 'partnerId',
          isArray: false,
          type: 'String',
          isRequired: true,
          attributes: [],
        },
        partnerName: {
          name: 'partnerName',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: [],
        },
        organisations: {
          name: 'organisations',
          isArray: true,
          type: {
            model: 'Organisation',
          },
          isRequired: false,
          attributes: [],
          isArrayNullable: true,
          association: {
            connectionType: 'HAS_MANY',
            associatedWith: 'partnerOrganisationsId',
          },
        },
        status: {
          name: 'status',
          isArray: false,
          type: {
            enum: 'ContextStatus',
          },
          isRequired: false,
          attributes: [],
        },
        createdAt: {
          name: 'createdAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
        updatedAt: {
          name: 'updatedAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
      },
      syncable: true,
      pluralName: 'Partners',
      attributes: [
        {
          type: 'model',
          properties: {},
        },
        {
          type: 'aws_cognito_user_pools',
          properties: {},
        },
        {
          type: 'key',
          properties: {
            name: 'byPartnerId',
            queryField: 'partnerByPartnerId',
            fields: ['partnerId'],
          },
        },
        {
          type: 'auth',
          properties: {
            rules: [
              {
                allow: 'private',
                operations: ['create', 'update', 'delete', 'read'],
              },
            ],
          },
        },
      ],
    },
    Organisation: {
      name: 'Organisation',
      fields: {
        id: {
          name: 'id',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        organisationId: {
          name: 'organisationId',
          isArray: false,
          type: 'String',
          isRequired: true,
          attributes: [],
        },
        organisationName: {
          name: 'organisationName',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: [],
        },
        partner: {
          name: 'partner',
          isArray: false,
          type: {
            model: 'Partner',
          },
          isRequired: false,
          attributes: [],
          association: {
            connectionType: 'BELONGS_TO',
            targetName: 'partnerOrganisationsId',
          },
        },
        personaSettings: {
          name: 'personaSettings',
          isArray: false,
          type: 'AWSJSON',
          isRequired: false,
          attributes: [],
        },
        status: {
          name: 'status',
          isArray: false,
          type: {
            enum: 'ContextStatus',
          },
          isRequired: false,
          attributes: [],
        },
        createdAt: {
          name: 'createdAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
        updatedAt: {
          name: 'updatedAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
      },
      syncable: true,
      pluralName: 'Organisations',
      attributes: [
        {
          type: 'model',
          properties: {},
        },
        {
          type: 'aws_cognito_user_pools',
          properties: {},
        },
        {
          type: 'key',
          properties: {
            name: 'byOrganisationId',
            queryField: 'organisationByOrganisationId',
            fields: ['organisationId'],
          },
        },
        {
          type: 'auth',
          properties: {
            rules: [
              {
                allow: 'private',
                operations: ['create', 'update', 'delete', 'read'],
              },
            ],
          },
        },
      ],
    },
    ContextMap: {
      name: 'ContextMap',
      fields: {
        id: {
          name: 'id',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        context: {
          name: 'context',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: [],
        },
        identityProvider: {
          name: 'identityProvider',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: [],
        },
        defaultContext: {
          name: 'defaultContext',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: [],
        },
        createdAt: {
          name: 'createdAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
        updatedAt: {
          name: 'updatedAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
      },
      syncable: true,
      pluralName: 'ContextMaps',
      attributes: [
        {
          type: 'model',
          properties: {},
        },
        {
          type: 'aws_cognito_user_pools',
          properties: {},
        },
        {
          type: 'key',
          properties: {
            name: 'byIdentityProvider',
            queryField: 'contextByIdentityProvider',
            fields: ['identityProvider'],
          },
        },
        {
          type: 'auth',
          properties: {
            rules: [
              {
                allow: 'private',
                operations: ['create', 'update', 'delete', 'read'],
              },
            ],
          },
        },
      ],
    },
    Report: {
      name: 'Report',
      fields: {
        id: {
          name: 'id',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        context: {
          name: 'context',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: [],
        },
        reportDate: {
          name: 'reportDate',
          isArray: false,
          type: 'AWSDate',
          isRequired: false,
          attributes: [],
        },
        reportName: {
          name: 'reportName',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: [],
        },
        accessLevel: {
          name: 'accessLevel',
          isArray: false,
          type: {
            enum: 'AccessLevel',
          },
          isRequired: false,
          attributes: [],
        },
        s3Key: {
          name: 's3Key',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: [],
        },
        projects: {
          name: 'projects',
          isArray: true,
          type: {
            model: 'Project',
          },
          isRequired: false,
          attributes: [],
          isArrayNullable: true,
          association: {
            connectionType: 'HAS_MANY',
            associatedWith: 'reportProjectsId',
          },
        },
        insights: {
          name: 'insights',
          isArray: true,
          type: {
            model: 'ProjectInsight',
          },
          isRequired: false,
          attributes: [],
          isArrayNullable: true,
          association: {
            connectionType: 'HAS_MANY',
            associatedWith: 'reportInsightsId',
          },
        },
        projectIds: {
          name: 'projectIds',
          isArray: true,
          type: 'String',
          isRequired: false,
          attributes: [],
          isArrayNullable: true,
        },
        insightIds: {
          name: 'insightIds',
          isArray: true,
          type: 'String',
          isRequired: false,
          attributes: [],
          isArrayNullable: true,
        },
        customProjects: {
          name: 'customProjects',
          isArray: false,
          type: 'AWSJSON',
          isRequired: false,
          attributes: [],
        },
        reportStatus: {
          name: 'reportStatus',
          isArray: false,
          type: {
            enum: 'ReportStatus',
          },
          isRequired: false,
          attributes: [],
        },
        dus: {
          name: 'dus',
          isArray: true,
          type: {
            model: 'DU',
          },
          isRequired: false,
          attributes: [],
          isArrayNullable: true,
          association: {
            connectionType: 'HAS_MANY',
            associatedWith: 'reportDusId',
          },
        },
        reportData: {
          name: 'reportData',
          isArray: false,
          type: 'AWSJSON',
          isRequired: false,
          attributes: [],
        },
        createdAt: {
          name: 'createdAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
        updatedAt: {
          name: 'updatedAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
      },
      syncable: true,
      pluralName: 'Reports',
      attributes: [
        {
          type: 'model',
          properties: {},
        },
        {
          type: 'aws_cognito_user_pools',
          properties: {},
        },
        {
          type: 'key',
          properties: {
            name: 'byContext',
            queryField: 'reportByContext',
            fields: ['context'],
          },
        },
        {
          type: 'key',
          properties: {
            name: 'byReportDate',
            queryField: 'reportByReportDate',
            fields: ['reportDate'],
          },
        },
        {
          type: 'auth',
          properties: {
            rules: [
              {
                allow: 'private',
                operations: ['create', 'update', 'delete', 'read'],
              },
            ],
          },
        },
      ],
    },
    ProjectTemplate: {
      name: 'ProjectTemplate',
      fields: {
        id: {
          name: 'id',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        context: {
          name: 'context',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: [],
        },
        templateId: {
          name: 'templateId',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: [],
        },
        name: {
          name: 'name',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: [],
        },
        type: {
          name: 'type',
          isArray: false,
          type: {
            enum: 'ProjectType',
          },
          isRequired: false,
          attributes: [],
        },
        body: {
          name: 'body',
          isArray: false,
          type: 'AWSJSON',
          isRequired: false,
          attributes: [],
        },
        status: {
          name: 'status',
          isArray: false,
          type: {
            enum: 'ProjectStatus',
          },
          isRequired: false,
          attributes: [],
        },
        createdAt: {
          name: 'createdAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
        updatedAt: {
          name: 'updatedAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
      },
      syncable: true,
      pluralName: 'ProjectTemplates',
      attributes: [
        {
          type: 'model',
          properties: {},
        },
        {
          type: 'aws_cognito_user_pools',
          properties: {},
        },
        {
          type: 'key',
          properties: {
            name: 'byContext',
            queryField: 'projectTemplateByContext',
            fields: ['context'],
          },
        },
        {
          type: 'key',
          properties: {
            name: 'byTemplateId',
            queryField: 'projectTemplateByTemplateId',
            fields: ['templateId'],
          },
        },
        {
          type: 'auth',
          properties: {
            rules: [
              {
                allow: 'private',
                operations: ['create', 'update', 'delete', 'read'],
              },
            ],
          },
        },
      ],
    },
    Project: {
      name: 'Project',
      fields: {
        id: {
          name: 'id',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        context: {
          name: 'context',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: [],
        },
        projectId: {
          name: 'projectId',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: [],
        },
        projectDate: {
          name: 'projectDate',
          isArray: false,
          type: 'AWSDate',
          isRequired: false,
          attributes: [],
        },
        projectName: {
          name: 'projectName',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: [],
        },
        projectType: {
          name: 'projectType',
          isArray: false,
          type: {
            enum: 'ProjectType',
          },
          isRequired: false,
          attributes: [],
        },
        projectStatus: {
          name: 'projectStatus',
          isArray: false,
          type: {
            enum: 'ProjectStatus',
          },
          isRequired: false,
          attributes: [],
        },
        projectBody: {
          name: 'projectBody',
          isArray: false,
          type: 'AWSJSON',
          isRequired: false,
          attributes: [],
        },
        timeLost: {
          name: 'timeLost',
          isArray: false,
          type: 'Float',
          isRequired: false,
          attributes: [],
        },
        hxScore: {
          name: 'hxScore',
          isArray: false,
          type: 'Float',
          isRequired: false,
          attributes: [],
        },
        payroll: {
          name: 'payroll',
          isArray: false,
          type: 'Float',
          isRequired: false,
          attributes: [],
        },
        employeeCount: {
          name: 'employeeCount',
          isArray: false,
          type: 'Int',
          isRequired: false,
          attributes: [],
        },
        report: {
          name: 'report',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: [],
        },
        dus: {
          name: 'dus',
          isArray: true,
          type: {
            model: 'ProjectDus',
          },
          isRequired: false,
          attributes: [],
          isArrayNullable: true,
          association: {
            connectionType: 'HAS_MANY',
            associatedWith: 'project',
          },
        },
        createdAt: {
          name: 'createdAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
        updatedAt: {
          name: 'updatedAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
        reportProjectsId: {
          name: 'reportProjectsId',
          isArray: false,
          type: 'ID',
          isRequired: false,
          attributes: [],
        },
      },
      syncable: true,
      pluralName: 'Projects',
      attributes: [
        {
          type: 'model',
          properties: {},
        },
        {
          type: 'aws_cognito_user_pools',
          properties: {},
        },
        {
          type: 'key',
          properties: {
            name: 'byContext',
            queryField: 'projectByContext',
            fields: ['context'],
          },
        },
        {
          type: 'key',
          properties: {
            name: 'byProjectId',
            queryField: 'projectByProjectId',
            fields: ['projectId'],
          },
        },
        {
          type: 'key',
          properties: {
            name: 'gsi-Report.projects',
            fields: ['reportProjectsId'],
          },
        },
        {
          type: 'auth',
          properties: {
            rules: [
              {
                allow: 'private',
                operations: ['create', 'update', 'delete', 'read'],
              },
            ],
          },
        },
      ],
    },
    ProjectInsight: {
      name: 'ProjectInsight',
      fields: {
        id: {
          name: 'id',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        name: {
          name: 'name',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: [],
        },
        insightDate: {
          name: 'insightDate',
          isArray: false,
          type: 'AWSDate',
          isRequired: false,
          attributes: [],
        },
        s3Key: {
          name: 's3Key',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: [],
        },
        context: {
          name: 'context',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: [],
        },
        fileName: {
          name: 'fileName',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: [],
        },
        createdAt: {
          name: 'createdAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
        updatedAt: {
          name: 'updatedAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
        reportInsightsId: {
          name: 'reportInsightsId',
          isArray: false,
          type: 'ID',
          isRequired: false,
          attributes: [],
        },
      },
      syncable: true,
      pluralName: 'ProjectInsights',
      attributes: [
        {
          type: 'model',
          properties: {},
        },
        {
          type: 'aws_cognito_user_pools',
          properties: {},
        },
        {
          type: 'key',
          properties: {
            name: 'byContext',
            queryField: 'projectInsightByContext',
            fields: ['context'],
          },
        },
        {
          type: 'key',
          properties: {
            name: 'gsi-Report.insights',
            fields: ['reportInsightsId'],
          },
        },
        {
          type: 'auth',
          properties: {
            rules: [
              {
                allow: 'private',
                operations: ['create', 'update', 'delete', 'read'],
              },
            ],
          },
        },
      ],
    },
    DU: {
      name: 'DU',
      fields: {
        id: {
          name: 'id',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        name: {
          name: 'name',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: [],
        },
        context: {
          name: 'context',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: [],
        },
        hxScore: {
          name: 'hxScore',
          isArray: false,
          type: 'Float',
          isRequired: false,
          attributes: [],
        },
        persona: {
          name: 'persona',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: [],
        },
        timeLost: {
          name: 'timeLost',
          isArray: false,
          type: 'Float',
          isRequired: false,
          attributes: [],
        },
        payroll: {
          name: 'payroll',
          isArray: false,
          type: 'Float',
          isRequired: false,
          attributes: [],
        },
        revenue: {
          name: 'revenue',
          isArray: false,
          type: 'Float',
          isRequired: false,
          attributes: [],
        },
        locationType: {
          name: 'locationType',
          isArray: false,
          type: {
            enum: 'LocationType',
          },
          isRequired: false,
          attributes: [],
        },
        hybridPercent: {
          name: 'hybridPercent',
          isArray: false,
          type: 'Float',
          isRequired: false,
          attributes: [],
        },
        applications: {
          name: 'applications',
          isArray: true,
          type: 'String',
          isRequired: false,
          attributes: [],
          isArrayNullable: true,
        },
        projects: {
          name: 'projects',
          isArray: true,
          type: {
            model: 'ProjectDus',
          },
          isRequired: false,
          attributes: [],
          isArrayNullable: true,
          association: {
            connectionType: 'HAS_MANY',
            associatedWith: 'du',
          },
        },
        report: {
          name: 'report',
          isArray: false,
          type: {
            model: 'Report',
          },
          isRequired: false,
          attributes: [],
          association: {
            connectionType: 'BELONGS_TO',
            targetName: 'reportId',
          },
        },
        office: {
          name: 'office',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: [],
        },
        country: {
          name: 'country',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: [],
        },
        officeHx: {
          name: 'officeHx',
          isArray: false,
          type: 'Float',
          isRequired: false,
          attributes: [],
        },
        remoteHx: {
          name: 'remoteHx',
          isArray: false,
          type: 'Float',
          isRequired: false,
          attributes: [],
        },
        locations: {
          name: 'locations',
          isArray: false,
          type: 'AWSJSON',
          isRequired: false,
          attributes: [],
        },
        analytics: {
          name: 'analytics',
          isArray: false,
          type: 'AWSJSON',
          isRequired: false,
          attributes: [],
        },
        createdAt: {
          name: 'createdAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
        updatedAt: {
          name: 'updatedAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
        reportDusId: {
          name: 'reportDusId',
          isArray: false,
          type: 'ID',
          isRequired: false,
          attributes: [],
        },
      },
      syncable: true,
      pluralName: 'DUS',
      attributes: [
        {
          type: 'model',
          properties: {},
        },
        {
          type: 'aws_cognito_user_pools',
          properties: {},
        },
        {
          type: 'key',
          properties: {
            name: 'byName',
            queryField: 'duByName',
            fields: ['name'],
          },
        },
        {
          type: 'key',
          properties: {
            name: 'byContext',
            queryField: 'duByContext',
            fields: ['context'],
          },
        },
        {
          type: 'key',
          properties: {
            name: 'byPersona',
            queryField: 'duByPersona',
            fields: ['persona'],
          },
        },
        {
          type: 'key',
          properties: {
            name: 'byLocationType',
            queryField: 'duByLocationType',
            fields: ['locationType'],
          },
        },
        {
          type: 'key',
          properties: {
            name: 'byReport',
            queryField: 'duByReportId',
            fields: ['reportId', 'name'],
          },
        },
        {
          type: 'auth',
          properties: {
            rules: [
              {
                allow: 'private',
                operations: ['create', 'update', 'delete', 'read'],
              },
            ],
          },
        },
      ],
    },
    Parse: {
      name: 'Parse',
      fields: {
        id: {
          name: 'id',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        context: {
          name: 'context',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: [],
        },
        inputAnalyticCsv: {
          name: 'inputAnalyticCsv',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: [],
        },
        inputProjectCsv: {
          name: 'inputProjectCsv',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: [],
        },
        previewS3: {
          name: 'previewS3',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: [],
        },
        levers: {
          name: 'levers',
          isArray: false,
          type: 'AWSJSON',
          isRequired: false,
          attributes: [],
        },
        startDateTime: {
          name: 'startDateTime',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
        },
        endDateTime: {
          name: 'endDateTime',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
        },
        status: {
          name: 'status',
          isArray: false,
          type: {
            enum: 'ParseStatus',
          },
          isRequired: false,
          attributes: [],
        },
        report: {
          name: 'report',
          isArray: false,
          type: {
            model: 'Report',
          },
          isRequired: false,
          attributes: [],
          association: {
            connectionType: 'HAS_ONE',
            associatedWith: 'id',
            targetName: 'parseReportId',
          },
        },
        warnings: {
          name: 'warnings',
          isArray: true,
          type: 'String',
          isRequired: false,
          attributes: [],
          isArrayNullable: true,
        },
        expectedDus: {
          name: 'expectedDus',
          isArray: false,
          type: 'Int',
          isRequired: false,
          attributes: [],
        },
        processedDus: {
          name: 'processedDus',
          isArray: false,
          type: 'Int',
          isRequired: false,
          attributes: [],
        },
        personaSettings: {
          name: 'personaSettings',
          isArray: false,
          type: 'AWSJSON',
          isRequired: false,
          attributes: [],
        },
        createdAt: {
          name: 'createdAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
        updatedAt: {
          name: 'updatedAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
        parseReportId: {
          name: 'parseReportId',
          isArray: false,
          type: 'ID',
          isRequired: false,
          attributes: [],
        },
      },
      syncable: true,
      pluralName: 'Parses',
      attributes: [
        {
          type: 'model',
          properties: {},
        },
        {
          type: 'aws_cognito_user_pools',
          properties: {},
        },
        {
          type: 'key',
          properties: {
            name: 'byContext',
            queryField: 'parseByContext',
            fields: ['context'],
          },
        },
        {
          type: 'key',
          properties: {
            name: 'byStatus',
            queryField: 'parseByStatus',
            fields: ['status'],
          },
        },
        {
          type: 'auth',
          properties: {
            rules: [
              {
                allow: 'private',
                operations: ['create', 'update', 'delete', 'read'],
              },
            ],
          },
        },
      ],
    },
    ProjectDus: {
      name: 'ProjectDus',
      fields: {
        id: {
          name: 'id',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        project: {
          name: 'project',
          isArray: false,
          type: {
            model: 'Project',
          },
          isRequired: true,
          attributes: [],
          association: {
            connectionType: 'BELONGS_TO',
            targetName: 'projectID',
          },
        },
        du: {
          name: 'du',
          isArray: false,
          type: {
            model: 'DU',
          },
          isRequired: true,
          attributes: [],
          association: {
            connectionType: 'BELONGS_TO',
            targetName: 'duID',
          },
        },
        createdAt: {
          name: 'createdAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
        updatedAt: {
          name: 'updatedAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
      },
      syncable: true,
      pluralName: 'ProjectDuses',
      attributes: [
        {
          type: 'model',
          properties: {},
        },
        {
          type: 'key',
          properties: {
            name: 'byProject',
            fields: ['projectID'],
          },
        },
        {
          type: 'key',
          properties: {
            name: 'byDU',
            fields: ['duID'],
          },
        },
      ],
    },
  },
  enums: {
    ProjectStatus: {
      name: 'ProjectStatus',
      values: ['NOT_STARTED', 'ON_HOLD', 'IN_PROGRESS', 'COMPLETED', 'ARCHIVED'],
    },
    ProjectType: {
      name: 'ProjectType',
      values: ['APPLICATION', 'NETWORK_REMOTE', 'NETWORK_OFFICE', 'WIDER_NETWORK'],
    },
    AccessLevel: {
      name: 'AccessLevel',
      values: ['GLOBAL', 'PARTNER', 'ORGANISATION'],
    },
    ReportStatus: {
      name: 'ReportStatus',
      values: ['UPLOADING', 'PROCESSING', 'PREVIEW', 'PUBLISHED', 'FOR_DELETION'],
    },
    ContextStatus: {
      name: 'ContextStatus',
      values: ['CREATED', 'FOR_DELETION'],
    },
    LocationType: {
      name: 'LocationType',
      values: ['OFFICE', 'HYBRID', 'REMOTE'],
    },
    ParseStatus: {
      name: 'ParseStatus',
      values: ['UPLOADING', 'IN_PROGRESS', 'ERROR', 'SUCCESS'],
    },
  },
  nonModels: {},
  codegenVersion: '3.3.6',
  version: '8240b44bc809a5caccc7252a09a0db11',
};
