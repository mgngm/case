import { FormControl, MenuItem, Select } from '@mui/material';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { DISABLED_CONTEXT_SWITCH_ROUTES } from 'src/constants/admin';
import { CONTEXT_LOADING } from 'src/constants/display';
import { useAppDispatch, useAppSelector } from 'src/hooks';
import {
  selectAdminContextId,
  selectAvailableOrgLevelContexts,
  setAdminContext,
  useGetUserContextQuery,
} from 'src/slices/context';
import { selectCurrentUserSub } from 'src/slices/users';
import styles from './context.module.scss';

const AdminContextSelect = () => {
  const dispatch = useAppDispatch();
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
        data: data && selectAvailableOrgLevelContexts(data),
      }),
    }
  );
  const id = useAppSelector(selectAdminContextId);

  const loading = isFetching || isLoading;
  const router = useRouter();
  const disabled = DISABLED_CONTEXT_SWITCH_ROUTES.includes(router.pathname);

  return (
    <div className={styles.orgWrapper}>
      <FormControl fullWidth className={styles.orgForm} disabled={disabled}>
        <label className={clsx(styles.contextLabel, disabled && styles.labelDisabled)} htmlFor="org-select">
          Organisation:
        </label>
        <Select
          labelId="org-select-label"
          id="org-select"
          MenuProps={{ id: 'org-select-menu' }}
          value={loading ? CONTEXT_LOADING : id}
          disabled={disabled}
          label=""
          onChange={(e) => dispatch(setAdminContext(e.target.value))}
          className={styles.orgSelect}
          sx={{
            color: 'black',
            background: 'white',
            ':hover': { background: 'white', color: 'black' },
          }}
        >
          {loading ? (
            <MenuItem value={CONTEXT_LOADING} className={styles.contextItem}>
              <span className={styles.partnerName}>N/A</span>
              <span>Loading...</span>
            </MenuItem>
          ) : (
            availableContext?.map((context) => {
              if (context) {
                const { value, partnerName, name } = context;
                return (
                  <MenuItem key={value} value={value} id={`admin-context-list-${value}`} className={styles.contextItem}>
                    <span className={styles.partnerName}>{partnerName}</span>
                    <span>{name}</span>
                  </MenuItem>
                );
              }
              return null;
            })
          )}
        </Select>
      </FormControl>
    </div>
  );
};

export default AdminContextSelect;
