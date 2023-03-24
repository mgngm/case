import { useEffect, useMemo, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { Refresh, AddCircle as AddCircleIcon } from '@mui/icons-material';

import { LoadingButton } from '@mui/lab';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  useTheme,
  Select,
  MenuItem,
  FormControl,
  IconButton,
} from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { MoonLoader } from 'react-spinners';
import contextStyles from 'src/components/admin/context.module.scss';
import styles from 'src/components/admin/report/landing/landing.module.scss';
import ButtonLoadingIndicator from 'src/components/shared/button/loader';
import Input from 'src/components/shared/input';
import { SearchInput } from 'src/components/shared/input/search';
import { TableEmptyBody } from 'src/components/shared/table';
import { AccessLevel } from 'src/graphql';
import type { Report } from 'src/graphql';
import { useAppDispatch, useAppSelector } from 'src/hooks';
import useAutofocus from 'src/hooks/use-autofocus';
import useContextInfo from 'src/hooks/use-context-info';
import useDebouncedValue from 'src/hooks/use-debounced-value';
import { useMuiTablePagination } from 'src/hooks/use-pagination';
import useSort from 'src/hooks/use-sort';
import { deleteReport as deleteReportFn } from 'src/logic/client/cleanup';
import { sortByKey } from 'src/logic/libs/helpers';
import { generateAccessLevelFilter, selectCurrentReportId, useListReportsQuery } from 'src/slices/report';
import { selectUserAccessLevel } from 'src/slices/users';
import ListRow from './list-row';
import baseAdminStyles from 'styles/Admin.module.scss';

type ReportTableProps = {
  setReportCreateOpen: Dispatch<SetStateAction<boolean>>;
};

const ReportList = ({ setReportCreateOpen }: ReportTableProps) => {
  const dispatch = useAppDispatch();
  const {
    column: sortCol,
    direction: sortDir,
    getCellProps,
    getSortLabelProps,
  } = useSort<'reportName' | 'reportDate'>('reportDate', 'desc');
  const accessLevel = useAppSelector(selectUserAccessLevel);
  const theme = useTheme();
  const [deleteReport, setDeleteReport] = useState<Report | null>(null);
  const [confirm, setConfirm] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [dialogError, setDialogError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const currentReportId = useAppSelector(selectCurrentReportId);

  const contextInfo = useContextInfo();

  const autofocusRef = useAutofocus(!!deleteReport);

  const {
    dataFiles = [],
    isLoading,
    refetch,
  } = useListReportsQuery(
    //Filter by access level so you only see the reports you're allowed to see.
    {
      context: contextInfo.adminContext.prettyId as string,
      filter: { or: generateAccessLevelFilter(accessLevel) },
      includeForDeletion: true,
    },
    {
      skip: !contextInfo.adminContext.prettyId,
      selectFromResult: ({ data, isLoading }) => ({ dataFiles: data?.data, isLoading }),
    }
  );

  const [newSelectedReport, setNewSelectedReport] = useState<Report | undefined>(undefined);

  //If we update anything then recalc the next report.
  useEffect(() => {
    const nextReport = dataFiles.find((_dataFile) => _dataFile.id !== currentReportId);
    setNewSelectedReport(nextReport);
  }, [dataFiles, currentReportId, deleteReport]);

  // debounce search input for query, at 500ms if input, or instant if cleared
  const searchFilter = useDebouncedValue(search, 500, { instant: [''] });
  const renderList = useMemo(
    () => [...dataFiles.filter((_df) => _df.reportName?.includes(searchFilter))].sort(sortByKey(sortCol, sortDir)),
    [sortCol, sortDir, dataFiles, searchFilter]
  );

  const { sliceArgs, getPaginationProps } = useMuiTablePagination({ total: renderList.length });
  const paginatedList = useMemo(() => renderList.slice(...sliceArgs), [renderList, sliceArgs]);

  const handleClose = () => {
    setConfirm('');
    setDeleteLoading(false);
    setDeleteReport(null);
    setDialogError(null);
    refetch();
  };

  if (isLoading) {
    return (
      <div className={baseAdminStyles.loadingWrapper}>
        <MoonLoader color={theme.palette.primary.main} />
      </div>
    );
  }

  return (
    <>
      <div id="report-list" className={styles.list}>
        <div id="report-list-title" className={styles.listTitle}>
          <h2>Reports</h2>
          <SearchInput
            id="report-list-search"
            placeholder="Search for a report by name"
            className={styles.search}
            value={search}
            disabled={isLoading}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch('')}
            isSearching={!!search && isLoading}
          />
          <IconButton id="refresh-report-list-button" className={styles.refreshButton} onClick={refetch}>
            {isLoading ? (
              <span className={styles.loadingContainer}>
                <MoonLoader color={theme.palette.primary.main} size={18} />
              </span>
            ) : (
              <Refresh />
            )}
          </IconButton>
          <Button
            id="create-report-button"
            variant="outlined"
            color="secondary"
            sx={(theme) => theme.mixins.adminButton()}
            startIcon={<AddCircleIcon />}
            className={styles.createButton}
            onClick={() => setReportCreateOpen(true)}
          >
            Create new report
          </Button>
        </div>
        <TableContainer component={Paper}>
          <Table id="report-list-table">
            <TableHead>
              <TableRow>
                <TableCell align="left" id="report-name-heading" {...getCellProps('reportName')}>
                  <TableSortLabel {...getSortLabelProps('reportName')}>Report Name</TableSortLabel>
                </TableCell>
                <TableCell align="center" id="report-date-heading" {...getCellProps('reportDate')}>
                  <TableSortLabel {...getSortLabelProps('reportDate')}>Report Date</TableSortLabel>
                </TableCell>
                <TableCell align="center" id="actions-heading" style={{ width: '14%' }}>
                  Actions
                </TableCell>
                {accessLevel !== AccessLevel.ORGANISATION ? (
                  <TableCell align="center" id="access-level-heading" style={{ width: '14%' }}>
                    Access Level
                  </TableCell>
                ) : null}
              </TableRow>
            </TableHead>
            {paginatedList.length ? (
              <TableBody>
                {paginatedList.map((report) => (
                  <ListRow
                    key={report.id}
                    report={report}
                    setDeleteReport={setDeleteReport}
                    disableDeleteReport={renderList.length === 1}
                  />
                ))}
              </TableBody>
            ) : (
              <TableEmptyBody id="reports-list-empty">No reports found for this context</TableEmptyBody>
            )}
            <TableFooter>
              <TableRow>
                <TablePagination {...getPaginationProps('reports-list')} />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </div>

      {deleteReport ? (
        <Dialog open={!!deleteReport} onClose={handleClose}>
          <DialogTitle>Delete Report?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <span>
                Are you sure you want to delete report {deleteReport?.reportName}? This action cannot be undone.
              </span>
              <div className={baseAdminStyles.inputWrapper}>
                <label className={baseAdminStyles.inputLabel} htmlFor="confirm">
                  Type &lsquo;delete&rsquo; to continue
                </label>
                <Input ref={autofocusRef} id="confirm" onChange={(e) => setConfirm(e.target.value)} />
              </div>
            </DialogContentText>
          </DialogContent>
          {deleteReport.id === currentReportId ? (
            <DialogContent>
              <DialogContentText>
                <span>
                  As this is your currently selected report, you will need to select a new report to display afterwards
                </span>
              </DialogContentText>
              <FormControl fullWidth>
                <Select
                  labelId="select-new-report-on-delete-select-label"
                  id="select-new-report-on-delete-select"
                  MenuProps={{ id: 'select-new-report-on-delete-select-menu' }}
                  value={newSelectedReport?.id}
                  onChange={(e) => {
                    const nextReport = dataFiles.find((_df) => _df.id === e.target.value);
                    if (nextReport) {
                      setNewSelectedReport(nextReport);
                    } else {
                      console.error('Error has occurred');
                    }
                  }}
                  className={contextStyles.aeSelect}
                  sx={{
                    color: 'black',
                    background: 'white',
                    marginTop: '1rem',
                    ':hover': { background: 'white', color: 'black' },
                  }}
                >
                  {dataFiles.map((_df) => (
                    <MenuItem
                      key={_df.id}
                      value={_df.id}
                      disabled={_df.id === currentReportId}
                      id={`select-new-report-on-delete-item-${_df.id}`}
                      className={contextStyles.contextItem}
                    >
                      <span className={contextStyles.miniTitle}>{_df.reportDate}</span>
                      <span>{_df.reportName} </span>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {dialogError ? <span className={baseAdminStyles.deleteUserError}>{dialogError}</span> : null}
            </DialogContent>
          ) : null}
          <DialogActions>
            <Button variant="outlined" onClick={handleClose}>
              Cancel
            </Button>
            <LoadingButton
              variant="contained"
              color="error"
              loading={deleteLoading}
              loadingIndicator={<ButtonLoadingIndicator />}
              disabled={confirm !== 'delete'}
              onClick={async () => {
                try {
                  if (deleteReport) {
                    await dispatch(
                      deleteReportFn({
                        report: deleteReport,
                        setLoading: setDeleteLoading,
                        context: contextInfo.adminContext.prettyId as string,
                        setDialogError,
                        newReport:
                          currentReportId === deleteReport.id && newSelectedReport ? newSelectedReport : undefined,
                      })

                      //I'm not gonna do anything on this RIGHT NOW but we can either
                      // a) Set a timeout to refersh the report list (I checked and empty reports take about 30s to delete (lambda getting itself sorted I imagine)
                      // or
                      // b) add a validated poll to keep checking (we already have the row state showing the report will be gone soon.)
                    );
                    handleClose();
                  } else {
                    console.error('No delete report set');
                  }
                } catch (e) {
                  setDialogError(e instanceof Error ? e.message : 'Failed to delete report');
                }
              }}
            >
              Delete
            </LoadingButton>
          </DialogActions>
        </Dialog>
      ) : null}
    </>
  );
};

export default ReportList;
