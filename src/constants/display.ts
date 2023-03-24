import { SupervisedUserCircle } from '@mui/icons-material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AssignmentIcon from '@mui/icons-material/Assignment';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import LogoutIcon from '@mui/icons-material/Logout';
import PreviewIcon from '@mui/icons-material/Preview';
import SettingsIcon from '@mui/icons-material/Settings';
import { WorstOfficesChartType } from 'lambda/parse/report/chart-data';
import type { NavItemProps } from 'src/components/header/nav-drawer'; // types don't have to worry about circular imports wee
import {
  ADMIN_PREVIEW_ROUTE,
  ADMIN_REPORTS_ROUTE,
  EMPLOYEES_ROUTE,
  HOME_ROUTE,
  HYBRID_ROUTE,
  LOGOUT_ROUTE,
  PROJECTS_INSIGHTS_ROUTE,
  PROJECTS_PROJECT_ROUTE,
  PROJECTS_SUMMARY_ROUTE,
} from 'src/constants/routes';
import { ProjectStatus, ProjectType } from 'src/models';

export const NAV_MENU_ITEMS: NavItemProps[] = [
  { label: 'Business Impact', Icon: AssessmentIcon, href: HOME_ROUTE, id: 'home-route-nav-link' },
  { label: 'Hybrid Working', Icon: HomeWorkIcon, href: HYBRID_ROUTE, id: 'hybrid-route-nav-link' },
  { label: 'Improvements', Icon: AssignmentIcon, href: PROJECTS_SUMMARY_ROUTE, id: 'improvements-route-nav-link' },
  {
    label: 'Your Employees',
    Icon: SupervisedUserCircle,
    href: EMPLOYEES_ROUTE,
    id: 'your-employees-route-nav-link',
  },
  {
    label: 'Admin',
    Icon: SettingsIcon,
    href: ADMIN_REPORTS_ROUTE,
    id: 'id-route-nav-link',
    subItems: [{ label: 'Preview', Icon: PreviewIcon, href: ADMIN_PREVIEW_ROUTE, id: 'preview-route-nav-link' }],
  },
  {
    label: 'Logout',
    Icon: LogoutIcon,
    href: LOGOUT_ROUTE,
    id: 'logout-route-nav-link',
  },
];

export const PREVIEW_WHITELIST = [
  HOME_ROUTE,
  HYBRID_ROUTE,
  PROJECTS_SUMMARY_ROUTE,
  PROJECTS_PROJECT_ROUTE,
  PROJECTS_INSIGHTS_ROUTE,
]; //, EMPLOYEES_ROUTE];

export const KEY_METRIC_TOOLTIPS = {
  WELLBEING:
    'The percentage of your employees who fall into the suffering experience band and need immediate attention',
  EQUALITY:
    'Understand the difference in experience across your workforce to create a level playing field for all of your people',
  PAYROLL:
    'The total wasted payroll across your business resulting from inefficiencies and issues in your digital workplace',
  EFFICIENCY: 'The average time lost per employee each year while they wait for the digital world to work properly',
  REVENUE:
    'Quantifying the revenue opportunity cost due to your employees losing time as a result of their digital experience',
} as const;

export const SANKEY_TOOLTIPS: Record<string, string | undefined> = {
  home: 'Up to one day every month, or 0.25 days per week, or 5% of the month, may be spent at the office.',
  office: 'Up to one day every month, or 0.25 days per week, or 5% of the month, may be spent at home.',
};

export const CONTEXT_LOADING = 'Loading';
export const CONTEXT_NOT_AVAILABLE = 'No available report contexts';

export const CO2_REDUCTION_LABEL = 'Commuting impact (CO2)';
export const CO2_WELLBEING_HEADLINE_TOOLTIP =
  'This is calculated from the total number of days per month employees in the suffering group are commuting to the office, multiplied by a CO2 value for an average rush hour commute journey in London.';
export const CO2_WELLBEING_AVERAGE_TOOLTIP =
  'This is calculated from the average number of days per month employees in the suffering group are commuting to the office, multiplied by a CO2 value for an average rush hour commute journey in London.';

export const WORST_SITES_TYPE_LABELS: Record<WorstOfficesChartType, string> = {
  [WorstOfficesChartType.Worst10]: 'Top 10 worst affected',
  [WorstOfficesChartType.KeySites]: 'Key sites',
  [WorstOfficesChartType.Upgrading]: 'Upgrading',
};

export const WORST_SITES_TYPE_TOOLTIPS: Record<WorstOfficesChartType, string> = {
  [WorstOfficesChartType.Worst10]: `Chart displaying the performance of the company's top ten worst-affected offices`,
  [WorstOfficesChartType.KeySites]: `Chart displaying the performance of the company's key sites`,
  [WorstOfficesChartType.Upgrading]: `Chart displaying the performance of the company's offices that are currently being upgraded`,
};

export const IMPROVEMENT_STATUS: Record<ProjectStatus, string> = {
  [ProjectStatus.COMPLETED]: 'Completed',
  [ProjectStatus.ON_HOLD]: 'On hold',
  [ProjectStatus.IN_PROGRESS]: 'In progress',
  [ProjectStatus.NOT_STARTED]: 'New',
  [ProjectStatus.ARCHIVED]: 'Archived',
};

export const IMPROVEMENT_TYPE: Record<ProjectType, string> = {
  [ProjectType.APPLICATION]: 'Application',
  [ProjectType.NETWORK_REMOTE]: 'Network (Remote)',
  [ProjectType.NETWORK_OFFICE]: 'Network (Office)',
  [ProjectType.WIDER_NETWORK]: 'Wider Network',
};

export const STATUS_SORT_ORDER: ProjectStatus[] = [
  ProjectStatus.NOT_STARTED,
  ProjectStatus.IN_PROGRESS,
  ProjectStatus.ON_HOLD,
  ProjectStatus.COMPLETED,
  ProjectStatus.ARCHIVED,
];

export enum KeyMetricContext {
  NONE = 'NONE',
  WELLBEING = 'WELLBEING',
  PAYROLL = 'PAYROLL',
  EFFICIENCY = 'EFFICIENCY',
  REVENUE = 'REVENUE',
}
