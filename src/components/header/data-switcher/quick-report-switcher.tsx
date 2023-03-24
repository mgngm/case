import { useCallback, useMemo } from 'react';
import type { SelectChangeEvent } from '@mui/material';
import { MenuItem, Select } from '@mui/material';
import clsx from 'clsx';
import { useAppDispatch, useAppSelector } from 'src/hooks';
import useContextInfo from 'src/hooks/use-context-info';
import useIsPreview from 'src/hooks/use-is-preview';
import useReport from 'src/hooks/use-report';
import { reportSelectorOpenStateChanged } from 'src/slices/dashboard';
import { generateAccessLevelFilter, selectNewReport, useListReportsQuery } from 'src/slices/report';
import { selectUserAccessLevel } from 'src/slices/users';
import styles from './quick-report-switcher.module.scss';

const OPEN_REPORT_PICKER = 'OPEN_REPORT_PICKER';

const QuickReportPicker = ({ variant = 'dark' }: { variant?: 'dark' | 'light' }) => {
  const isPreview = useIsPreview();
  const { ids } = useReport();
  const selectedReport = ids.selectedReportId;
  const dispatch = useAppDispatch();
  const contextInfo = useContextInfo();
  const accessLevel = useAppSelector(selectUserAccessLevel);

  //We now list all reports and do the filtering on the client (for file counts etc.)
  const { reports = [] } = useListReportsQuery(
    {
      context: contextInfo.reportContext.prettyId as string,
      filter: {
        //Filter by access level so you only see the reports you're allowed to see.
        or: generateAccessLevelFilter(accessLevel),
      },
    },
    {
      skip: !contextInfo.reportContext.prettyId,
      selectFromResult: ({ data }) => ({ reports: data?.data ?? [] }),
    }
  );

  const handleChange = useCallback(
    async (e: SelectChangeEvent) => {
      const id = e.target.value;

      if (id === OPEN_REPORT_PICKER) {
        dispatch(reportSelectorOpenStateChanged(true));
      } else {
        const report = reports.find(({ id: rid }) => rid === id);

        if (report) {
          await dispatch(selectNewReport({ reportId: report.id, context: report.context as string }));
        }
      }
    },
    [dispatch, reports]
  );

  // build a window of 5 reports for display in the switcher
  const reportList = useMemo(() => {
    if (!selectedReport) {
      return null;
    }

    // get the report index from the list
    const reportIndex = reports.findIndex(({ id }) => id === selectedReport);

    if (reportIndex === -1) {
      return null;
    }

    // work out the start and end of the report block window
    // get 2 either side of the report if possible, otherwise pad it out
    let start = Math.max(0, reportIndex - 2);
    let end = Math.min(reports.length - 1, reportIndex + 2);

    if (end - start < 4) {
      if (start === 0) {
        end = Math.min(reports.length - 1, 4);
      } else {
        start = Math.max(0, end - 4);
      }
    }

    return reports.slice(start, end + 1);
  }, [reports, selectedReport]);

  if (isPreview) {
    return <span className={styles.previewPicker}>Report preview</span>;
  }

  if (!selectedReport) {
    return null;
  }

  if (!reportList) {
    return null;
  }

  return (
    <div id="quick-report-picker">
      <Select
        aria-label="quick-report-picker"
        value={selectedReport}
        onChange={handleChange}
        className={clsx([styles.quickReportSwitch, variant === 'light' && styles.lightTheme])}
      >
        {reportList.map(({ id, reportName }) => (
          <MenuItem key={id} value={id}>
            {reportName}
          </MenuItem>
        ))}
        <MenuItem value={OPEN_REPORT_PICKER}>
          <em>Choose another report...</em>
        </MenuItem>
      </Select>
    </div>
  );
};

export default QuickReportPicker;
