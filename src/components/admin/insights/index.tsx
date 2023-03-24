import { useMemo, useState } from 'react';
import { Refresh } from '@mui/icons-material';
import AddCircle from '@mui/icons-material/AddCircle';
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
import DeleteInsight from 'src/components/admin/insights/delete';
import EditInsight from 'src/components/admin/insights/edit';
import InsightRow from 'src/components/admin/insights/row';
import { SearchInput } from 'src/components/shared/input/search';
import { TableEmptyBody } from 'src/components/shared/table';
import useContextInfo from 'src/hooks/use-context-info';
import { useMuiTablePagination } from 'src/hooks/use-pagination';
import useSort from 'src/hooks/use-sort';
import { searchByKeys, sortByKey } from 'src/logic/libs/helpers';
import { selectAllInsights, useListProjectInsightsByContextQuery } from 'src/slices/insights';
import styles from './index.module.scss';
import baseAdminStyles from 'styles/Admin.module.scss';

const Insights = () => {
  const theme = useTheme();
  const [search, setSearch] = useState('');
  const { column, direction, getCellProps, getSortLabelProps } = useSort<'name' | 'insightDate'>('name');
  const [deleteId, setDeleteId] = useState('');
  const [editId, setEditId] = useState('');

  const contextInfo = useContextInfo();
  const { insights, loading, isFetching, refetch } = useListProjectInsightsByContextQuery(
    { context: contextInfo.adminContext.prettyId as string },
    {
      skip: !contextInfo.adminContext.prettyId,
      selectFromResult: ({ data, isLoading, isUninitialized, isFetching }) => ({
        insights: data && selectAllInsights(data.data),
        loading: isUninitialized || isLoading,
        isFetching,
      }),
    }
  );
  const sortedList = useMemo(() => {
    const list = insights?.slice().sort(sortByKey(column, direction)) ?? [];
    return list && search ? list?.filter(searchByKeys(search, ['name'])) : list;
  }, [insights, column, direction, search]);
  const { sliceArgs, getPaginationProps } = useMuiTablePagination({ total: sortedList.length });
  const paginatedList = useMemo(() => sortedList.slice(...sliceArgs), [sortedList, sliceArgs]);
  return (
    <>
      <h2 id="insights-header">Insights</h2>
      <div className={styles.interactive}>
        <SearchInput
          id="insights-list-search"
          placeholder="Search for an insight"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch('')}
          isSearching={!!search && loading}
        />
        <IconButton sx={{ color: 'white', mr: 'auto' }} onClick={refetch} id="refetch-button">
          {!isFetching ? (
            <Refresh />
          ) : (
            <span className={styles.loaderContainer}>
              <MoonLoader size={18} loading color={theme.palette.primary.main} />
            </span>
          )}
        </IconButton>
        <Button
          variant="outlined"
          id="create-insight-button"
          color="secondary"
          sx={(theme) => ({ ...theme.mixins.adminButton(), ml: 'auto' })}
          startIcon={<AddCircle />}
          onClick={() => setEditId('CREATE')}
        >
          Create insight
        </Button>
      </div>
      {loading ? (
        <div className={baseAdminStyles.loadingWrapper}>
          <MoonLoader loading color={theme.palette.primary.main} />
        </div>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table id="insights-table">
              <TableHead>
                <TableRow>
                  <TableCell align="left" id="insight-name-heading" {...getCellProps('name')}>
                    <TableSortLabel {...getSortLabelProps('name')}>Insight Name</TableSortLabel>
                  </TableCell>
                  <TableCell align="center" id="insight-date-heading" {...getCellProps('insightDate')}>
                    <TableSortLabel {...getSortLabelProps('insightDate')}>Insight Date</TableSortLabel>
                  </TableCell>
                  <TableCell align="left" style={{ width: '14%' }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              {paginatedList?.length ? (
                <TableBody>
                  {paginatedList.map((insight) => (
                    <InsightRow
                      key={insight.id}
                      insight={insight}
                      edit={() => setEditId(insight.id)}
                      delete={() => setDeleteId(insight.id)}
                    />
                  ))}
                </TableBody>
              ) : (
                <TableEmptyBody id="insights-list-empty">No insights found</TableEmptyBody>
              )}
              <TableFooter>
                <TablePagination {...getPaginationProps('insights-list')} />
              </TableFooter>
            </Table>
          </TableContainer>
          <DeleteInsight id={deleteId} open={!!deleteId} onClose={() => setDeleteId('')} />
          <EditInsight id={editId} open={!!editId} onClose={() => setEditId('')} />{' '}
        </>
      )}
    </>
  );
};

export default Insights;
