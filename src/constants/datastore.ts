import cloudformation from 'amplify/#current-cloud-backend/awscloudformation/build/root-cloudformation-stack.json' assert { type: 'json' };
import meta from 'amplify/backend/amplify-meta.json' assert { type: 'json' };

// extract env-specific info from amplify meta files
const apiId = meta.api.tesseract.output.GraphQLAPIIdOutput;
const env = cloudformation.Resources.apitesseract.Properties.Parameters.env;

//delete types
export const S3 = 'S3';
export const COGNITO_GROUP = 'CognitoGroup';
export const COGNITO_USER = 'CognitoUser';

// table types
export const PERSONA_SETTINGS = 'PersonaSettings';
export const INPUT_ASSUMPTION = 'InputAssumption';
export const APPLICATION_USAGE = 'ApplicationUsage';
export const PARTNER = 'Partner';
export const ORGANISATION = 'Organisation';
export const CONTEXT_MAP = 'ContextMap';
export const REPORT = 'Report';
export const PROJECT_TEMPLATE = 'ProjectTemplate';
export const PROJECT = 'Project';
export const PROJECT_INSIGHT = 'ProjectInsight';
export const DU = 'DU';
export const PARSE = 'Parse';
export const PROJECT_DUS = 'ProjectDus';

// full table names
export const PERSONA_SETTINGS_TABLE = `${PERSONA_SETTINGS}-${apiId}-${env}`;
export const INPUT_ASSUMPTION_TABLE = `${INPUT_ASSUMPTION}-${apiId}-${env}`;
export const APPLICATION_USAGE_TABLE = `${APPLICATION_USAGE}-${apiId}-${env}`;
export const PARTNER_TABLE = `${PARTNER}-${apiId}-${env}`;
export const ORGANISATION_TABLE = `${ORGANISATION}-${apiId}-${env}`;
export const CONTEXT_MAP_TABLE = `${CONTEXT_MAP}-${apiId}-${env}`;
export const REPORT_TABLE = `${REPORT}-${apiId}-${env}`;
export const PROJECT_TEMPLATE_TABLE = `${PROJECT_TEMPLATE}-${apiId}-${env}`;
export const PROJECT_TABLE = `${PROJECT}-${apiId}-${env}`;
export const PROJECT_INSIGHT_TABLE = `${PROJECT_INSIGHT}-${apiId}-${env}`;
export const DU_TABLE = `${DU}-${apiId}-${env}`;
export const PARSE_TABLE = `${PARSE}-${apiId}-${env}`;
export const PROJECT_DUS_TABLE = `${PROJECT_DUS}-${apiId}-${env}`;
