/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { useMemo, useRef } from 'react';
import { Visibility, VisibilityOutlined } from '@mui/icons-material';
import { Icon, TablePagination, TableSortLabel, useTheme } from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import useResizeObserver from '@react-hook/resize-observer';
import type { Dictionary } from '@reduxjs/toolkit';
import clsx from 'clsx';
import throttle from 'lodash/throttle';
import { MoonLoader } from 'react-spinners';
import { ButtonRow } from 'src/components/shared/table';
import { STATUS_SORT_ORDER } from 'src/constants/display';
import { DEFAULT_CURRENCY } from 'src/constants/report';
import type { Project } from 'src/graphql';
import { ProjectStatus } from 'src/graphql';
import useBreakpoint from 'src/hooks/use-breakpoint';
import { useMuiTablePagination } from 'src/hooks/use-pagination';
import useSort from 'src/hooks/use-sort';
import { constructValueDisplayString, sortByKey } from 'src/logic/libs/helpers';
import type { KeysMatching } from 'src/types/util';
import styles from './table.module.scss';

export enum ImprovementStatus {
  COMPLETED = 'Completed',
  ON_HOLD = 'On hold',
  IN_PROGRESS = 'In progress',
  NOT_STARTED = 'New',
  ARCHIVED = 'Archived',
}

export enum ImprovementType {
  APPLICATION = 'Application',
  NETWORK_REMOTE = 'Network (Remote)',
  NETWORK_OFFICE = 'Network (Office)',
  WIDER_NETWORK = 'Wider Network',
}

const Row = ({
  row,
  reportCurrency,
  selected,
  onDetails,
}: {
  row: Project;
  reportCurrency: string;
  selected?: boolean;
  onDetails: () => void;
}) => {
  const largerThanMd = useBreakpoint('md');

  return (
    <TableRow component={ButtonRow} className={styles.listRow} hover selected={selected} onClick={onDetails}>
      <TableCell className={styles.sticky__rowRight} sx={{ position: 'sticky', left: 0 }} align="left">
        <div className={styles.improvementNameCell}>
          <div className={styles.rowControl}>
            <Icon sx={{ verticalAlign: 'middle', mr: 1 }}>{selected ? <Visibility /> : <VisibilityOutlined />}</Icon>
          </div>
          {row.projectName}
        </div>
      </TableCell>
      <TableCell id={`row-project-date-${row.id}`} align="center">
        {row.projectDate}
      </TableCell>
      <TableCell id={`row-project-type-${row.id}`} align="left">
        {ImprovementType[row.projectType!]}
      </TableCell>
      <TableCell id={`row-project-employee-count-${row.id}`} align="right">
        {constructValueDisplayString(row.employeeCount!)}
      </TableCell>
      <TableCell id={`row-project-time-lost-${row.id}`} align="right">
        {constructValueDisplayString(row.timeLost!)}
      </TableCell>
      <TableCell id={`row-project-hxScore-${row.id}`} align="right">
        {constructValueDisplayString(row.hxScore!)}
      </TableCell>
      <TableCell id={`row-project-payroll-${row.id}`} align="right">
        {constructValueDisplayString(row.payroll!, 0, true, reportCurrency)}
      </TableCell>
      <TableCell
        id={`row-project-status-${row.id}`}
        align="left"
        className={largerThanMd ? styles.sticky__rowLeft : ''}
        sx={largerThanMd ? { position: 'sticky', right: 0 } : undefined}
      >
        <span
          className={clsx(styles.statusDot, {
            [styles.completed]: row.projectStatus === ProjectStatus.COMPLETED,
            [styles.archived]: row.projectStatus === ProjectStatus.ARCHIVED,
            [styles.onHold]: row.projectStatus === ProjectStatus.ON_HOLD,
            [styles.inProgress]: row.projectStatus === ProjectStatus.IN_PROGRESS,
            [styles.notStarted]: row.projectStatus === ProjectStatus.NOT_STARTED,
          })}
        />
        {ImprovementStatus[row.projectStatus!]}
      </TableCell>
    </TableRow>
  );
};

const SingleRow = ({ children }: { children: ReactNode }) => (
  <TableRow>
    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
      <div className={styles.tableLoading} style={{ maxWidth: 'var(--width)' }}>
        {children}
      </div>
    </TableCell>
  </TableRow>
);

const Improvements = ({
  projects,
  refProjects,
  currency = DEFAULT_CURRENCY,
  isFetching,
  isLoading,
  isUninitialized,
  detailsProject,
  setDetailsProject,
}: {
  projects: Project[] | undefined;
  refProjects: Dictionary<Project> | undefined;
  currency?: string;
  isFetching: boolean;
  isLoading: boolean;
  isUninitialized: boolean;
  detailsProject: string;
  setDetailsProject: Dispatch<SetStateAction<string>>;
}) => {
  const theme = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  useResizeObserver(
    containerRef,
    throttle(() => {
      containerRef.current?.style.setProperty('--width', `${containerRef.current.clientWidth}px`);
    }, 500)
  );

  const { column, direction, getCellProps, getSortLabelProps } = useSort<
    KeysMatching<Project, string | number | null | undefined> | undefined
  >(undefined);

  const sortedProjects = useMemo(
    () =>
      column
        ? projects?.slice().sort(
            sortByKey(column, direction, {
              projectStatus: (dir) => {
                const lastStatus = STATUS_SORT_ORDER.at(-1)!;
                return (a, b) => {
                  const n =
                    STATUS_SORT_ORDER.indexOf(a.projectStatus ?? lastStatus) -
                    STATUS_SORT_ORDER.indexOf(b.projectStatus ?? lastStatus);
                  return dir === 'asc' ? n : -n;
                };
              },
            })
          )
        : projects,
    [projects, column, direction]
  );

  const { sliceArgs, getPaginationProps } = useMuiTablePagination({ total: projects?.length ?? 0 });

  const paginatedList = useMemo(
    () => (sortedProjects ? sortedProjects.slice(...sliceArgs) : []),
    [sortedProjects, sliceArgs]
  );

  const largerThanMd = useBreakpoint('md');

  let loadingRow = null;
  let emptyRow = null;
  let dataRows = null;
  let errorRow = null;

  // for everything to work size-wise we need to render the table so the width gets
  // set, which means all the messages have to be part of the table, rather than
  // a different element
  if (isFetching && isLoading && !isUninitialized) {
    loadingRow = (
      <SingleRow>
        <MoonLoader size={30} color={theme.palette.primary.main} />
      </SingleRow>
    );
  } else if (!projects || projects.length === 0) {
    emptyRow = (
      <SingleRow>
        <p>No improvements available</p>
      </SingleRow>
    );
  } else if (paginatedList && paginatedList?.length > 0) {
    dataRows = paginatedList.map((row) => (
      <Row
        key={`${row.id}`}
        row={row}
        reportCurrency={currency}
        selected={row.id === detailsProject}
        onDetails={() => setDetailsProject(row.id)}
      />
    ));
  } else {
    errorRow = (
      <SingleRow>
        <p>Error: could not fetch improvements</p>
      </SingleRow>
    );
  }

  return (
    <>
      <TableContainer
        className={clsx([styles.tableContainer, (!!loadingRow || !!emptyRow || !!errorRow) && 'lock-scroll-loading'])}
        component={Paper}
        ref={containerRef}
      >
        <Table sx={{ minWidth: 650 }} aria-label="simple table" id="improvements-table">
          <TableHead>
            <TableRow>
              <TableCell
                align="left"
                sx={{ position: 'sticky', left: 0 }}
                className={clsx(styles.nameColumn, styles.headerRow, styles.sticky__headerRight)}
                {...getCellProps('projectName')}
              >
                <TableSortLabel {...getSortLabelProps('projectName')}>Improvement name</TableSortLabel>
              </TableCell>
              <TableCell
                align="center"
                className={clsx(styles.dateColumn, styles.headerRow)}
                {...getCellProps('projectDate')}
              >
                <TableSortLabel {...getSortLabelProps('projectDate')}>Date identified</TableSortLabel>
              </TableCell>
              <TableCell
                align="left"
                className={clsx(styles.improvementColumn, styles.headerRow)}
                {...getCellProps('projectType')}
              >
                <TableSortLabel {...getSortLabelProps('projectType')}>Improvement type</TableSortLabel>
              </TableCell>
              <TableCell
                align="right"
                className={clsx(styles.employeesColumn, styles.headerRow)}
                {...getCellProps('employeeCount')}
              >
                <TableSortLabel sx={{ flexDirection: 'row' }} {...getSortLabelProps('employeeCount')}>
                  Employees affected
                </TableSortLabel>
              </TableCell>
              <TableCell
                align="right"
                className={clsx(styles.timeLostColumn, styles.headerRow)}
                {...getCellProps('timeLost')}
              >
                <TableSortLabel sx={{ flexDirection: 'row' }} {...getSortLabelProps('timeLost')}>
                  Average time lost per employee (Days)
                </TableSortLabel>
              </TableCell>
              <TableCell align="right" className={clsx(styles.hxColumn, styles.headerRow)} {...getCellProps('hxScore')}>
                <TableSortLabel sx={{ flexDirection: 'row' }} {...getSortLabelProps('hxScore')}>
                  HX Score
                </TableSortLabel>
              </TableCell>
              <TableCell
                align="right"
                className={clsx(styles.payrollColumn, styles.headerRow)}
                {...getCellProps('payroll')}
              >
                <TableSortLabel sx={{ flexDirection: 'row' }} {...getSortLabelProps('payroll')}>
                  Payroll opportunity up to
                </TableSortLabel>
              </TableCell>
              <TableCell
                className={clsx(styles.statusColumn, styles.headerRow, largerThanMd && styles.sticky__headerLeft)}
                sx={largerThanMd ? { position: 'sticky', right: 0 } : undefined}
                align="left"
                {...getCellProps('projectStatus')}
              >
                <TableSortLabel {...getSortLabelProps('projectStatus')}>Status</TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loadingRow}
            {emptyRow}
            {dataRows}
            {errorRow}
          </TableBody>
        </Table>
      </TableContainer>
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
    </>
  );
};

export default Improvements;
