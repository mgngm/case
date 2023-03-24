import { useState, useCallback } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ButtonLoadingIndicator from 'src/components/shared/button/loader';
import Input from 'src/components/shared/input';
import type { Partner } from 'src/graphql';
import { useAppSelector } from 'src/hooks';
import useAutofocus from 'src/hooks/use-autofocus';
import { selectOrgIdsForPartner, useGetUserContextQuery } from 'src/slices/context';
import { selectCurrentUserSub } from 'src/slices/users';
import type { BaseDialogActionProps } from 'src/types/dialogs';
import styles from './dialogs.module.scss';

export enum CreateType {
  partner,
  organisation,
}

type CreateDialogProps<Result> =
  | (BaseDialogActionProps<
      [arg: { name: string; partnerId: string }],
      { unwrap: () => Promise<Result> },
      [r: Awaited<Result>]
    > & {
      type: CreateType.partner;
      partnerIds: string[];
      partner?: never;
    })
  | (BaseDialogActionProps<
      [arg: { name: string; organisationId: string; partner: Partner }],
      { unwrap: () => Promise<Result> },
      [r: Awaited<Result>]
    > & {
      type: CreateType.organisation;
      partnerIds?: never;
      partner: Partner;
    });

const isIdUnique = (id: string, partnerIds?: string[], partnerId?: string, orgIds?: string[]): boolean => {
  if (partnerIds) {
    return partnerIds.indexOf(id) === -1;
  }

  if (partnerId && orgIds) {
    return orgIds.indexOf(`${partnerId}/${id}`) === -1;
  }

  //If we can't be sure do we really want to just make the org?
  return false;
};

const CreateDialog = <Result,>({
  type,
  isOpen,
  handleClose,
  onCancel,
  onSuccess,
  partnerIds,
  partner,
  onAction,
  isLoading,
  reset,
}: CreateDialogProps<Result>) => {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [validationError, setValidationError] = useState('');
  const [error, setError] = useState<unknown | null>(null);
  const close = useCallback(() => {
    setValidationError('');
    setError(null);
    setId('');
    setName('');
    reset?.();
    handleClose?.();
  }, [handleClose, reset]);

  const userSub = useAppSelector(selectCurrentUserSub);
  const { data } = useGetUserContextQuery(
    { userSub },
    {
      selectFromResult: ({ data }) => ({
        data,
      }),
    }
  );

  const orgIds = data && selectOrgIdsForPartner(data, partner?.partnerId);

  const autofocusRef = useAutofocus(isOpen);

  return (
    <Dialog
      open={isOpen}
      onClose={close}
      aria-labelledby="create-context-dialog-title"
      aria-describedby="create-context-dialog-description"
      fullWidth={true}
      maxWidth={'sm'}
    >
      <DialogTitle className={styles.dialogTitle} id="create-context-dialog-title">
        Add {type === CreateType.organisation ? 'Organisation' : 'Partner'}
      </DialogTitle>
      <DialogContent>
        <h3 className={styles.dialogSubtitle}>
          {type === CreateType.organisation ? 'Organisation' : 'Partner'} details:
        </h3>
        {error ? (
          <Alert className={styles.alert} severity="error">
            Error: could not update {type === CreateType.organisation ? 'organisation' : 'partner'}
          </Alert>
        ) : null}
        {validationError ? (
          <Alert className={styles.alert} severity="warning">
            Validation Error: {validationError}
          </Alert>
        ) : null}
        <DialogContentText className={styles.dialogInner} id="create-context-dialog-form">
          <div className={styles.inputWrapper}>
            <label className={styles.inputLabel} htmlFor="id">
              ID:
            </label>
            <Input
              id="org-id-field"
              name="id"
              className={styles.inputStyle}
              value={id}
              ref={autofocusRef}
              onChange={(ev) => setId(ev.target.value)}
              required
            />
          </div>
          <div className={styles.inputWrapper}>
            <label className={styles.inputLabel} htmlFor="name">
              Name:
            </label>
            <Input
              id="org-name-field"
              name="name"
              className={styles.inputStyle}
              value={name}
              onChange={(ev) => setName(ev.target.value)}
              required
            />
          </div>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          id={`create-${type === CreateType.organisation ? 'org' : 'partner'}-close-button`}
          onClick={onCancel ? onCancel : close}
          variant="outlined"
        >
          Cancel
        </Button>
        <LoadingButton
          id={`create-${type === CreateType.organisation ? 'org' : 'partner'}-confirm-button`}
          loading={isLoading}
          variant="contained"
          loadingIndicator={<ButtonLoadingIndicator />}
          onClick={async (ev) => {
            ev?.preventDefault();

            setValidationError('');

            const validationObj = {
              ['ID missing']: id.length > 0,
              ['ID cannot contain slashes (/)']: !id.includes('/'),
              ['ID cannot contain spaces']: !id.includes(' '),
              ['ID contains invalid characters']: /^[a-zA-Z0-9-_]+$/u.test(id),
              ['name missing']: name.length > 0,
              ['ID already exists']: isIdUnique(id, partnerIds, partner?.partnerId, orgIds),
            };

            if (Object.values(validationObj).every((v) => v)) {
              try {
                const resp =
                  type === CreateType.organisation
                    ? await onAction({ name, organisationId: id, partner }).unwrap()
                    : await onAction({ name, partnerId: id }).unwrap();

                onSuccess?.(resp);
                close();
              } catch (error) {
                console.error(error);
                setError(error);
              }
            } else {
              setValidationError(
                Object.entries(validationObj)
                  .filter(([, res]) => !res)
                  .map(([rule]) => rule)
                  .join(', ')
              );
            }
          }}
          autoFocus
        >
          Save
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default CreateDialog;
