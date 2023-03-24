import { useState, useMemo } from 'react';
import { Refresh } from '@mui/icons-material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import {
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
import Button from '@mui/material/Button';
import { MoonLoader } from 'react-spinners';
import UserManagementContextSelect from 'src/components/admin/users/context';
import CreateUserDialog from 'src/components/admin/users/create';
import { SearchInput } from 'src/components/shared/input/search';
import { TableEmptyBody } from 'src/components/shared/table';
import { useAppSelector } from 'src/hooks';
import { useMuiTablePagination } from 'src/hooks/use-pagination';
import useSort from 'src/hooks/use-sort';
import { searchByKeys, sortByKey } from 'src/logic/libs/helpers';
import { selectAdminContextId, selectPrettyId, useGetUserContextQuery } from 'src/slices/context';
import { selectCurrentUserSub, useGetUsersQuery } from 'src/slices/users';
import userStyles from './index.module.scss';
import ListRow from './list-row';
import baseAdminStyles from 'styles/Admin.module.scss';

const UsersList = () => {
  const [search, setSearch] = useState('');
  const { column: sortCol, direction: sortDir, getCellProps, getSortLabelProps } = useSort<'email'>('email');
  const theme = useTheme();
  const [createUserOpen, setCreateUserOpen] = useState(false);
  const adminContextId = useAppSelector(selectAdminContextId);

  const [userManagementContext, setUserManagementContext] = useState(adminContextId);

  const userSub = useAppSelector(selectCurrentUserSub);
  const { prettyId } = useGetUserContextQuery(
    { userSub },
    {
      selectFromResult: ({ data }) => ({ prettyId: selectPrettyId(data, userManagementContext) }),
    }
  );

  const { isLoading, isUninitialized, isFetching, users, refetch } = useGetUsersQuery(
    { context: prettyId as string },
    {
      skip: !prettyId,
      //eslint-disable-next-line
      selectFromResult: ({ isLoading, isError, isFetching, isUninitialized, data }) => ({
        isLoading,
        isError,
        isFetching,
        isUninitialized,
        users: data,
      }),
    }
  );

  //Re-sort newly added data if the users list updates (add a new user, cosmic event etc.)
  const renderList = useMemo(() => {
    let sortedList = users ? [...users].sort(sortByKey(sortCol, sortDir)) : [];

    //Allow user to filter by email or role (searching for 'basic' returns basic users AND people with basic@... in their user etc.)
    if (search !== '') {
      sortedList = sortedList.filter(searchByKeys(search, ['email']));
    }
    return sortedList;
  }, [users, sortDir, search, sortCol]);

  const { sliceArgs, getPaginationProps } = useMuiTablePagination({ total: renderList.length });
  const paginatedList = useMemo(() => renderList.slice(...sliceArgs), [renderList, sliceArgs]);

  const loading = isLoading || isUninitialized;

  const listContent = loading ? (
    <div className={baseAdminStyles.loadingWrapper}>
      <MoonLoader color={theme.palette.primary.main} />
    </div>
  ) : (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell id="user-email-heading" align="left" {...getCellProps('email')}>
              <TableSortLabel {...getSortLabelProps('email')}>Email</TableSortLabel>
            </TableCell>
            <TableCell align="left" id="actions-heading">
              Actions
            </TableCell>
            <TableCell align="center" id="admin-heading">
              Admin
            </TableCell>
            <TableCell align="center" id="sso-heading">
              SSO
            </TableCell>
          </TableRow>
        </TableHead>
        {paginatedList.length ? (
          <TableBody>
            {paginatedList.map((user) => (
              <ListRow key={user.userSub} user={user} userManagementContext={prettyId as string} />
            ))}
          </TableBody>
        ) : (
          <TableEmptyBody id="users-list-empty">No users found</TableEmptyBody>
        )}
        <TableFooter>
          <TableRow>
            <TablePagination {...getPaginationProps('users-list')} />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );

  return (
    <>
      <UserManagementContextSelect
        userManagementContext={userManagementContext}
        setUserManagementContext={setUserManagementContext}
      />
      <div className={userStyles.preTable}>
        <SearchInput
          id="user-list-search"
          placeholder="Search for a user in this context"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch('')}
          isSearching={!!search && (isFetching || isLoading)}
        />
        <IconButton sx={{ color: 'white', ml: 1 }} className={userStyles.refreshButton} onClick={refetch}>
          {isFetching ? (
            <span className={userStyles.loadingContainer}>
              <MoonLoader size={18} color={theme.palette.primary.main} />
            </span>
          ) : (
            <Refresh />
          )}
        </IconButton>
        <Button
          id="create-user-button"
          variant="outlined"
          color="secondary"
          sx={(theme) => ({ ...theme.mixins.adminButton(), ml: 'auto' })}
          startIcon={<AddCircleIcon />}
          onClick={() => setCreateUserOpen(true)}
        >
          Add user
        </Button>
        <CreateUserDialog
          open={createUserOpen}
          onClose={() => setCreateUserOpen(false)}
          userManagementContext={prettyId as string}
        />
      </div>
      <div className={userStyles.usersList}>{listContent}</div>
    </>
  );
};

export default UsersList;
