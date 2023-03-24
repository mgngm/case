import type { Dispatch, SetStateAction } from 'react';
import { LoadingButton } from '@mui/lab';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import ButtonLoadingIndicator from 'src/components/shared/button/loader';
import { useAppSelector } from 'src/hooks';
import { searchContexts, selectUserContextId, useGetUserContextQuery } from 'src/slices/context';
import { selectCurrentUserSub, selectUserAttribute, useResetUserMutation } from 'src/slices/users';
import type { LocalUser } from 'src/types/user';
import styles from './nav-drawer.module.scss';

export interface DialogProps {
  dialogState: boolean;
  dialogFn: Dispatch<SetStateAction<boolean>>;
  user: LocalUser | undefined;
}

const ProfileModal = ({ dialogState, dialogFn, user }: DialogProps) => {
  const email = user ? (selectUserAttribute(user, 'email') as string) : '';
  const [resetPasswordTrigger, resetPasswordRes] = useResetUserMutation();

  const userSub = useAppSelector(selectCurrentUserSub);
  const userContextId = useAppSelector(selectUserContextId);

  const { data: userContext } = useGetUserContextQuery(
    { userSub },
    {
      selectFromResult: ({ isFetching, isLoading, data }) => ({
        isFetching,
        isLoading,
        data: data && searchContexts(data, userContextId),
      }),
    }
  );

  const title =
    userContext && 'organisationName' in userContext
      ? userContext.organisationName
      : userContext && 'partnerName' in userContext
      ? `${userContext?.partnerName} (Partner Level)`
      : 'N/A';

  const onClose = () => dialogFn(false);

  return (
    <Dialog open={dialogState} onClose={onClose}>
      <DialogTitle className={styles.profileHeader}>Profile</DialogTitle>
      <DialogContent className={styles.profileModal}>
        <p className={styles.modalBold}>Email:</p>
        <p>{email}</p>
        <p className={styles.modalBold}>Context:</p>
        <p>{title}</p>
        {resetPasswordRes.isSuccess ? (
          <Alert severity="success">
            Password reset successfully. The next time you login you will be given instructions on how to reset your
            password.
          </Alert>
        ) : null}
        {resetPasswordRes.isError ? <Alert severity="error">There was an error resetting your password.</Alert> : null}
      </DialogContent>
      <DialogActions className={styles.profileActions}>
        <Button variant="outlined" onClick={onClose}>
          Close
        </Button>
        <LoadingButton
          loading={resetPasswordRes.isLoading}
          loadingIndicator={<ButtonLoadingIndicator />}
          variant="contained"
          className={styles.profileResetButton}
          onClick={() => resetPasswordTrigger({ email })}
        >
          Reset Password
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default ProfileModal;
