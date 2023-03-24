import { useMemo } from 'react';
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
} from '@mui/material';
import { TableEmptyBody } from 'src/components/shared/table';
import type { Partner } from 'src/graphql';
import { useAppSelector } from 'src/hooks';
import { useMuiTablePagination } from 'src/hooks/use-pagination';
import useSort from 'src/hooks/use-sort';
import { sortByKey } from 'src/logic/libs/helpers';
import { selectOrgsForPartner, useGetUserContextQuery } from 'src/slices/context';
import { selectCurrentUserSub } from 'src/slices/users';
import OrganisationRow from './organisation-row';

type OrganisationsProps = {
  partner: Partner;
};

const Organisations = ({ partner }: OrganisationsProps) => {
  const {
    column: sortCol,
    direction: sortDir,
    getCellProps,
    getSortLabelProps,
  } = useSort<'organisationName' | 'organisationId'>('organisationId');

  const userSub = useAppSelector(selectCurrentUserSub);

  const { data: availableOrgs } = useGetUserContextQuery(
    { userSub },
    {
      selectFromResult: ({ data }) => ({
        data: data && selectOrgsForPartner(data, partner.id),
      }),
    }
  );

  const renderList = useMemo(
    () => availableOrgs?.slice().sort(sortByKey(sortCol, sortDir)) ?? [],
    [availableOrgs, sortCol, sortDir]
  );

  const { sliceArgs, getPaginationProps } = useMuiTablePagination({ total: renderList.length });
  const paginatedList = useMemo(() => renderList.slice(...sliceArgs), [renderList, sliceArgs]);

  return (
    <TableContainer component={Paper}>
      <Table id={`org-list-table-${partner.id}`}>
        <TableHead>
          <TableRow>
            <TableCell id="org-id-heading" align="left" {...getCellProps('organisationId')}>
              <TableSortLabel {...getSortLabelProps('organisationId')}>Org ID</TableSortLabel>
            </TableCell>
            <TableCell id="org-name-heading" align="left" {...getCellProps('organisationName')}>
              <TableSortLabel {...getSortLabelProps('organisationName')}>Org Name</TableSortLabel>
            </TableCell>
            <TableCell id="actions-heading" style={{ width: '14%' }}></TableCell>
          </TableRow>
        </TableHead>
        {paginatedList.length ? (
          <TableBody>
            {paginatedList.map((organisation) => (
              <OrganisationRow organisation={organisation} key={organisation.id} />
            ))}
          </TableBody>
        ) : (
          <TableEmptyBody id="organisations-list-empty">No organisations found</TableEmptyBody>
        )}
        <TableFooter>
          <TableRow>
            <TablePagination {...getPaginationProps('organisations-list-pagination')} />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

export default Organisations;
