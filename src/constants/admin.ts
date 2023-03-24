import { ADMIN_PARTNERS_ORGS_ROUTE, ADMIN_PREVIEW_ROUTE, ADMIN_USERS_ROUTE } from 'src/constants/routes';
import { AccessLevel } from 'src/graphql';

export const REPORT_TAB = 'report';
export const USERS_TAB = 'users';
export const CONTEXT_TAB = 'context';
export const INSIGHTS_TAB = 'insights';
export const PROJECT_TEMPLATES_TAB = 'projectTemplates';

export const ADMIN_TABS = [REPORT_TAB, PROJECT_TEMPLATES_TAB, INSIGHTS_TAB, USERS_TAB, CONTEXT_TAB];
export const DISABLED_CONTEXT_SWITCH_ROUTES = [ADMIN_PREVIEW_ROUTE, ADMIN_USERS_ROUTE, ADMIN_PARTNERS_ORGS_ROUTE];
//DONT CHANGE AS ITS SET UP LIKE THIS IN COGNITO I SWEAR.
export const TESSERACT_ADMIN_GROUP_NAME = 'tesseractAdmin';

export const REPORT_ACCESS_LEVELS_ORDERED_KEYS = [AccessLevel.GLOBAL, AccessLevel.PARTNER, AccessLevel.ORGANISATION];
export const PARTNER_LEVEL_REPORT_ACCESS_LEVELS_ORDERED_KEYS = [AccessLevel.PARTNER, AccessLevel.ORGANISATION];

export const REPORT_ACCESS_LEVELS = {
  [AccessLevel.GLOBAL]: 'Super User',
  [AccessLevel.ORGANISATION]: 'Unrestricted',
  [AccessLevel.PARTNER]: 'Restricted',
};

export const REPORT_ACCESS_LEVELS_INFO = {
  [AccessLevel.GLOBAL]: 'Only viewable to super users',
  [AccessLevel.ORGANISATION]: 'Viewable by anyone with access to the sytem',
  [AccessLevel.PARTNER]: 'Only viewable to partner level users',
};
