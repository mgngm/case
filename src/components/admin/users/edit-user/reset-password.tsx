import { useEffect, useState } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import userStyles from 'src/components/admin/users/index.module.scss';
import ButtonLoadingIndicator from 'src/components/shared/button/loader';
import { getErrorMessageFromRTK } from 'src/slices/api';
import { useResetUserMutation } from 'src/slices/users';
import type { LocalUser } from 'src/types/user';

type ResetProps = {
  user: LocalUser;
  onClose: () => void;
  tabValue: number;
};

const ResetPassword = ({ user, onClose, tabValue }: ResetProps) => {
  const [resetUserTrigger, resetUserRes] = useResetUserMutation({
    selectFromResult: ({ isLoading, isSuccess }) => ({ isLoading, isSuccess }),
  });

  const [dialogError, setDialogError] = useState('');

  useEffect(() => {
    setDialogError('');
  }, [tabValue]);

  const handleReset = async () => {
    try {
      await resetUserTrigger({ email: user.email }).unwrap();
      setDialogError('');
    } catch (error) {
      setDialogError(getErrorMessageFromRTK(error as FetchBaseQueryError) || '');
    }
  };

  return (
    <>
      <DialogContent>
        <DialogContentText>Are you sure you want to reset the password for {user.email}?</DialogContentText>
        {resetUserRes.isSuccess && (
          <DialogContentText sx={{ marginTop: '5px', color: '#00a9b4' }}>
            User password has been reset
          </DialogContentText>
        )}
        {dialogError ? <span className={userStyles.deleteUserError}>{dialogError}</span> : null}
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <LoadingButton
          loading={resetUserRes.isLoading}
          loadingIndicator={<ButtonLoadingIndicator />}
          variant="contained"
          onClick={handleReset}
        >
          Confirm
        </LoadingButton>
      </DialogActions>
    </>
  );
};

export default ResetPassword;
