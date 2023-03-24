import { useState } from 'react';
import type { ChangeEvent } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { LoadingButton } from '@mui/lab';
import { TableCell, TableRow, useTheme } from '@mui/material';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import propTypes from 'prop-types';
import { MoonLoader } from 'react-spinners';
import ButtonLoadingIndicator from 'src/components/shared/button/loader';
import Input from 'src/components/shared/input';
import { TESSERACT_ADMIN_GROUP_NAME } from 'src/constants/admin';
import { useAppSelector } from 'src/hooks';
import useAutofocus from 'src/hooks/use-autofocus';
import { getErrorMessageFromRTK } from 'src/slices/api';
import {
  selectCurrentUserSub,
  useAddUserToGroupMutation,
  useDeleteUserMutation,
  useRemoveUserFromGroupMutation,
} from 'src/slices/users';
import type { LocalUser } from 'src/types/user';
import EditUserDialog from './edit-user';
import userStyles from './index.module.scss';

const UserRow = ({ user, userManagementContext }: { user: LocalUser; userManagementContext: string }) => {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const deleteBoxAutofocus = useAutofocus(deleteOpen);
  const [editOpen, setEditOpen] = useState(false);
  const [confirm, setConfirm] = useState('');
  const [dialogError, setDialogError] = useState('');
  const theme = useTheme();
  const currentUserSub = useAppSelector(selectCurrentUserSub);

  const disableActions = user.sso || currentUserSub === user.userSub;

  const [deleteUserTrigger, deleteUserRes] = useDeleteUserMutation({
    selectFromResult: ({ isSuccess, isLoading }) => ({ isSuccess, isLoading }),
  });

  const [addUserToGroup, addUserToGroupRes] = useAddUserToGroupMutation({
    selectFromResult: ({ isLoading, isSuccess }) => ({ isLoading, isSuccess }),
  });

  const [removeUserFromGroup, removeUserFromGroupRes] = useRemoveUserFromGroupMutation({
    selectFromResult: ({ isLoading, isSuccess }) => ({ isLoading, isSuccess }),
  });

  const handleClose = () => {
    setDeleteOpen(false);
    setEditOpen(false);
    setConfirm('');
    setDialogError('');
  };

  const handleDelete = async () => {
    try {
      await deleteUserTrigger({ email: user.email, context: userManagementContext }).unwrap();
      setDialogError('');
    } catch (error) {
      setDialogError(getErrorMessageFromRTK(error as FetchBaseQueryError) || '');
    }
  };

  const userName = user?.Username ?? null;
  const handleAdminCheckbox = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!userName) {
      return;
    }
    try {
      if (e.target.checked) {
        await addUserToGroup({
          userName,
          userSub: currentUserSub,
          groupName: TESSERACT_ADMIN_GROUP_NAME,
          context: userManagementContext,
        });
      } else {
        await removeUserFromGroup({
          userName,
          userSub: currentUserSub,
          groupName: TESSERACT_ADMIN_GROUP_NAME,
          context: userManagementContext,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <TableRow id={`user-row-${user.userSub}`}>
      <TableCell>{user.email}</TableCell>
      <TableCell>
        <IconButton
          disabled={disableActions}
          color="inherit"
          size="small"
          id={`edit-user-button-${user.userSub}`}
          onClick={() => (disableActions ? null : setEditOpen(true))}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          disabled={disableActions}
          color="inherit"
          size="small"
          id={`delete-user-button-${user.userSub}`}
          onClick={() => (disableActions ? null : setDeleteOpen(true))}
        >
          <DeleteIcon />
        </IconButton>
      </TableCell>
      <TableCell
        align={addUserToGroupRes.isLoading || removeUserFromGroupRes.isLoading ? 'left' : 'center'} // loader weirdness
        padding="checkbox"
      >
        {addUserToGroupRes.isLoading || removeUserFromGroupRes.isLoading ? (
          <div className={userStyles.loader}>
            <MoonLoader color={theme.palette.primary.main} size={20} />
          </div>
        ) : (
          <Checkbox disabled={user.userSub === currentUserSub} checked={user.admin} onChange={handleAdminCheckbox} />
        )}
      </TableCell>
      <TableCell align="center" padding="checkbox">
        <Checkbox disabled={true} checked={user.sso} />
      </TableCell>

      <EditUserDialog open={editOpen} onClose={handleClose} user={user} />

      <Dialog open={deleteOpen} onClose={handleClose}>
        <DialogTitle>Delete User?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <span>Are you sure you want to delete {user.email}? This action cannot be undone.</span>
            <div className={userStyles.inputWrapper}>
              <label className={userStyles.inputLabel} htmlFor="confirm">
                Type &lsquo;delete&rsquo; to continue
              </label>
              <Input ref={deleteBoxAutofocus} id="confirm" onChange={(e) => setConfirm(e.target.value)} />
            </div>
          </DialogContentText>
          {dialogError ? <span className={userStyles.deleteUserError}>{dialogError}</span> : null}
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <LoadingButton
            variant="contained"
            color="error"
            loading={deleteUserRes.isLoading}
            loadingIndicator={<ButtonLoadingIndicator />}
            disabled={confirm !== 'delete'}
            onClick={handleDelete}
          >
            Delete
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </TableRow>
  );
};

UserRow.propTypes = {
  user: propTypes.object,
  disabled: propTypes.bool,
};

export default UserRow;
