import { useEffect, useMemo, useState } from 'react';
import { Download, FilterAlt, Refresh } from '@mui/icons-material';
import {
  useTheme,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableCell,
  TableRow,
  TableSortLabel,
  Paper,
  IconButton,
  TablePagination,
  Button,
} from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import type { Dictionary, EntityId } from '@reduxjs/toolkit';
import download from 'downloadjs';
import type { FieldInfo, FieldValueCallback } from 'json2csv';
import { parseAsync } from 'json2csv';
import { memoizeWithArgs } from 'proxy-memoize';
import { MoonLoader } from 'react-spinners';
import { useImmer } from 'use-immer';
import EmployeesGraphics from 'src/components/employees/graphics';
import DetailsDrawer from 'src/components/employees/list/details';
import FiltersDialog from 'src/components/employees/list/filters';
import EmployeeSkeletonRow from 'src/components/employees/list/skeleton-row';
import ImprovementsDrawer from 'src/components/projects/improvements/details';
import { SearchInput } from 'src/components/shared/input/search';
import { TableEmptyBody } from 'src/components/shared/table';
import type { DU, ModelDUFilterInput, ModelProjectFilterInput, Project } from 'src/graphql';
import { useAppDispatch, useAppSelector } from 'src/hooks';
import useDebouncedValue from 'src/hooks/use-debounced-value';
import useIsPreview from 'src/hooks/use-is-preview';
import { useMuiTablePagination } from 'src/hooks/use-pagination';
import type { HookReport } from 'src/hooks/use-report';
import useReport from 'src/hooks/use-report';
import useSkipReportQuery from 'src/hooks/use-skip-report-query';
import useSort from 'src/hooks/use-sort';
import { countFilters } from 'src/logic/libs/graphql';
import { sortByKey } from 'src/logic/libs/helpers';
import { addAppListener } from 'src/middleware/listener';
import { selectDUIds, selectDUMap, useListDUsByReportQuery } from 'src/slices/du';
import { selectPreviewProjects } from 'src/slices/preview';
import { selectCurrentReportId, selectNewReport, selectProjectMap, useListProjectsQuery } from 'src/slices/report';
import type { Overwrite } from 'src/types/util';
import ListRow, { banding } from './list-row';
import styles from './list.module.scss';
import baseAdminStyles from 'styles/Admin.module.scss';

const csvFields: Array<keyof DU | Overwrite<FieldInfo<DU>, { value: keyof DU | FieldValueCallback<DU> }>> = [
  { value: 'name', label: 'Name' },
  { value: 'country', label: 'Country' },
  { value: 'office', label: 'Office' },
  {
    label: 'Improvements',
    value: ({ projects }: DU) =>
      (projects?.items?.length ?? 0) === 0
        ? 'n/a'
        : projects?.items?.map((project) => project?.project?.projectName).join(',') ?? 'n/a',
  },
  { value: 'hxScore', label: 'HX Score' },
  {
    label: 'HX Banding',
    value: ({ hxScore }: DU) => banding(hxScore ?? 0),
  },
];

// stable refs
const emptyIdArray: EntityId[] = [];
const emptyDuMap: Dictionary<DU> = {};

const getProjectFilter = memoizeWithArgs(
  (
    reportId: string,
    preview: boolean,
    previewProjects: Project[],
    report: HookReport | null
  ): ModelProjectFilterInput => ({
    reportProjectsId: { eq: reportId },
    and: [
      {
        or: (preview ? previewProjects?.map(({ id }) => id) ?? [] : report?.data?.projectIds ?? []).map((id) => ({
          id: { eq: id },
        })),
      },
    ],
  })
);

const EmployeesList = () => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const {
    column: sortCol,
    direction: sortDir,
    getCellProps,
    getSortLabelProps,
  } = useSort<'name' | 'country' | 'office' | 'hxScore'>('name');

  const reportId = useAppSelector(selectCurrentReportId);
  const previewProjects = useAppSelector(selectPreviewProjects);

  const [detailsEmployee, setDetailsEmployee] = useState<EntityId>('');
  const [detailsImprovement, setDetailsImprovement] = useState<EntityId>('');

  const [filterOpen, setFilterOpen] = useState(false);
  const [savedFilter, setSavedFilter] = useState<ModelDUFilterInput>({});
  useEffect(() => {
    const unsubscribe = dispatch(
      addAppListener({
        actionCreator: selectNewReport.pending,
        effect: () => {
          setSavedFilter({});
        },
      })
    );
    return unsubscribe;
  }, [dispatch, setSavedFilter]);

  const [search, setSearch] = useState('');

  // debounce search input for query, at 500ms if input, or instant if cleared
  const searchFilter = useDebouncedValue(search, 500, { instant: [''] });

  const { employeeIds, employeeMap, isLoading, isFetching, refetch } = useListDUsByReportQuery(
    { reportId, searchFilter, filter: savedFilter },
    {
      selectFromResult: ({ data, isLoading, isFetching }) => ({
        employeeIds: (data && selectDUIds(data.data)) ?? emptyIdArray,
        employeeMap: (data && selectDUMap(data.data)) ?? emptyDuMap,
        isLoading,
        isFetching,
      }),
    }
  );

  const preview = useIsPreview();

  const skip = useSkipReportQuery(reportId, preview);

  const { report } = useReport();

  const { projectMap } = useListProjectsQuery(
    {
      filter: getProjectFilter(reportId, preview, previewProjects, report),
      preview,
    },
    {
      skip: skip || (preview ? previewProjects : report?.data?.projectIds ?? []).length === 0, //Don't try to get projects if we... have... none...
      selectFromResult: ({ data }) => ({
        projectMap: data?.data && selectProjectMap(data.data),
      }),
    }
  );

  const [selectedIds, updateSelectedIds] = useImmer(new Set<EntityId>()); // use immer to let us use .add and .delete while remaining immutable

  useEffect(() => {
    updateSelectedIds(new Set());
  }, [employeeIds, updateSelectedIds]); // reset when we get new data

  const renderList = useMemo(() => {
    const comparator = sortByKey<DU>(sortCol, sortDir);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return employeeIds ? [...employeeIds].sort((idA, idB) => comparator(employeeMap[idA]!, employeeMap[idB]!)) : [];
  }, [employeeIds, employeeMap, sortDir, sortCol]);
  const { sliceArgs, getPaginationProps, rowsPerPage } = useMuiTablePagination({ total: employeeIds.length });

  const paginatedList = useMemo(() => renderList.slice(...sliceArgs), [renderList, sliceArgs]);

  const handleCheck = ({ checked, id }: { checked: boolean; id: string }) => {
    if (checked) {
      updateSelectedIds((selectedIds) => {
        selectedIds.add(id);
      });
    } else {
      updateSelectedIds((selectedIds) => {
        selectedIds.delete(id);
      });
    }
  };

  const handleCheckAll = (checked: boolean) => {
    if (checked) {
      updateSelectedIds(new Set(employeeIds));
    } else {
      updateSelectedIds(new Set());
    }
  };

  const handleExport = async () => {
    const data: DU[] = [];
    for (const id of selectedIds) {
      const du = employeeMap[id];
      if (du) data.push(du);
    }
    const csvString = await parseAsync(data, {
      fields: csvFields,
    });
    download(csvString, 'employees.csv', 'text/csv');
  };

  const listContent = isLoading ? (
    <div className={baseAdminStyles.loadingWrapper}>
      <MoonLoader color={theme.palette.primary.main} />
    </div>
  ) : (
    <TableContainer component={Paper} className={styles.tableContainer}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell id="select-all-heading" className={styles.checkboxColumn}>
              <Checkbox
                indeterminate={selectedIds.size > 0 && selectedIds.size < employeeIds.length}
                checked={selectedIds.size === employeeIds.length}
                onChange={(e) => handleCheckAll(e.target.checked)}
                size="small"
              />
            </TableCell>
            <TableCell id="details-heading" align="center" className={styles.iconButtonColumn} />
            <TableCell id="du-heading" align="left" className={styles.nameColumn} {...getCellProps('name')}>
              <TableSortLabel {...getSortLabelProps('name')}>Digital User</TableSortLabel>
            </TableCell>
            <TableCell align="left" id="country-heading" className={styles.countryColumn} {...getCellProps('country')}>
              <TableSortLabel {...getSortLabelProps('country')}>Country</TableSortLabel>
            </TableCell>
            <TableCell align="left" id="office-heading" className={styles.officeColumn} {...getCellProps('office')}>
              <TableSortLabel {...getSortLabelProps('office')}>Office</TableSortLabel>
            </TableCell>
            <TableCell align="left" id="projects-heading" className={styles.projectsColumn}>
              Improvements
            </TableCell>
            <TableCell align="left" id="hxscore-heading" className={styles.hxScoreColumn} {...getCellProps('hxScore')}>
              <TableSortLabel {...getSortLabelProps('hxScore')}>HX Score</TableSortLabel>
            </TableCell>
            <TableCell align="left" id="hxbanding-heading" className={styles.hxBandingColumn}>
              HX Banding
            </TableCell>
          </TableRow>
        </TableHead>
        {isLoading || isFetching ? (
          <TableBody>
            {[...Array(Math.min(rowsPerPage, paginatedList.length || Number.MAX_SAFE_INTEGER))].map((_, i) => (
              <EmployeeSkeletonRow key={i} />
            ))}
          </TableBody>
        ) : paginatedList.length ? (
          <TableBody>
            {paginatedList.map((id) => {
              const employee = employeeMap[id];
              return (
                employee && (
                  <ListRow
                    employee={employee}
                    key={id}
                    handleCheck={handleCheck}
                    selected={selectedIds.has(id)}
                    detailsOpen={detailsEmployee === id}
                    onDetails={() => setDetailsEmployee((prev) => (prev === id ? '' : id))}
                    onImprovement={setDetailsImprovement}
                  />
                )
              );
            })}
          </TableBody>
        ) : (
          <TableEmptyBody id="employee-list-empty">No employees found</TableEmptyBody>
        )}
      </Table>
    </TableContainer>
  );

  return (
    <>
      {
        <EmployeesGraphics
          dus={employeeIds as string[]}
          dataLoading={isLoading || isFetching}
          filterCount={countFilters(savedFilter) + (searchFilter ? 1 : 0)}
        />
      }
      <div className={styles.employeesSearchWrap}>
        <SearchInput
          className={styles.search}
          placeholder="Search for a Digital User"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          disabled={isLoading}
          onClear={() => setSearch('')}
          id="employees-list-search"
          isSearching={!!search && (isLoading || isFetching)}
        />
        <Button
          className={styles.exportButton}
          startIcon={<Download />}
          endIcon={'(' + selectedIds.size + ')'}
          disabled={selectedIds.size === 0}
          variant="contained"
          onClick={handleExport}
        >
          Export as CSV
        </Button>
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
        <IconButton
          className={styles.reloadList}
          sx={{ color: '#363636', ml: 1 }}
          id="employees-reload"
          onClick={() => refetch()}
        >
          {isFetching ? (
            <div className={styles.loadingSpinner}>
              <MoonLoader size={18} color={theme.palette.primary.main} />
            </div>
          ) : (
            <Refresh />
          )}
        </IconButton>
      </div>
      <div className={styles.employeesList}>{listContent}</div>
      <div className={styles.employeesPagination}>
        <TablePagination
          component="div"
          sx={
            isLoading || isFetching
              ? {
                  opacity: 0.6,
                  pointerEvents: 'none',
                }
              : {}
          }
          {...getPaginationProps('employees-list')}
        />
      </div>
      <FiltersDialog
        isOpen={filterOpen}
        handleClose={() => setFilterOpen(false)}
        {...{ savedFilter, setSavedFilter }}
      />
      <DetailsDrawer
        employee={employeeMap[detailsEmployee]}
        onClose={() => setDetailsEmployee('')}
        onImprovement={setDetailsImprovement}
      />
      {/* TODO: pass a refProject to the improvements drawer so we can show deltas */}
      <ImprovementsDrawer project={projectMap?.[detailsImprovement]} onClose={() => setDetailsImprovement('')} back />
    </>
  );
};

export default EmployeesList;
