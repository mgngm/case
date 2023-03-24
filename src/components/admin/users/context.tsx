import type { Dispatch, SetStateAction } from 'react';
import { FormControl, MenuItem, Select, useTheme } from '@mui/material';
import { MoonLoader } from 'react-spinners';
import styles from 'src/components/admin/context.module.scss';
import { useAppSelector } from 'src/hooks';
import { selectAllContexts, useGetUserContextQuery } from 'src/slices/context';
import { selectCurrentUserSub } from 'src/slices/users';

const UserManagementContextSelect = ({
  userManagementContext,
  setUserManagementContext,
}: {
  userManagementContext: string;
  setUserManagementContext: Dispatch<SetStateAction<string>>;
}) => {
  const theme = useTheme();
  const userSub = useAppSelector(selectCurrentUserSub);

  const {
    data: availableContext,
    isFetching,
    isLoading,
  } = useGetUserContextQuery(
    { userSub },
    {
      selectFromResult: ({ isFetching, isLoading, data }) => ({
        isFetching,
        isLoading,
        data: data && selectAllContexts(data),
      }),
    }
  );

  const id = userManagementContext;

  const loading = isFetching || isLoading;

  if (loading) {
    return (
      <div className={styles.contextLoading}>
        <MoonLoader color={theme.palette.primary.main} size={24} />
      </div>
    );
  }

  return (
    <div className={styles.usersOrgWrapper}>
      <FormControl fullWidth className={styles.orgForm}>
        <label className={styles.contextLabel} htmlFor="org-select">
          Context:
        </label>
        <Select
          labelId="org-select-label"
          id="user-org-select"
          MenuProps={{ id: 'user-org-select-menu' }}
          value={id}
          label=""
          onChange={(e) => setUserManagementContext(e.target.value)}
          className={styles.orgSelect}
          sx={{
            color: 'black',
            background: 'white',
            ':hover': { background: 'white', color: 'black' },
          }}
        >
          {availableContext?.map((context) => {
            if (context) {
              const { value, partnerName, name } = context;
              return (
                <MenuItem key={value} value={value} className={styles.contextItem}>
                  <span className={styles.partnerName}>{partnerName}</span>
                  <span>{name}</span>
                </MenuItem>
              );
            }
            return null;
          })}
        </Select>
      </FormControl>
    </div>
  );
};

export default UserManagementContextSelect;
