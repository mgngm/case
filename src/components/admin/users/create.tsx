import { useState, useEffect } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import { DialogActions, FormControl, MenuItem, Select, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useForm } from 'react-hook-form';
import DialogStyles from 'src/components/admin/context-tab/dialogs/dialogs.module.scss';
import contextStyles from 'src/components/admin/context.module.scss';
import ButtonLoadingIndicator from 'src/components/shared/button/loader';
import { useAppSelector } from 'src/hooks';
import useAutofocus from 'src/hooks/use-autofocus';
import { containsUnicode } from 'src/logic/libs/helpers';
import { getErrorMessageFromRTK } from 'src/slices/api';
import {
  selectAvailableOrgLevelContextsForGivenPartner,
  useGetUserContextQuery,
  searchContexts,
} from 'src/slices/context';
import { selectCurrentUserSub, useCreateUserMutation } from 'src/slices/users';
import styles from './index.module.scss';

type CreateUserDialogProps = {
  open: boolean;
  onClose: () => void;
  userManagementContext: string;
};

const CreateUserDialog = ({ open, onClose, userManagementContext }: CreateUserDialogProps) => {
  const [createUserTrigger, createUserRes] = useCreateUserMutation();

  const handleClose = () => {
    onClose();
    setCustomError(null);
    createUserRes.reset();
    reset();
  };

  const userSub = useAppSelector(selectCurrentUserSub);
  const { data: availableContext } = useGetUserContextQuery(
    { userSub },
    {
      selectFromResult: ({ data }) => ({
        data,
      }),
    }
  );

  const autofocusRef = useAutofocus(open);

  const umContextInfo = availableContext && searchContexts(availableContext, userManagementContext);

  const partnerLevel = umContextInfo && 'partnerId' in umContextInfo;
  const partnerId =
    (umContextInfo &&
      ('partnerId' in umContextInfo
        ? umContextInfo.partnerId
        : 'partnerOrganisationsId' in umContextInfo
        ? umContextInfo.partnerOrganisationsId
        : undefined)) ??
    undefined;

  const orgContexts = selectAvailableOrgLevelContextsForGivenPartner(availableContext, partnerId);

  const [defaultContext, setDefaultContext] = useState(userManagementContext);
  const [customError, setCustomError] = useState<string | null>(null);

  useEffect(() => {
    setDefaultContext(orgContexts[0]?.value ?? userManagementContext);
  }, [orgContexts, userManagementContext]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<{ email: string }>();

  const { ref: emailFormRef, ...emailProps } = register('email', { required: true });

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle className={DialogStyles.dialogTitle}>Create User</DialogTitle>
      <DialogContent>
        <form className={styles.createUserForm}>
          <div className={styles.createUserInput}>
            <label>Email: </label>
            <TextField
              placeholder="Email"
              type="email"
              color={errors.email ? 'error' : undefined}
              ref={(el) => {
                emailFormRef(el);
                autofocusRef(el);
              }}
              {...emailProps}
            />
          </div>
          {partnerLevel ? (
            <div className={styles.defaultOrgDropdown}>
              <FormControl fullWidth>
                <label className={styles.contextLabel} htmlFor="default-org-select">
                  Initial Report Context:
                </label>
                <Select
                  labelId="default-org-select-label"
                  id="default-org-select"
                  MenuProps={{ id: 'default-org-select-menu' }}
                  value={defaultContext}
                  onChange={(e) => setDefaultContext(e.target.value)}
                  className={contextStyles.defaultOrgSelect}
                  sx={{
                    color: 'black',
                    background: 'white',
                    ':hover': { background: 'white', color: 'black' },
                  }}
                >
                  {Array.isArray(orgContexts) &&
                    orgContexts?.map((context) => {
                      if (context) {
                        const { value, partnerName, name } = context;
                        return (
                          <MenuItem key={value} value={value} className={contextStyles.contextItem}>
                            <span className={contextStyles.partnerName}>{partnerName}</span>
                            <span>{name}</span>
                          </MenuItem>
                        );
                      }
                      return null;
                    })}
                </Select>
              </FormControl>
            </div>
          ) : null}
          <DialogContentText>
            {errors.email && errors.email.type === 'required' && (
              <span className={styles.createUserError}>Please enter a valid email address</span>
            )}
            {createUserRes.error && (
              <span className={styles.createUserError}>{getErrorMessageFromRTK(createUserRes.error)}</span>
            )}
            {customError && <span className={styles.createUserError}>{customError}</span>}
            {createUserRes.isSuccess && <span className={styles.createUserSuccess}>User successfully created!</span>}
          </DialogContentText>
        </form>
      </DialogContent>
      <DialogActions>
        <Button id="create-user-close-button" variant="outlined" onClick={handleClose}>
          Close
        </Button>
        <LoadingButton
          id="create-user-submit-button"
          onClick={handleSubmit((data, event) => {
            setCustomError(null);
            event?.preventDefault();
            if (!containsUnicode(data.email)) {
              createUserTrigger({
                email: data.email,
                context: userManagementContext,
                defaultContext: defaultContext,
              });
            } else {
              setCustomError('You cannot have unicode in your email address');
            }
          })}
          loading={createUserRes.isLoading}
          loadingIndicator={<ButtonLoadingIndicator />}
          variant="contained"
        >
          Add User
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default CreateUserDialog;
