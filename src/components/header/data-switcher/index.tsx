import type { SyntheticEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { Alert } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import styles from 'src/components/header/header.module.scss';
import ActualInput from 'src/components/shared/input';
import { a11yProps, TabPanel } from 'src/components/shared/tabs';
import { AccessLevel } from 'src/graphql';
import type { Report } from 'src/graphql';
import { useAppDispatch, useAppSelector } from 'src/hooks';
import useContextInfo from 'src/hooks/use-context-info';

import useReport from 'src/hooks/use-report';
import { selectReportSelectorOpenState, reportSelectorOpenStateChanged } from 'src/slices/dashboard';
import {
  useListReportsQuery,
  useListAllReportsQuery,
  generateAccessLevelFilter,
  selectReportName,
} from 'src/slices/report';
import { selectUserAccessLevel } from 'src/slices/users';
import Context from './context';
import ReportList from './report-list';

/**
 * Takes a list of reports from DDB and counts how many reports for each year and for each month (for dropdowns)
 * @param files {Report[]} - list of reports
 * @returns - Object of dates and how many files in that month and/or year e.g. { 2022: 5, 2022-01: 3, 2022-02: 2}
 */
const countFiles = (files: Report[]) => {
  const _fileCounts: Record<string, number> = {};

  //Count through each file
  for (const _file of files) {
    //Get the year and month the report belongs to.
    const [__year, __month] = _file.reportDate?.split('-') ?? [2020, 1];
    //Make sure we have both
    if (__year && __month) {
      //Add one to the year count (or set it to 1 if this is the first one we've found)
      _fileCounts[__year] = _fileCounts[__year] ? _fileCounts[__year] + 1 : 1;

      //Add one to the month count (or set it to 1 if this is the first one we've found)
      _fileCounts[`${__year}-${__month}`] = _fileCounts[`${__year}-${__month}`]
        ? _fileCounts[`${__year}-${__month}`] + 1
        : 1;
    }
  }

  return _fileCounts;
};

function DataSwitcher() {
  const { report, refReport } = useReport();

  const reportName = selectReportName(report?.data);

  const reportSelectorOpenState = useAppSelector(selectReportSelectorOpenState);
  const dispatch = useAppDispatch();
  const [value, setValue] = useState(0);
  const [filter, setFilter] = useState('');

  const accessLevel = useAppSelector(selectUserAccessLevel);

  const handleOpen = () => {
    dispatch(reportSelectorOpenStateChanged(true));
  };

  const handleClose = () => {
    dispatch(reportSelectorOpenStateChanged(false));
  };

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setFilter('');
    setValue(newValue);
  };

  const contextInfo = useContextInfo();

  //We now list all reports and do the filtering on the client (for file counts etc.)
  const {
    contextualDataFiles = [],
    isLoading,
    refetch: refetchList,
  } = useListReportsQuery(
    {
      context: contextInfo.reportContext.prettyId as string,
      filter: {
        //Filter by access level so you only see the reports you're allowed to see.
        or: generateAccessLevelFilter(accessLevel),
      },
    },
    {
      skip: !contextInfo.reportContext.prettyId,
      selectFromResult: ({ data, isLoading }) => ({ contextualDataFiles: data?.data, isLoading }),
    }
  );

  const unselectedContextualFiles = useMemo(
    () => contextualDataFiles.filter((_cf) => report?.data?.id && _cf.id !== report?.data?.id),
    [contextualDataFiles, report?.data?.id]
  );

  //Get all the global reports and send them to the component
  const {
    globalDataFiles = [],
    isGlobalLoading,
    refetch: refetchAll,
  } = useListAllReportsQuery(
    { includeUnPublished: false },
    {
      selectFromResult: ({ data, isLoading }) => ({ globalDataFiles: data?.data, isGlobalLoading: isLoading }),
    }
  );

  //Get file counts
  const globalFileCounts = useMemo(() => countFiles(globalDataFiles), [globalDataFiles]);
  const contextualFileCounts = useMemo(() => countFiles(contextualDataFiles), [contextualDataFiles]);
  const unselectedFileCounts = useMemo(() => countFiles(unselectedContextualFiles), [unselectedContextualFiles]);

  useEffect(() => {
    if (reportSelectorOpenState && contextInfo.reportContext.prettyId) {
      refetchAll();
      refetchList();
    }
    //eslint-disable-next-line
  }, [reportSelectorOpenState, contextInfo.reportContext.prettyId]);

  return (
    <Dialog open={reportSelectorOpenState} onClose={handleClose} scroll="body" id="report-picker-dialog">
      <DialogTitle
        component="div"
        sx={{
          width: '600px',
        }}
      >
        <span id="currently-selected-label" className={styles.subsectionHeader}>
          Currently selected report
        </span>
        <div className={styles.subSectionSubtitle} id="currently-selected-report">
          {reportName || 'No report currently selected'}
        </div>
      </DialogTitle>
      <Tabs value={value} onChange={handleChange} aria-label="data-switcher-tabs" className={styles.tabContainer}>
        <Tab label="Change report" {...a11yProps('switch-context')} sx={{ color: 'black' }} />
        <Tab label="Compare report" {...a11yProps('switch-ref-report')} sx={{ color: 'black' }} />

        {accessLevel === AccessLevel.GLOBAL ? (
          <Tab label="All reports" {...a11yProps('all-reports')} sx={{ color: 'black' }} />
        ) : null}
      </Tabs>

      <div className={styles.reportsWrapper}>
        <TabPanel padding={0} value={value} index={0} name="switch-context">
          <DialogContent sx={{ pt: 0 }}>
            <div className={styles.subSectionContent}>
              <Context />
            </div>
          </DialogContent>
          <DialogContent>
            <span className={styles.subsectionHeader}>Reports by date</span>
            <ReportList
              handleClose={handleClose}
              reports={contextualDataFiles}
              reportCounts={contextualFileCounts}
              loading={isLoading}
              filter={''}
            />
          </DialogContent>
        </TabPanel>

        <TabPanel value={value} index={1} padding={0} name={'all-reports'}>
          <DialogContent>
            <p className={styles.refReportTooltip}>
              Compare reports to show changes in key metrics & HX Score to the selected report.
            </p>
            <p className={styles.refReportTooltip} id="ref-report-label">
              Comparing selected report with:
            </p>
            <div className={styles.refReportName}>
              <ActualInput
                id="global-report-filter"
                type="text"
                value={refReport?.data?.reportName || 'N/A'}
                disabled={true}
                placeholder="Current Reference Report..."
              />
            </div>
            <Alert severity="info" sx={{ alignItems: 'center' }}>
              When you select a new report, the preceding report is automatically selected for comparison, if available.
            </Alert>
          </DialogContent>

          <DialogContent>
            <span className={styles.subsectionHeader}>Compare report with</span>
            <ReportList
              handleClose={handleClose}
              reports={unselectedContextualFiles}
              reportCounts={unselectedFileCounts}
              loading={isLoading}
              filter={''}
              refReport={true}
            />
          </DialogContent>
        </TabPanel>

        <TabPanel value={value} index={2} padding={0} name={'all-reports'}>
          <DialogContent>
            <div className={styles.filterInput}>
              <ActualInput
                id="global-report-filter"
                type="text"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Filter available reports..."
              />
            </div>
          </DialogContent>
          <DialogContent>
            <span className={styles.subsectionHeader}>All Reports by date</span>
            <ReportList
              handleClose={handleClose}
              reports={globalDataFiles}
              reportCounts={globalFileCounts}
              loading={isGlobalLoading}
              showContext={true}
              filter={filter}
            />
          </DialogContent>
        </TabPanel>
      </div>

      <DialogActions className={styles.actions}>
        <Button variant="outlined" onClick={handleClose} id="report-picker-close-button">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DataSwitcher;
