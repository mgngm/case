import { useEffect, useMemo, useState } from 'react';
import { TablePagination, TableSortLabel, useTheme } from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import type { EntityId } from '@reduxjs/toolkit';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { MoonLoader } from 'react-spinners';
import QuickReportPicker from 'src/components/header/data-switcher/quick-report-switcher';
import EmptyBlock from 'src/components/projects/empty-state/block';
import InsightRow from 'src/components/projects/insights/row';
import projectStyles from 'src/components/projects/projects.module.scss';
import ProjectTabs from 'src/components/projects/tabs';
import { SearchInput } from 'src/components/shared/input/search';
import { PROJECTS_PROJECT_ROUTE } from 'src/constants/routes';
import { useAppSelector } from 'src/hooks';
import useDebouncedValue from 'src/hooks/use-debounced-value';
import useIsPreview from 'src/hooks/use-is-preview';
import { useMuiTablePagination } from 'src/hooks/use-pagination';
import useReport from 'src/hooks/use-report';
import useSort from 'src/hooks/use-sort';
import { sortByKey } from 'src/logic/libs/helpers';
import { selectInsightsByIds, useListProjectInsightsQuery } from 'src/slices/insights';
import { selectInsights } from 'src/slices/preview';
import styles from './insights.module.scss';

const Insights = () => {
  const router = useRouter();
  const preview = useIsPreview();
  const previewInsights = useAppSelector(selectInsights);
  const { report } = useReport();

  const [search, setSearch] = useState('');

  // debounce search input for query, at 500ms if input, or instant if cleared
  const searchFilter = useDebouncedValue(search, 500, { instant: [''] });

  const insights = (preview ? previewInsights : report?.data?.insightIds) ?? [];
  const theme = useTheme();
  const { data, isFetching, isLoading, isError, isUninitialized } = useListProjectInsightsQuery(
    {
      filter: { or: insights.map((id) => ({ id: { eq: id } })) },
    },
    {
      selectFromResult: ({ isFetching, isLoading, isError, isUninitialized, data }) => ({
        isFetching,
        isLoading,
        isError,
        isUninitialized,
        data: data && selectInsightsByIds(data.data, insights as EntityId[]),
      }),
    }
  );

  const { column, direction, getCellProps, getSortLabelProps } = useSort<'name' | 'insightDate'>('name');

  const sortedData = useMemo(
    () =>
      data
        ?.slice()
        .filter((d) => d.name?.includes(searchFilter))
        .sort(sortByKey(column, direction)),
    [data, column, direction, searchFilter]
  );

  // if we don't have insights, redirect to the projects tab
  useEffect(() => {
    if (!preview && !isLoading && !isFetching && !isUninitialized && data && data.length === 0) {
      router.push(PROJECTS_PROJECT_ROUTE);
    }
  }, [data, isFetching, isLoading, isUninitialized, preview, report, router]);

  const { sliceArgs, getPaginationProps } = useMuiTablePagination({ total: sortedData?.length ?? 0 });

  const paginatedList = useMemo(() => (sortedData ? sortedData.slice(...sliceArgs) : []), [sortedData, sliceArgs]);

  let content = null;

  if (isFetching || isLoading || isUninitialized) {
    content = (
      <div className={styles.loadingWrapper}>
        <MoonLoader size={32} color={theme.palette.primary.main} />
      </div>
    );
  } else if (isError) {
    content = <EmptyBlock>Error fetching insights</EmptyBlock>;
  } else if (!preview && sortedData && sortedData.length === 0) {
    content = !preview ? (
      <div className={styles.loadingWrapper}>
        <MoonLoader size={32} color={theme.palette.primary.main} />
      </div>
    ) : (
      <EmptyBlock>No insights available</EmptyBlock>
    );
  } else {
    content = (
      <>
        <div className={styles.searchWrap}>
          <SearchInput
            id="insights-list-search"
            placeholder="Search for an insight"
            className={styles.search}
            value={search}
            disabled={isLoading}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch('')}
            isSearching={!!search && (isLoading || isFetching)}
          />
        </div>
        <TableContainer className={styles.tableContainer} component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className={clsx(styles.nameColumn, styles.headerRow)} {...getCellProps('name')}>
                  <TableSortLabel {...getSortLabelProps('name')}>Insight name</TableSortLabel>
                </TableCell>
                <TableCell className={clsx(styles.dateColumn, styles.headerRow)} {...getCellProps('insightDate')}>
                  <TableSortLabel {...getSortLabelProps('insightDate')}>Date added</TableSortLabel>
                </TableCell>
                <TableCell className={clsx(styles.downloadColumn, styles.headerRow)}>Download link</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedData && sortedData.length > 0 ? (
                paginatedList?.length &&
                paginatedList.map((insight) => <InsightRow key={insight.id} insight={insight} />)
              ) : (
                <TableRow>
                  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                    <div className={styles.emptyTable}>
                      <p>No insights available</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    );
  }

  return (
    <div className={projectStyles.projectsWrapper}>
      <div className={projectStyles.projectsTitle}>
        <h1 id="improvements-header">Improvements</h1>
        <span id="improvements-report-name" className={projectStyles.projectReportName}>
          <label>Based on report: </label>
          <QuickReportPicker variant="light" />
        </span>
      </div>
      <ProjectTabs />
      <div className={projectStyles.projectsContent}>{content}</div>
      <div className={styles.pagination}>
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
    </div>
  );
};

export default Insights;
