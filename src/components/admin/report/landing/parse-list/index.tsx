import { useMemo, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { Refresh } from '@mui/icons-material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import {
  Button,
  IconButton,
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
} from '@mui/material';
import { MoonLoader } from 'react-spinners';
import styles from 'src/components/admin/report/landing/landing.module.scss';
import { SearchInput } from 'src/components/shared/input/search';
import { TableEmptyBody } from 'src/components/shared/table';
import type { Parse } from 'src/graphql';
import { ReportStatus } from 'src/graphql';
import { useAppSelector } from 'src/hooks';
import useContextInfo from 'src/hooks/use-context-info';
import { useMuiTablePagination } from 'src/hooks/use-pagination';
import useSort from 'src/hooks/use-sort';
import { sortByKey } from 'src/logic/libs/helpers';
import { generateAccessLevelFilter, useListParseResultsQuery, useListReportsQuery } from 'src/slices/report';
import { selectUserAccessLevel } from 'src/slices/users';
import ListRow from './list-row';
import ParseWarningDialog from './warning-dialog';

type ParseTableProps = {
  setReportCreateOpen: Dispatch<SetStateAction<boolean>>;
};

const ParseList = ({ setReportCreateOpen }: ParseTableProps) => {
  const contextInfo = useContextInfo();
  const theme = useTheme();
  const [search, setSearch] = useState('');
  const [parseForWarningDialog, setParseForWarningDialog] = useState<Parse | null>(null);

  const {
    parses = [],
    isFetching,
    refetch,
  } = useListParseResultsQuery(
    { context: contextInfo.adminContext.prettyId as string },
    {
      skip: !contextInfo.adminContext.prettyId,
      selectFromResult: ({ data, isFetching }) => ({ parses: data?.data, isFetching }),
    }
  );

  const accessLevel = useAppSelector(selectUserAccessLevel);

  const { dataFiles = [] } = useListReportsQuery(
    //Filter by access level so you only see the reports you're allowed to see.
    {
      context: contextInfo.adminContext.prettyId as string,
      filter: { or: generateAccessLevelFilter(accessLevel) },
      includeUnpublished: true,
    },
    {
      skip: !contextInfo.adminContext.prettyId,
      selectFromResult: ({ data }) => ({ dataFiles: data?.data }),
    }
  );

  const {
    column: sortCol,
    direction: sortDir,
    getCellProps,
    getSortLabelProps,
  } = useSort<'id' | 'status' | 'startDateTime' | 'parseReportId'>('startDateTime', 'desc'); //Hmm can we get sortByKey to search for a nested key? :thinking:

  const { availableReportIds, reportMeta } = useMemo(() => {
    const reportMeta: Record<string, Record<string, string | ReportStatus>> = {}; //report meta we need for the parses.

    for (const _report of dataFiles) {
      const id: string = _report.id;
      if (id) {
        reportMeta[id] = {
          name: _report.reportName ?? id,
          status: _report.reportStatus ?? ReportStatus.PROCESSING, //we dont use PROCESSING anywhere else so this could be useful to see if something is broken or not.
        }; //fallback to raw id if it doesn't have a name.
      }
    }

    return { availableReportIds: Object.keys(reportMeta), reportMeta };
  }, [dataFiles]);

  //We don't have access levels on our parse IDS, so we should get the reports we are allowed to view, and only show parses that map to those reports.

  const renderList = useMemo(
    () =>
      parses
        .filter(
          (_parse) =>
            _parse?.parseReportId && availableReportIds.includes(_parse?.parseReportId) && _parse?.id.includes(search)
        )
        .sort(sortByKey(sortCol, sortDir)),
    [sortCol, sortDir, parses, availableReportIds, search]
  );

  const { sliceArgs, getPaginationProps } = useMuiTablePagination({ total: renderList.length });
  const paginatedList = useMemo(() => renderList.slice(...sliceArgs), [renderList, sliceArgs]);

  return (
    <div id="parse-list" className={styles.list}>
      <div id="parse-list-title" className={styles.listTitle}>
        <h2>Parses</h2>
        <SearchInput
          id="parse-list-search"
          placeholder="Search for a parse by id"
          className={styles.search}
          value={search}
          disabled={isFetching}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch('')}
          isSearching={!!search && isFetching}
        />
        <IconButton id="refresh-prase-list-button" className={styles.refreshButton} onClick={refetch}>
          {isFetching ? (
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
        <Table id="parse-list-table">
          <TableHead>
            <TableRow>
              <TableCell align="left" id="parse-start-date-heading" {...getCellProps('id')}>
                <TableSortLabel {...getSortLabelProps('id')}>Parse ID</TableSortLabel>
              </TableCell>
              <TableCell align="center" id="parse-start-date-heading" {...getCellProps('startDateTime')}>
                <TableSortLabel {...getSortLabelProps('startDateTime')}>Parse Start Time</TableSortLabel>
              </TableCell>
              <TableCell align="left" id="parse-report-name-heading">
                Parse Report Name
              </TableCell>
              <TableCell align="left" id="parse-report-status-heading">
                Parse Report Status
              </TableCell>
              <TableCell align="center" id="parse-status-heading" {...getCellProps('status')}>
                <TableSortLabel {...getSortLabelProps('status')}>Parse Status</TableSortLabel>
              </TableCell>
              <TableCell align="center" id="actions-heading" style={{ width: '14%' }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          {paginatedList.length ? (
            <TableBody>
              {paginatedList.map((_parse) => (
                <ListRow
                  key={_parse.id}
                  parse={_parse}
                  reportMeta={reportMeta}
                  setParseForWarningDialog={setParseForWarningDialog}
                />
              ))}
            </TableBody>
          ) : (
            <TableEmptyBody id="parse-list-empty">No parses found for this context</TableEmptyBody>
          )}
          <TableFooter>
            <TableRow>
              <TablePagination {...getPaginationProps('parse-list')} />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>

      <ParseWarningDialog parse={parseForWarningDialog} setParse={setParseForWarningDialog} />
    </div>
  );
};

export default ParseList;
