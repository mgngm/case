/* eslint-disable no-relative-import-paths/no-relative-import-paths */
import { v4 } from 'uuid';
import { deleteFromTable, getMeta, queryDynamoTable, updateTableRecord, upsertToTable } from 'lambda/shared/dynamo';
import { wait } from 'lambda/shared/helpers';
import type { ProjectTemplateTableItem, ProjectTableItem } from 'lambda/shared/types';
import { PROJECT, PROJECT_TABLE, PROJECT_TEMPLATE_TABLE, REPORT_TABLE } from 'src/constants/datastore';
import { ProjectStatus } from 'src/graphql';
import type { Project } from 'src/graphql';
import type {
  Employee,
  EmployeeAnalytic,
  HydratedProject,
  InputAssumptions,
  Levers,
  OrgProperties,
  PersonaTerm,
  ProjectAnalytic,
  ProjectTemplate,
} from 'src/types/csv';
import { createCrossfilterGroups } from './crossfilter';
import {
  calculateHxScoreForAllEmployees,
  calculatePerEmployeeAveragesAndTermsAndGenerateCustomDimensions,
  calculateValuesPerEmployee,
} from './employee';
import { getEfficiencyMetric, getPayrollMetric } from './metrics';

/**
 * add projects to dynamo with a 24 hour ttl
 *
 * @param projects Project[]
 * @param tokens Tokens
 * @returns Promise<Record<string,string>[]>
 */
export const addProjectsToDb = async (
  projects: Array<Project | ProjectTableItem>,
  reportId: string,
  orgId: string
): Promise<Project[]> => {
  // when we add projects to dynamo, set them to expire in 7 days
  // we will remove the ttl when the report is published. this way we
  // don't have orphaned projects persisting in the database if report
  // preview is abandoned.
  const nextWeek = Math.floor(Date.now() / 1000 + 24 * 60 * 60 * 7);

  // map the extra fields to the projects
  const dbIds: string[] = [];
  const dbEntries = projects.map((p) => {
    const extras = { ...getMeta(new Date(), PROJECT), id: v4(), _ttl: nextWeek };

    if (!p.id) {
      dbIds.push(extras.id);

      // ie it's type Project because it doesn't have id #typescript
      return {
        ...extras,
        ...p,
        reportProjectsId: reportId,
      };
    }

    dbIds.push(p.id);

    return p;
  });

  console.log(`Querying DB for projects on report ${reportId}`);
  const projectQuery = await queryDynamoTable(PROJECT_TABLE, 'gsi-Report.projects', 'reportProjectsId', reportId, {
    names: { '#ctx': 'context' },
    values: { ':ctx': orgId },
    conditions: '#ctx = :ctx',
  });

  let reportProjects: Project[] = [];

  if (!projectQuery || !projectQuery.Items || projectQuery.Items.length === 0) {
    console.error('Could not get report projects');
  } else {
    reportProjects = [...(projectQuery.Items as Project[])];
  }

  // remove any projects which are no longer on the report
  const projectsToRemove = reportProjects.map(({ id }) => id).filter((id) => !dbIds.includes(id));

  if (projectsToRemove.length > 0) {
    console.log('PROJECTS TO REMOVE:', projectsToRemove);

    try {
      console.log('PROJECT REMOVAL STARTED');
      await deleteFromTable(projectsToRemove, PROJECT_TABLE);
      console.log('PROJECT REMOVAL COMPLETE');
    } catch (err) {
      console.log('PROJECT REMOVAL FAILED');
      console.error(err);
    }
  }

  try {
    console.log('PROJECT UPSERT STARTED', dbEntries);
    await upsertToTable([...(dbEntries as ProjectTableItem[])], PROJECT_TABLE, 'projectId');
    console.log('PROJECT UPSERT COMPLETE');
  } catch (err) {
    console.log('PROJECT UPSERT FAILED');
    console.error(err);
    throw err;
  } finally {
    await wait(250);
  }

  // return the projects
  return dbEntries as Project[];
};

export const updateReportWithProjects = async (reportId: string, projects: Project[]) => {
  try {
    console.log(
      'REPORT PROJECT UPDATE STARTED',
      projects.map(({ id }) => id)
    );
    const update = await updateTableRecord({
      table: REPORT_TABLE,
      expressionAttributeNames: { '#projectIds': 'projectIds' },
      expressionAttributeValues: { ':projectIds': projects.map(({ id }) => id) },
      updateExpression: 'SET #projectIds = :projectIds',
      id: reportId,
    });
    console.log('REPORT PROJECT UPDATE COMPLETE');
    return update;
  } catch (err) {
    console.log('REPORT PROJECT UPDATE FAILED');
    console.log(err);
    throw err;
  }
};

/**
 * get a template that matches a given project id
 *
 * @param projectId string
 * @param orgId string
 * @param tokens Tokens
 * @returns Promise<ProjectTemplate>
 */
export const getProjectTemplate = async (projectId: string, orgId: string) => {
  console.log(`Querying DB for template ${projectId} on context ${orgId}`);
  const templatesQuery = await queryDynamoTable(PROJECT_TEMPLATE_TABLE, 'byTemplateId', 'templateId', projectId, {
    names: { '#ctx': 'context' },
    values: { ':ctx': orgId },
    conditions: '#ctx = :ctx',
  });

  if (!templatesQuery || templatesQuery.Items?.length === 0) {
    throw new Error(`Could not find template by project ID: ${projectId}`);
  }

  const items = (templatesQuery.Items as ProjectTemplateTableItem[]) ?? [];

  console.log('Found project templates', JSON.stringify(items));

  // filter out deleted templates and those that do not match our current org
  const templates: ProjectTemplateTableItem[] = items.filter((s) => !s._deleted && s.context === orgId) ?? [];

  if (templates.length > 0) {
    // get the most recently updated version of the template
    templates.sort((a, b) => b._lastChangedAt - a._lastChangedAt);
    const [templateRecord] = templates;

    // map it to a template struct
    const template: ProjectTemplate = {
      projectId,
      projectBody: templateRecord.body,
      projectName: templateRecord.name,
      projectType: templateRecord.type,
      projectStatus: templateRecord.status as ProjectStatus,
    };

    return template;
  } else {
    console.log(`Template ${projectId} did not match item filter for context ${orgId}`);
    throw new Error(`No template for project ID: ${projectId}`);
  }
};

/**
 * Lookup the project in the table to see if it already exists, if it does, return its projectDate
 * and status for use on this new report
 *
 * @param project HydratedProject
 * @param orgId string
 * @returns Promise<{ projectDate: string; projectStatus: ProjectStatus }>
 */
export const getProjectDateAndStatus = async (
  project: HydratedProject,
  orgId: string,
  template: ProjectTemplate,
  reportDate: string
): Promise<{ projectDate: string; projectStatus: ProjectStatus }> => {
  // query projects table for given project ID in this context
  console.log(`Querying project table for ${project.projectId} in context ${orgId}`);
  const existingProjectsQuery = await queryDynamoTable(PROJECT_TABLE, 'byProjectId', 'projectId', project.projectId, {
    names: { '#ctx': 'context' },
    values: { ':ctx': orgId },
    conditions: '#ctx = :ctx',
  });

  if (!existingProjectsQuery || !existingProjectsQuery.Items || existingProjectsQuery.Items.length === 0) {
    console.log(`No existing project for ${project.projectId} found on ${orgId}`);
    console.log(`Project date: ${project.projectDate ?? reportDate}; Project status: ${template.projectStatus}`);
    // no existing projects on the context for this projectId, so return the current project date
    return { projectDate: project.projectDate ?? reportDate, projectStatus: template.projectStatus as ProjectStatus };
  }

  // there are existing projects, so set the project date to the oldest
  const existingProjects = existingProjectsQuery.Items.sort((a, b) =>
    a.projectDate && b.projectDate ? a.projectDate.localeCompare(b.projectDate) : 0
  );

  console.log('Synchronising to existing project', existingProjects[0]);
  const { projectDate, projectStatus } = existingProjects[0];

  console.log(`Project date: ${project.projectDate ?? reportDate}; Project status: ${template.projectStatus}`);
  return { projectDate, projectStatus };
};

export const getReportProject = async (projectId: string, orgId: string, reportId: string): Promise<Project | null> => {
  // query on report ID
  console.log(`Querying DB for projectId ${projectId} on report ${reportId}`);
  const projectQuery = await queryDynamoTable(PROJECT_TABLE, 'gsi-Report.projects', 'reportProjectsId', reportId, {
    names: { '#ctx': 'context', '#projectId': 'projectId' },
    values: { ':ctx': orgId, ':projectId': projectId },
    conditions: '#ctx = :ctx AND #projectId = :projectId',
  });

  if (!projectQuery || !projectQuery.Items || projectQuery.Items.length === 0) {
    console.log(`Project ${projectId} not found on report`);
    // no existing projects on the report for this projectId, so return null
    return null;
  }

  console.log(`Project ${projectId} exists on report ${reportId}`);
  return projectQuery.Items[0] as Project;
};

/**
 * get project templates and map them to projects
 *
 * @param projects HydratedProject[]
 * @param orgId string
 * @param tokens Tokens
 * @returns Promise<Project[]>
 */
export const mapProjectsToTemplates = async (
  projects: HydratedProject[],
  orgId: string,
  reportId: string,
  reportDate: string
) => {
  const failures: Record<string, string>[] = [];
  const mergedProjects = [];
  const projectTemplates: Record<string, ProjectTemplate> = {};

  for (const project of projects) {
    try {
      let mergeInput;
      const reportProject = await getReportProject(project.projectId, orgId, reportId);

      let template: ProjectTemplate;
      if (!projectTemplates[project.projectId]) {
        template = await getProjectTemplate(project.projectId, orgId);
        // cache the template
        projectTemplates[project.projectId] = template;
      } else {
        template = projectTemplates[project.projectId];
      }

      if (reportProject && template) {
        mergeInput = { ...reportProject };
      } else if (template) {
        const { projectStatus, projectDate }: { projectStatus: ProjectStatus; projectDate: string } =
          await getProjectDateAndStatus(project, orgId, template, reportDate);

        mergeInput = { ...template, projectStatus, projectDate: projectDate ?? reportDate };
      } else {
        throw new Error(`No template or existing project found for ${project.projectId}`);
      }

      const mergedProject = {
        ...mergeInput,
        context: orgId,
        employeeCount: project.employeeCount,
        hxScore: project.hxScore,
        timeLost: project.timeLost,
        payroll: project.payroll,
      };

      console.log(`Populated project ${project.projectId} successfully`);

      mergedProjects.push(mergedProject);
    } catch (err) {
      const error = err instanceof Error ? err.message : String(err);
      failures.push({ error, projectId: project.projectId });
    }
  }

  if (failures.length > 0) {
    console.log(`Could not map some projects to templates: ${JSON.stringify(failures)}`);
  }

  return { mergedProjects, failures };
};

/**
 * takes the mapping of analytic to project, aggregates those analytics
 * into project scores and metrics
 *
 * @param projects Map<string, ProjectAnalytic[]>
 * @param inputAssumptions InputAssumptions
 * @param personaTerm PersonaTerm
 * @param orgProperties OrgProperties
 * @param levers Levers
 * @param reportDate string
 * @returns HydratedProject[]
 */
export const parseProjectData = (
  projects: Map<string, ProjectAnalytic[]>,
  inputAssumptions: InputAssumptions,
  personaTerm: PersonaTerm,
  orgProperties: OrgProperties,
  levers: Levers,
  reportDate: string
) => {
  // named string types because I was getting confused which key was which
  type Project = string;
  type EmployeeName = string;

  const hydratedProjects: HydratedProject[] = [];

  // within each project, aggregate analytics to employees
  projects.forEach((analytics, project) => {
    const projectEmployees: Record<Project, Record<EmployeeName, Employee>> = {};
    const projectDuAnalytics: EmployeeAnalytic = {};

    projectEmployees[project] = {};

    // collect analytics into employees
    let a = 0;
    while (a < analytics.length) {
      const analytic = analytics[a];
      const du = analytic['DU Name'] as EmployeeName;
      if (du) {
        const key = du.toLowerCase();
        if (key in projectDuAnalytics) {
          projectDuAnalytics[key].push(analytic);
        } else {
          projectDuAnalytics[key] = [analytic];
        }
      }
      a += 1;
    }

    // calculate employee values
    const { employeeData } = calculatePerEmployeeAveragesAndTermsAndGenerateCustomDimensions(
      projectDuAnalytics,
      Object.keys(projectDuAnalytics),
      orgProperties,
      personaTerm,
      inputAssumptions
    );

    // store employee data on project
    projectEmployees[project] = employeeData;

    //From now on we don't need the employeeData keyed by ID so we can convert it to an array
    let employeeDataArray = Object.values(employeeData);

    // calculate employee numbers
    employeeDataArray = calculateValuesPerEmployee(employeeDataArray, inputAssumptions, personaTerm);

    // calculate scores per location
    // const locations = calculateScoresPerLocation(employeeDataArray, levers, personaTerm);

    // calculate project metrics
    const { totalGroup } = createCrossfilterGroups(
      employeeDataArray,
      { termType: personaTerm.termType, term: personaTerm.value, inputAssumptions },
      levers
    );

    const efficiency = getEfficiencyMetric(totalGroup).value;
    const payroll = getPayrollMetric(totalGroup).value;

    const projectData: HydratedProject = {
      dus: employeeDataArray,
      employeeCount: employeeDataArray.length,
      projectId: project,
      hxScore: calculateHxScoreForAllEmployees(employeeDataArray),
      timeLost: efficiency,
      payroll,
      projectDate: reportDate, // default
      projectStatus: ProjectStatus.NOT_STARTED, // default
    };

    hydratedProjects.push(projectData);
  });

  return hydratedProjects;
};
