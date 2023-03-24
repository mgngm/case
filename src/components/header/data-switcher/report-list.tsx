import { memo, useState, useMemo } from 'react';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Radio,
  useTheme,
  ListSubheader,
} from '@mui/material';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { format, parse } from 'date-fns';
import { MoonLoader } from 'react-spinners';
import styles from 'src/components/header/header.module.scss';
import type { Report } from 'src/graphql';
import { useAppDispatch } from 'src/hooks';
import useReport from 'src/hooks/use-report';
import { selectNewReport, selectReportDate, setRefReportId } from 'src/slices/report';

type ReportProps = {
  handleClose: () => void;
  reports: Report[];
  reportCounts: Record<string, number>;
  showContext?: boolean;
  filter: string;
  loading: boolean;
  refReport?: boolean;
};

const ReportList = memo(
  ({ handleClose, reports, reportCounts, showContext, loading, filter, refReport }: ReportProps) => {
    const theme = useTheme();
    const dispatch = useAppDispatch();

    const { report, ids } = useReport();

    const reportDate = selectReportDate(report?.data);

    //Figure out starting year month from initial report filename
    let _year = new Date().getFullYear();
    let _month = new Date().getMonth() + 1; //getMonth returns 0-11 but we want not that
    //If we have a slash in the filename, we're in a standardised report <p>/<o>/<d>/report.json
    if (reportDate) {
      try {
        //Get the date off of the report or just use curremt date
        const [__year, __month] = reportDate.split('-') ?? [_year, _month];
        //If we've split properly, set the year and month.
        _year = parseInt(__year);
        _month = parseInt(__month);
      } catch {
        console.error('There was a problem with setting the default report date. Defaulting to Jan 22');
      }
    }

    const handleSelectReport = async (report: Report) => {
      if (refReport) {
        dispatch(setRefReportId(report.id));
      } else {
        if (report.id !== ids.selectedReportId && report.context) {
          try {
            await dispatch(
              selectNewReport({
                reportId: report.id,
                context: report?.context,
              })
            );
            handleClose();
          } catch (error) {
            console.error(error);
          }
        }
      }
    };

    const [year, setYear] = useState(_year);
    const [month, setMonth] = useState(_month);

    let rhs: JSX.Element | JSX.Element[] = (
      <div className={styles.reportListEmpty}>
        <span>There are no available reports for the given context and dates.</span>
      </div>
    );

    if (loading) {
      rhs = (
        <div className={styles.loadingWrapper}>
          <MoonLoader color={theme.palette.primary.main} size={40} />
        </div>
      );
    }

    //filter our reports by date and filter (if we want we can remove the double query in the parent component here and filter ALL reports by context? food for thought)
    const renderList = useMemo(() => {
      const _filterMonth = month < 10 ? `0${month}` : `${month}`;
      const predicate = `${year}-${_filterMonth}`;

      return reports.filter((_report) => {
        const dateValid = _report.reportDate?.includes(predicate);
        //If we have a filter set, that's the main one (but still filtered by date)
        if (filter !== '') {
          return (
            dateValid &&
            _report.reportName?.toLocaleLowerCase().includes(filter.toLocaleLowerCase()) &&
            _report.reportDate?.includes(predicate)
          );
        }

        return dateValid;
      });
    }, [year, month, reports, filter]);

    if (!loading && renderList.length > 0) {
      rhs = (
        <List className={styles.reportList}>
          <ListSubheader>{format(parse(`${year}-${month}`, 'yyyy-M', new Date()), 'MMMM yyyy')}</ListSubheader>
          {renderList.map((_dataFile: Report) => {
            const selected = ids.selectedReportId === _dataFile.id || (refReport && ids.refReportId === _dataFile.id);
            const labelId = `checkbox-list-label-${_dataFile.s3Key}`;
            return (
              <ListItem
                key={`${_dataFile.reportDate}-${_dataFile.reportName}-${_dataFile.id}`}
                id={`list-item-${_dataFile.id}`}
                disablePadding
              >
                <ListItemButton role={undefined} dense onClick={() => handleSelectReport(_dataFile)}>
                  <ListItemIcon>
                    <Radio
                      edge="start"
                      checked={selected}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ 'aria-labelledby': labelId }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={showContext ? `${_dataFile.reportName} (${_dataFile.context})` : _dataFile.reportName}
                    secondary={_dataFile.reportDate}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      );
    }

    return (
      <div className={styles.reportPickerWrapper}>
        <div className={styles.reportPickerContent}>
          <div className={styles.datePicker}>
            <FormControl className={styles.datePickerInput}>
              <span className={styles.selectLabel} id="year-label">
                Year:
              </span>
              <Select
                labelId="year-select-label"
                id="report-select-year-dropdown"
                MenuProps={{ id: 'report-select-year-menu' }}
                value={year}
                label=""
                onChange={(e) => setYear(e.target.value as number)}
                className={styles.yearSelect}
              >
                {/* remind me to do this in 10 years. lol. */}
                {Array.from({ length: 10 }, (_, i) => i + 2022).map((year) => (
                  <MenuItem key={year} value={year} id={`year-value-${year}`}>
                    {`${year}`} <span className={styles.fileCount}>({reportCounts[year] ?? 0})</span>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl className={styles.datePickerInput}>
              <span className={styles.selectLabel} id="month-label">
                Month:
              </span>
              <Select
                labelId="month-select-label"
                id="report-select-month-dropdown"
                MenuProps={{ id: 'report-select-month-menu' }}
                value={month}
                label=""
                onChange={(e) => setMonth(e.target.value as number)}
                className={styles.yearSelect}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => (
                  <MenuItem key={month} value={month} className={styles.yearSelectMenuItem} id={`month-value-${month}`}>
                    {`${month}`}{' '}
                    <span className={styles.fileCount}>
                      ({reportCounts[`${year}-${month < 10 ? `0${month}` : month}`] ?? 0})
                    </span>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          {rhs}
        </div>
      </div>
    );
  }
);

ReportList.displayName = 'ReportList';

export default ReportList;
