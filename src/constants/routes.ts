export const HOME_ROUTE = '/';
export const EMPLOYEES_ROUTE = '/employees';
export const HYBRID_ROUTE = '/hybrid';
export const LOGIN_ROUTE = '/login';
export const LOGOUT_ROUTE = '/logout';
export const SQS_MESSAGE_API_ROUTE = '/api/queue';

//admin routes
export const ADMIN_ROUTE = '/admin';
export const ADMIN_PREVIEW_ROUTE = '/admin/preview';
export const ADMIN_REPORTS_ROUTE = '/admin/reports';
export const ADMIN_INSIGHTS_ROUTE = '/admin/insights';
export const ADMIN_PROJECTS_ROUTE = '/admin/projects';
export const ADMIN_USERS_ROUTE = '/admin/users';
export const ADMIN_PARTNERS_ORGS_ROUTE = '/admin/contexts';

// project routes
export const PROJECTS_ROUTE = '/improvements';
export const PROJECTS_SUMMARY_ROUTE = '/improvements/summary';
export const PROJECTS_PROJECT_ROUTE = '/improvements/projects';
export const PROJECTS_INSIGHTS_ROUTE = '/improvements/insights';

//Routes that we don't want to check auth state & redirect on.
export const UNAUTH_ROUTES = [LOGIN_ROUTE, LOGOUT_ROUTE];
