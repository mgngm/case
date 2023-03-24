// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const ProjectStatus = {
  NOT_STARTED: 'NOT_STARTED',
  ON_HOLD: 'ON_HOLD',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  ARCHIVED: 'ARCHIVED',
};

const ProjectType = {
  APPLICATION: 'APPLICATION',
  NETWORK_REMOTE: 'NETWORK_REMOTE',
  NETWORK_OFFICE: 'NETWORK_OFFICE',
  WIDER_NETWORK: 'WIDER_NETWORK',
};

const AccessLevel = {
  GLOBAL: 'GLOBAL',
  PARTNER: 'PARTNER',
  ORGANISATION: 'ORGANISATION',
};

const ReportStatus = {
  UPLOADING: 'UPLOADING',
  PROCESSING: 'PROCESSING',
  PREVIEW: 'PREVIEW',
  PUBLISHED: 'PUBLISHED',
  FOR_DELETION: 'FOR_DELETION',
};

const ContextStatus = {
  CREATED: 'CREATED',
  FOR_DELETION: 'FOR_DELETION',
};

const LocationType = {
  OFFICE: 'OFFICE',
  HYBRID: 'HYBRID',
  REMOTE: 'REMOTE',
};

const ParseStatus = {
  UPLOADING: 'UPLOADING',
  IN_PROGRESS: 'IN_PROGRESS',
  ERROR: 'ERROR',
  SUCCESS: 'SUCCESS',
};

const {
  PersonaSettings,
  InputAssumption,
  ApplicationUsage,
  Partner,
  Organisation,
  ContextMap,
  Report,
  ProjectTemplate,
  Project,
  ProjectInsight,
  DU,
  Parse,
  ProjectDus,
} = initSchema(schema);

export {
  PersonaSettings,
  InputAssumption,
  ApplicationUsage,
  Partner,
  Organisation,
  ContextMap,
  Report,
  ProjectTemplate,
  Project,
  ProjectInsight,
  DU,
  Parse,
  ProjectDus,
  ProjectStatus,
  ProjectType,
  AccessLevel,
  ReportStatus,
  ContextStatus,
  LocationType,
  ParseStatus,
};
