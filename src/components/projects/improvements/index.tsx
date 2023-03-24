import { useEffect, useMemo, useState } from 'react';
import { FilterAlt } from '@mui/icons-material';
import { Button } from '@mui/material';
import type { Dictionary } from '@reduxjs/toolkit';
import { useRouter } from 'next/router';
import { memoize, memoizeWithArgs } from 'proxy-memoize';
import QuickReportPicker from 'src/components/header/data-switcher/quick-report-switcher';
import ProjectsPageEmpty from 'src/components/projects/empty-state';
import EmptyBlock from 'src/components/projects/empty-state/block';
import ImprovementsDrawer from 'src/components/projects/improvements/details';
import FiltersDialog from 'src/components/projects/improvements/filters/dialog';
import ProjectTypeFilterButton from 'src/components/projects/improvements/filters/project-type-filter-button';
import StatusFilterButton from 'src/components/projects/improvements/filters/status-filter-button';
import styles from 'src/components/projects/projects.module.scss';
import ProjectTabs from 'src/components/projects/tabs';
import { SearchInput } from 'src/components/shared/input/search';
import { ReportState } from 'src/constants/report';
import type { ModelProjectFilterInput, Project } from 'src/graphql';
import { ProjectType, ProjectStatus } from 'src/graphql';
import { useAppDispatch, useAppSelector } from 'src/hooks';
import useContextInfo from 'src/hooks/use-context-info';
import useDebouncedValue from 'src/hooks/use-debounced-value';
import useGQLFilter, { makeFieldConfig } from 'src/hooks/use-gql-filter';
import useIsPreview from 'src/hooks/use-is-preview';
import useReport from 'src/hooks/use-report';
import useSkipReportQuery from 'src/hooks/use-skip-report-query';
import { countFilters } from 'src/logic/libs/graphql';
import { addAppListener } from 'src/middleware/listener';
import { selectCurrency } from 'src/slices/dashboard';
import { selectPreviewProjects } from 'src/slices/preview';
import {
  selectCurrentReportId,
  initialiseReport,
  useListProjectsQuery,
  selectNewReport,
  selectAllProjects,
  selectProjectMap,
} from 'src/slices/report';
import Improvements, { ImprovementStatus } from './table';

const makeFinalFilter = memoizeWithArgs(
  (
    savedFilter: ModelProjectFilterInput,
    searchFilter: string,
    reportProjectIds: (string | null)[],
    reportId: string | null
  ): ModelProjectFilterInput =>
    reportId
      ? {
          ...savedFilter,
          reportProjectsId: { eq: reportId },
          ...(searchFilter ? { projectName: { contains: searchFilter } } : {}),
          and: [...(savedFilter.and ?? []), { or: reportProjectIds.map((id) => ({ id: { eq: id } })) }],
        }
      : {},
  { size: 3 }
);

const sortProjects = memoizeWithArgs((projectMap: Dictionary<Project> | undefined, order: Array<string | null>) => {
  const projectsToReturn: Project[] = [];
  for (const id of order) {
    const project = id && projectMap?.[id];
    if (project) {
      projectsToReturn.push(project);
    }
  }
  return projectsToReturn;
});

const emptyFilter: ModelProjectFilterInput = {};
const emptyProjectArray: Project[] = [];

const filterButtonFieldConfig = makeFieldConfig<ModelProjectFilterInput>()({
  projectStatus: true,
  projectType: true,
});

const getStatusAndTypeCounts = memoize((projects: Project[]) =>
  projects.reduce<{
    status: Partial<Record<ProjectStatus, number>>;
    type: Partial<Record<ProjectType, number>>;
  }>(
    (acc, project) => {
      if (project.projectType) {
        acc.type[project.projectType] = (acc.type[project.projectType] ?? 0) + 1;
      }
      if (project.projectStatus) {
        acc.status[project.projectStatus] = (acc.status[project.projectStatus] ?? 0) + 1;
      }
      return acc;
    },
    {
      type: {},
      status: {},
    }
  )
);

const ImprovementsPage = () => {
  const dispatch = useAppDispatch();
  const preview = useIsPreview();
  const selectedReportId = useAppSelector(selectCurrentReportId);
  const previewProjects = useAppSelector(selectPreviewProjects);

  const [search, setSearch] = useState('');

  // debounce search input for query, at 500ms if input, or instant if cleared
  const searchFilter = useDebouncedValue(search, 500, { instant: [''] });

  const contextInfo = useContextInfo();

  //On initial load, if the filename is blank (we haven't set one yet) then go figure it out.
  useEffect(() => {
    if (!preview && selectedReportId === ReportState.NOT_SET && contextInfo.reportContext.prettyId) {
      dispatch(initialiseReport(contextInfo.reportContext.prettyId));
    }
    //eslint-disable-next-line
  }, [contextInfo.reportContext.prettyId]);

  const { report, ids, refReport } = useReport();
  const { selectedReportId: reportId, refReportId } = ids;

  const skip = useSkipReportQuery(reportId, preview);

  const reportProjectIds = useMemo(
    () => (preview ? previewProjects?.map(({ id }) => id) ?? [] : report?.data?.projectIds ?? []),
    [report?.data?.projectIds, previewProjects, preview]
  );

  const [filterOpen, setFilterOpen] = useState(false);

  const [savedFilter, methods] = useGQLFilter({
    savedFilter: emptyFilter,
    fields: filterButtonFieldConfig,
  });

  useEffect(() => {
    const unsubscribe = dispatch(
      addAppListener({
        actionCreator: selectNewReport.pending,
        effect: () => {
          methods.replaceFilter(emptyFilter);
        },
      })
    );
    return unsubscribe;
  }, [dispatch, methods]);

  const { projectMap, isFetching, isLoading, isUninitialized } = useListProjectsQuery(
    {
      filter: makeFinalFilter(savedFilter, searchFilter, reportProjectIds, reportId),
      preview,
    },
    {
      skip: skip || reportProjectIds.length === 0, //Don't try to get projects if we... have... none...
      selectFromResult: ({ isFetching, isLoading, isError, isUninitialized, data }) => ({
        isFetching,
        isLoading,
        isError,
        isUninitialized,
        projectMap: data?.data && selectProjectMap(data.data),
      }),
    }
  );

  const { refProjects } = useListProjectsQuery(
    {
      filter: makeFinalFilter(savedFilter, searchFilter, refReport?.data?.projectIds ?? [], refReportId),
      preview,
    },
    {
      skip: skip || !refReport || refReport?.data?.projectIds?.length === 0,
      selectFromResult: ({ data }) => ({
        refProjects: data?.data && selectProjectMap(data.data),
      }),
    }
  );

  // turn ref projects Dictionary into a map of Record<Project.projectId, Project>
  const refProjectsMap = useMemo(
    () =>
      refProjects
        ? Object.values(refProjects).reduce((m: Record<string, Project>, p: Project | undefined) => {
            if (p) {
              m[p.projectId ?? p.id] = p;
            }

            return m;
          }, {})
        : {},
    [refProjects]
  );

  const { unfilteredProjects } = useListProjectsQuery(
    {
      filter: makeFinalFilter(emptyFilter, '', reportProjectIds, reportId),
      preview,
    },
    {
      skip: skip || reportProjectIds.length === 0, //Don't try to get projects if we... have... none...
      selectFromResult: ({ data }) => ({
        unfilteredProjects: data?.data && selectAllProjects(data.data),
      }),
    }
  );

  const router = useRouter();

  const [, linkedImprovement] = router.asPath.split('#improvement-');

  const [detailsProject, setDetailsProject] = useState(linkedImprovement ?? '');

  const { status: statusCounts, type: typeCounts } = getStatusAndTypeCounts(unfilteredProjects ?? emptyProjectArray);

  //GraphQL doesn't sort things as we want to make sure the INTITIAL ordering of improvements matches the one we set up in the preview state. This can be overwritten with the column sorts.
  const projectsToDisplay = sortProjects(projectMap, reportProjectIds);

  if (!report) {
    return <ProjectsPageEmpty />;
  }

  return (
    <div className={styles.projectsWrapper}>
      <div className={styles.projectsTitle}>
        <h1 id="improvements-header">Improvements</h1>
        <span id="improvements-report-name" className={styles.projectReportName}>
          <label>Based on report: </label>
          <QuickReportPicker variant="light" />
        </span>
      </div>
      <ProjectTabs />
      <div className={styles.projectsContent}>
        {!preview ? (
          <>
            <div className={styles.statusButtonWrap}>
              <StatusFilterButton
                projectStatus={ImprovementStatus.NOT_STARTED}
                projectCount={statusCounts[ProjectStatus.NOT_STARTED] ?? 0}
                onClick={() => methods.toggleField({ key: 'projectStatus', value: { eq: ProjectStatus.NOT_STARTED } })}
                selected={savedFilter.projectStatus?.eq === ProjectStatus.NOT_STARTED}
              />
              <StatusFilterButton
                projectStatus={ImprovementStatus.IN_PROGRESS}
                projectCount={statusCounts[ProjectStatus.IN_PROGRESS] ?? 0}
                onClick={() => methods.toggleField({ key: 'projectStatus', value: { eq: ProjectStatus.IN_PROGRESS } })}
                selected={savedFilter.projectStatus?.eq === ProjectStatus.IN_PROGRESS}
              />
              <StatusFilterButton
                projectStatus={ImprovementStatus.ON_HOLD}
                projectCount={statusCounts[ProjectStatus.ON_HOLD] ?? 0}
                onClick={() => methods.toggleField({ key: 'projectStatus', value: { eq: ProjectStatus.ON_HOLD } })}
                selected={savedFilter.projectStatus?.eq === ProjectStatus.ON_HOLD}
              />
              <StatusFilterButton
                projectStatus={ImprovementStatus.COMPLETED}
                projectCount={statusCounts[ProjectStatus.COMPLETED] ?? 0}
                onClick={() => methods.toggleField({ key: 'projectStatus', value: { eq: ProjectStatus.COMPLETED } })}
                selected={savedFilter.projectStatus?.eq === ProjectStatus.COMPLETED}
              />
              <StatusFilterButton
                projectStatus={ImprovementStatus.ARCHIVED}
                projectCount={statusCounts[ProjectStatus.ARCHIVED] ?? 0}
                onClick={() => methods.toggleField({ key: 'projectStatus', value: { eq: ProjectStatus.ARCHIVED } })}
                selected={savedFilter.projectStatus?.eq === ProjectStatus.ARCHIVED}
              />
            </div>
            <div className={styles.projectTypeFilterWrap}>
              <ProjectTypeFilterButton
                projectType={ProjectType.APPLICATION}
                projectCount={typeCounts[ProjectType.APPLICATION] ?? 0}
                onClick={() => methods.toggleField({ key: 'projectType', value: { eq: ProjectType.APPLICATION } })}
                selected={savedFilter.projectType?.eq === ProjectType.APPLICATION}
              />
              <ProjectTypeFilterButton
                projectType={ProjectType.NETWORK_REMOTE}
                projectCount={typeCounts[ProjectType.NETWORK_REMOTE] ?? 0}
                onClick={() => methods.toggleField({ key: 'projectType', value: { eq: ProjectType.NETWORK_REMOTE } })}
                selected={savedFilter.projectType?.eq === ProjectType.NETWORK_REMOTE}
              />
              <ProjectTypeFilterButton
                projectType={ProjectType.NETWORK_OFFICE}
                projectCount={typeCounts[ProjectType.NETWORK_OFFICE] ?? 0}
                onClick={() => methods.toggleField({ key: 'projectType', value: { eq: ProjectType.NETWORK_OFFICE } })}
                selected={savedFilter.projectType?.eq === ProjectType.NETWORK_OFFICE}
              />
              <ProjectTypeFilterButton
                projectType={ProjectType.WIDER_NETWORK}
                projectCount={typeCounts[ProjectType.WIDER_NETWORK] ?? 0}
                onClick={() => methods.toggleField({ key: 'projectType', value: { eq: ProjectType.WIDER_NETWORK } })}
                selected={savedFilter.projectType?.eq === ProjectType.WIDER_NETWORK}
              />
            </div>
            <div className={styles.searchWrap}>
              <SearchInput
                id="improvements-list-search"
                placeholder="Search for a project"
                className={styles.search}
                value={search}
                disabled={isLoading}
                onChange={(e) => setSearch(e.target.value)}
                onClear={() => setSearch('')}
                isSearching={!!search && (isLoading || isFetching)}
              />
              <Button
                className={styles.filterButton}
                startIcon={<FilterAlt />}
                endIcon={'(' + countFilters(savedFilter) + ')'}
                variant="outlined"
                sx={(theme) => theme.mixins.lightTheme.button()}
                onClick={() => setFilterOpen(true)}
              >
                Filters
              </Button>
            </div>
          </>
        ) : null}
        {projectsToDisplay?.length ? (
          <Improvements
            projects={projectsToDisplay ?? []}
            refProjects={refProjects}
            currency={selectCurrency(report.reportData)}
            {...{
              isFetching,
              isLoading,
              isUninitialized,
              detailsProject,
              setDetailsProject,
            }}
          />
        ) : (
          <EmptyBlock>No projects available</EmptyBlock>
        )}
      </div>
      {!preview && (
        <FiltersDialog
          isOpen={filterOpen}
          handleClose={() => setFilterOpen(false)}
          projects={unfilteredProjects}
          setSavedFilter={methods.replaceFilter}
          {...{ savedFilter }}
        />
      )}
      <ImprovementsDrawer
        project={projectMap?.[detailsProject]}
        refProject={refProjectsMap[projectMap?.[detailsProject]?.projectId || '']}
        onClose={() => setDetailsProject('')}
      />
    </div>
  );
};

export default ImprovementsPage;
