import { FormControl, MenuItem, Select, useTheme } from '@mui/material';
import { MoonLoader } from 'react-spinners';
import styles from 'src/components/admin/context.module.scss';
import { CONTEXT_NOT_AVAILABLE } from 'src/constants/display';
import { useAppDispatch, useAppSelector } from 'src/hooks';
import {
  selectReportContextId,
  selectAvailableOrgLevelContexts,
  setReportContext,
  useGetUserContextQuery,
} from 'src/slices/context';
import { selectCurrentUserSub } from 'src/slices/users';

const ReportContextSelect = () => {
  const dispatch = useAppDispatch();
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
        data: data && selectAvailableOrgLevelContexts(data),
      }),
    }
  );

  const id = useAppSelector(selectReportContextId);
  const loading = isLoading || isFetching;

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <MoonLoader color={theme.palette.primary.main} size={24} />
      </div>
    );
  }

  const na = availableContext?.length === 0;
  return (
    <div className={styles.orgWrapperFullWidth}>
      <FormControl className={styles.orgForm} sx={{ width: '100%' }}>
        <Select
          labelId="report-select-context-label"
          id="report-select-context-dropdown"
          MenuProps={{ id: 'report-select-context-menu' }}
          value={na ? CONTEXT_NOT_AVAILABLE : id}
          disabled={loading}
          label=""
          onChange={(e) => dispatch(setReportContext(e.target.value))}
          className={styles.orgSelectFullWidth}
          sx={{
            color: 'black',
            background: 'white',
            ':hover': { background: 'white', color: 'black' },
          }}
        >
          {na ? (
            <MenuItem value={CONTEXT_NOT_AVAILABLE} className={styles.contextItem}>
              <span className={styles.partnerName}>N/A</span>
              <span>{CONTEXT_NOT_AVAILABLE}</span>
            </MenuItem>
          ) : (
            availableContext?.map((context) => {
              if (context) {
                const { value, partnerName, name } = context;
                return (
                  <MenuItem
                    key={value}
                    value={value}
                    id={`report-picker-context-list-${value}`}
                    className={styles.contextItem}
                  >
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

export default ReportContextSelect;
